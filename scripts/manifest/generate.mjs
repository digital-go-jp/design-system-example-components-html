import fs from "node:fs";
import path from "node:path";
import Ajv from "ajv";
import { parse as parseHtml } from "node-html-parser";
import { parseTarget } from "../../.storybook/dads-md/references.mjs";
import { markdownReferences } from "./markdown.mjs";
import { fileLists, Resources } from "./resources.mjs";

const ids = (object) => Object.keys(object).sort();
const unique = (items) => [...new Set(items)];
const schemaValidators = new WeakMap();

export function dependencyClosure(components, roots) {
  const result = [];
  const seen = new Set();
  const visit = (id) => {
    if (!Object.hasOwn(components, id))
      throw new Error(`依存コンポーネントが存在しません: ${id}`);
    if (seen.has(id)) return;
    seen.add(id);
    for (const dependency of components[id].dependencies) visit(dependency);
    result.push(id);
  };
  for (const id of roots) visit(id);
  return result;
}

export function validateSchema(value, schema) {
  let validator = schemaValidators.get(schema);
  if (!validator) {
    const ajv = new Ajv({ allErrors: true, strict: true });
    validator = { ajv, validate: ajv.compile(schema) };
    schemaValidators.set(schema, validator);
  }
  const { ajv, validate } = validator;
  if (!validate(value))
    throw new Error(
      `マニフェストのスキーマ違反:\n${ajv.errorsText(validate.errors, { separator: "\n" })}`,
    );
}

export function loadConfig(root) {
  const read = (file) =>
    JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
  const schema = read("src/components/component.schema.json");
  const components = {};
  for (const entry of fs
    .readdirSync(path.join(root, "src/components"), { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name, "en"))) {
    if (!entry.isDirectory()) continue;
    const file = `src/components/${entry.name}/component.json`;
    if (!fs.existsSync(path.join(root, file))) continue;
    const metadata = read(file);
    try {
      validateSchema(metadata, schema);
    } catch (error) {
      throw new Error(`${file}: ${error.message}`);
    }
    components[entry.name] = metadata;
  }
  return {
    githubBaseUrl:
      "https://github.com/digital-go-jp/design-system-example-components-html/tree/main/",
    storybookBaseUrl: "https://design.digital.go.jp/dads/html/",
    shared: { css: ["src/global.css"], js: [] },
    components,
  };
}

function documentInfo(resources, file, examples, entries) {
  const parsed = markdownReferences(resources.read(file));
  const references = [];
  const assets = [];
  for (const target of parsed.assets) {
    const resolved = resources.resolve(file, target);
    if (resolved) assets.push(resolved);
  }
  for (const target of parsed.references) {
    const parsedTarget = parseTarget(target);
    if (/^(?:\.\/)?\?path=/.test(target)) {
      const route = new URLSearchParams(parsedTarget.query).get("path");
      const id = route?.match(/^\/(?:story|docs)\/(.+)$/)?.[1];
      if (id) {
        if (!entries.some((entry) => entry.id === id))
          throw new Error(`${file}: Storybook参照が存在しません: ${id}`);
        references.push({
          type: "storybook",
          entryId: id,
          ...(parsedTarget.hash ? { fragment: parsedTarget.hash } : {}),
        });
      }
      continue;
    }
    const resolved = resources.resolve(file, target);
    if (!resolved) continue;
    if (/\.stories\.(ts|js)$/.test(resolved)) {
      const exportName = parsedTarget.hash || "Playground";
      const story = entries.find(
        (entry) =>
          entry.type === "story" &&
          entry.exportName === exportName &&
          entry.importPath?.replace(/^\.\//, "") === resolved,
      );
      if (!story)
        throw new Error(
          `${file}: ストーリーexportが存在しません: ${exportName}`,
        );
      references.push({
        type: "story",
        entryId: story.id,
        exportName,
        parameters: Object.fromEntries(new URLSearchParams(parsedTarget.query)),
      });
    } else if (resolved.endsWith(".html")) {
      const exampleId = Object.entries(examples).find(
        ([, example]) => example.html === resolved,
      )?.[0];
      if (!exampleId)
        throw new Error(`${file}: サンプル一覧にないHTML参照: ${resolved}`);
      if (
        parsedTarget.hash &&
        !parseHtml(resources.read(resolved)).querySelectorAll(parsedTarget.hash)
          .length
      )
        throw new Error(`${file}: 抽出セレクターが一致しません: ${target}`);
      references.push({
        type: "example",
        exampleId,
        ...(parsedTarget.hash ? { selector: parsedTarget.hash } : {}),
      });
    }
    // 付属CSS/JSへのリンクは存在だけ検証し、再掲しない。
  }
  return {
    markdown: file,
    assets: unique(assets).sort(),
    references: [
      ...new Map(
        references.map((item) => [JSON.stringify(item), item]),
      ).values(),
    ],
  };
}

function normalizeComponents(metadata, resources) {
  const components = {};
  for (const id of ids(metadata)) {
    const input = metadata[id];
    if (!/^[a-z][a-z\d]*(?:-[a-z\d]+)*$/.test(id))
      throw new Error(`不正なコンポーネントID: ${id}`);
    if (
      typeof input.name !== "string" ||
      !input.name ||
      !Array.isArray(input.dependencies)
    )
      throw new Error(`${id}: name/dependenciesを定義してください`);
    const sourceDir = `src/components/${id}`;
    const files = {};
    for (const kind of ["css", "js"]) {
      if (!Array.isArray(input.files?.[kind]))
        throw new Error(`${id}: files.${kind}を定義してください`);
      files[kind] = input.files[kind].map((file) => {
        if (
          file.includes("/") ||
          file.includes("\\") ||
          file.endsWith(".stories.css") ||
          !file.endsWith(`.${kind}`)
        )
          throw new Error(`${id}: 不正な付属ファイル: ${file}`);
        const resolved = `${sourceDir}/${file}`;
        resources.assertFile(resolved);
        return resolved;
      });
    }
    if (input.files.assets) {
      files.assets = input.files.assets.map((file) => {
        const resolved = resources.resolve(
          `${sourceDir}/${id}.md`,
          `./${file}`,
        );
        if (!resolved?.startsWith(`${sourceDir}/`))
          throw new Error(
            `${id}: 付属アセットはコンポーネント内に配置してください: ${file}`,
          );
        return resolved;
      });
    }
    components[id] = {
      name: input.name,
      sourceDir,
      files,
      dependencies: unique(input.dependencies).sort(),
    };
  }
  return components;
}

function assertRegisteredComponents(root, components) {
  for (const entry of fs.readdirSync(path.join(root, "src/components"), {
    withFileTypes: true,
  })) {
    if (!entry.isDirectory()) continue;
    const names = fs.readdirSync(path.join(root, "src/components", entry.name));
    if (
      names.some((name) => name.endsWith(".html") || name.endsWith(".md")) &&
      !Object.hasOwn(components, entry.name)
    )
      throw new Error(`component.json未登録のコンポーネント: ${entry.name}`);
  }
}

function createFileOwners(components) {
  const owners = new Map();
  for (const id of ids(components)) {
    dependencyClosure(components, [id]);
    for (const file of [
      ...components[id].files.css,
      ...components[id].files.js,
    ]) {
      if (owners.has(file))
        throw new Error(`付属ファイルの所属が重複しています: ${file}`);
      owners.set(file, id);
    }
  }
  return owners;
}

function exampleInfo({ resources, sourceDir, names, base, owners, installed }) {
  const examples = {};
  for (const name of names.filter((name) => name.endsWith(".html"))) {
    const exampleId = name.slice(0, -5);
    const html = `${sourceDir}/${name}`;
    const referenced = resources
      .collect([html])
      .filter((file) => file !== html);
    const dependencies = unique(
      referenced
        .filter((file) => !base.has(file) && owners.has(file))
        .map((file) => owners.get(file)),
    ).sort();
    const provided = new Set([...base, ...installed(dependencies)]);
    examples[exampleId] = {
      html,
      dependencies,
      additionalFiles: fileLists(
        referenced.filter((file) => !provided.has(file)),
      ),
      externalResources: resources.external(html),
    };
  }
  return examples;
}

function storybookInfo({ id, sourceDir, names, defaultStory, entries }) {
  const storyFiles = names.filter((name) => /\.stories\.(ts|js)$/.test(name));
  if (storyFiles.length !== 1)
    throw new Error(`${id}: storiesファイルは1つ必要です`);
  const storyFile = `${sourceDir}/${storyFiles[0]}`;
  for (const entry of entries) {
    const file = entry.importPath?.replace(/^\.\//, "");
    if (
      (file === storyFile || file === `${sourceDir}/${id}.mdx`) &&
      entry.type !== "docs" &&
      entry.type !== "story"
    )
      throw new Error(
        `${id}: 不明なStorybookエントリー種別: ${entry.type} (${entry.id})`,
      );
  }
  const docsEntries = entries.filter(
    (entry) =>
      entry.type === "docs" &&
      entry.importPath?.replace(/^\.\//, "") === `${sourceDir}/${id}.mdx`,
  );
  if (docsEntries.length !== 1)
    throw new Error(`${id}: Storybookのドキュメントが一意に見つかりません`);
  const storyEntries = entries.filter(
    (entry) =>
      entry.type === "story" &&
      entry.importPath?.replace(/^\.\//, "") === storyFile,
  );
  const stories = storyEntries.map((entry) => {
    if (!entry.exportName)
      throw new Error(`${id}: index.jsonにexportNameがありません: ${entry.id}`);
    return { id: entry.id, name: entry.name, exportName: entry.exportName };
  });
  if (!stories.length)
    throw new Error(`${id}: Storybookのストーリーが見つかりません`);
  const defaultEntry = defaultStory
    ? storyEntries.find((entry) => entry.exportName === defaultStory)
    : docsEntries[0];
  if (!defaultEntry) throw new Error(`${id}: defaultStoryが存在しません`);
  return {
    title: docsEntries[0].title,
    defaultEntryId: defaultEntry.id,
    defaultEntryPath: `/${defaultEntry.type}/${defaultEntry.id}`,
    docs: { id: docsEntries[0].id },
    stories,
  };
}

export function generateManifest({ root, config, index, schema }) {
  const resources = new Resources(root);
  if (!index || index.v !== 5 || !index.entries)
    throw new Error(
      "Storybook index.json v5が必要です。先にStorybookをビルドしてください。",
    );
  for (const [key, entry] of Object.entries(index.entries)) {
    if (!entry || typeof entry.id !== "string" || !entry.id || entry.id !== key)
      throw new Error(`Storybook indexのエントリーIDが不正です: ${key}`);
  }
  const components = normalizeComponents(config.components, resources);
  assertRegisteredComponents(root, components);
  const owners = createFileOwners(components);
  const installed = (roots) =>
    unique(
      dependencyClosure(components, roots).flatMap((id) =>
        Object.values(components[id].files).flat(),
      ),
    );
  const shared = new Set(Object.values(config.shared).flat());
  for (const file of shared) resources.assertFile(file);
  const entries = Object.values(index.entries);
  for (const id of ids(components)) {
    const component = components[id];
    const input = config.components[id];
    const base = new Set([...shared, ...installed([id])]);
    const names = fs.readdirSync(path.join(root, component.sourceDir)).sort();
    const examples = exampleInfo({
      resources,
      sourceDir: component.sourceDir,
      names,
      base,
      owners,
      installed,
    });
    const storybook = storybookInfo({
      id,
      sourceDir: component.sourceDir,
      names,
      defaultStory: input.defaultStory,
      entries,
    });
    components[id] = {
      ...component,
      documentation: documentInfo(
        resources,
        `${component.sourceDir}/${id}.md`,
        examples,
        entries,
      ),
      examples,
      storybook,
    };
  }
  const manifest = {
    $schema: "./component-manifest.schema.json",
    schemaVersion: 1,
    shared: config.shared,
    github: { baseUrl: config.githubBaseUrl },
    storybook: { baseUrl: config.storybookBaseUrl },
    components,
  };
  if (schema) validateSchema(manifest, schema);
  return manifest;
}
