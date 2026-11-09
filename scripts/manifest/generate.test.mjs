import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  dependencyClosure,
  generateManifest,
  loadConfig,
  validateSchema,
} from "./generate.mjs";
import { markdownReferences } from "./markdown.mjs";
import { Resources, srcsetUrls } from "./resources.mjs";

const repository = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const schema = JSON.parse(
  fs.readFileSync(
    path.join(repository, "component-manifest.schema.json"),
    "utf8",
  ),
);
const temporaryDirectories = [];
afterEach(() => {
  for (const directory of temporaryDirectories.splice(0))
    fs.rmSync(directory, { recursive: true, force: true });
});

function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dads-manifest-test-"));
  temporaryDirectories.push(root);
  const write = (file, contents = "") => {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), contents);
  };
  write("src/global.css", ":root { --color: black; }");
  const config = {
    githubBaseUrl:
      "https://github.com/digital-go-jp/design-system-example-components-html/tree/main/",
    storybookBaseUrl: "https://example.test/html/",
    shared: { css: ["src/global.css"], js: [] },
    components: {},
  };
  const index = { v: 5, entries: {} };
  const add = (id, dependencies = []) => {
    config.components[id] = {
      name: id,
      files: { css: [`${id}.css`], js: [] },
      dependencies,
    };
    write(`src/components/${id}/${id}.css`, `.dads-${id} { color: black; }`);
    write(
      `src/components/${id}/${id}.md`,
      `[playground](./playground.html#.dads-${id})\n\n[CSS](./${id}.css)\n`,
    );
    write(`src/components/${id}/${id}.mdx`);
    write(
      `src/components/${id}/playground.html`,
      `<link rel="stylesheet" href="../../global.css"><link rel="stylesheet" href="${id}.css"><div class="dads-${id}"></div>`,
    );
    // ソースの内容には依存せず、Storybookインデックスだけから情報を得る。
    write(
      `src/components/${id}/${id}.stories.ts`,
      "not parsed by the manifest generator",
    );
    index.entries[`${id}--docs`] = {
      id: `${id}--docs`,
      type: "docs",
      title: id,
      name: "Docs",
      importPath: `./src/components/${id}/${id}.mdx`,
    };
    index.entries[`${id}--playground`] = {
      id: `${id}--playground`,
      type: "story",
      title: id,
      name: "Playground",
      exportName: "Playground",
      importPath: `./src/components/${id}/${id}.stories.ts`,
    };
  };
  return {
    root,
    write,
    config,
    index,
    add,
    generate: () => generateManifest({ root, config, index, schema }),
  };
}

test("本体・再帰依存・共通ファイルを除外し、サンプル依存と追加ファイルを分ける", () => {
  const f = fixture();
  f.add("button");
  f.add("calendar", ["button"]);
  f.add("picker");
  f.write("src/components/picker/demo.css");
  f.write("src/components/picker/image.png");
  f.write(
    "src/components/picker/playground.html",
    `<link rel="stylesheet" href="../../global.css"><link rel="stylesheet" href="picker.css"><link rel="stylesheet" href="../calendar/calendar.css"><link rel="stylesheet" href="../button/button.css"><link rel="stylesheet" href="demo.css"><script src="https://cdn.example.test/polyfill.js"></script><div class="dads-picker"><img src="image.png"></div>`,
  );
  const result = f.generate().components.picker.examples.playground;
  assert.deepEqual(result.dependencies, ["button", "calendar"]);
  assert.deepEqual(result.additionalFiles, {
    css: ["src/components/picker/demo.css"],
    js: [],
    assets: ["src/components/picker/image.png"],
  });
  assert.deepEqual(result.externalResources, {
    css: [],
    js: [{ src: "https://cdn.example.test/polyfill.js" }],
  });
  f.config.components.picker.dependencies = ["calendar"];
  assert.deepEqual(
    f.generate().components.picker.examples.playground.dependencies,
    [],
  );
});

test("HTMLのstories.cssは追加ファイルに残し、Storybook側のCSS情報は載せない", () => {
  const f = fixture();
  f.add("button");
  f.write("src/components/button/button.stories.css");
  f.write(
    "src/components/button/playground.html",
    `<link rel="stylesheet" href="button.css"><link rel="stylesheet" href="button.stories.css"><div class="dads-button"></div>`,
  );
  const result = f.generate().components.button;
  assert.deepEqual(result.examples.playground.additionalFiles.css, [
    "src/components/button/button.stories.css",
  ]);
  assert.equal(Object.hasOwn(result.storybook, "additionalFiles"), false);
});

test("文書の抽出範囲とControlsを保持し、CSS/JS参照は再掲しない", () => {
  const f = fixture();
  f.add("button");
  f.write(
    "src/components/button/button.md",
    `[Playground](./button.stories.ts?controls#Playground)\n\n[HTML](./playground.html#.dads-button)\n\n[CSS](./button.css)\n`,
  );
  assert.deepEqual(f.generate().components.button.documentation.references, [
    {
      type: "story",
      entryId: "button--playground",
      exportName: "Playground",
      parameters: { controls: "" },
    },
    { type: "example", exampleId: "playground", selector: ".dads-button" },
  ]);
});

test("説明画像は冒頭importだけを取得し、imgタグやコード例のimportは読まない", () => {
  const f = fixture();
  f.add("button");
  f.write("src/components/button/docs/shot.webp");
  f.write("src/components/button/docs/shot@2x.webp");
  f.write(
    "src/components/button/button.md",
    `import shot from "./docs/shot.webp";\nimport shot2 from './docs/shot@2x.webp';\n\n<img src={shot} srcSet={shot2} />\n<img src="missing.png">\n\n\`\`\`js\nimport missing from "./missing.png";\n\`\`\`\n`,
  );
  assert.deepEqual(f.generate().components.button.documentation.assets, [
    "src/components/button/docs/shot.webp",
    "src/components/button/docs/shot@2x.webp",
  ]);
  assert.deepEqual(
    markdownReferences("本文\nimport missing from './missing.png';").assets,
    [],
  );
});

test("ストーリー情報はindex.jsonだけから取得し、HTML対応を載せない", () => {
  const f = fixture();
  f.add("button");
  f.index.entries["custom-id"] = {
    id: "custom-id",
    type: "story",
    title: "button",
    name: "別表示",
    exportName: "Alternate",
    importPath: "./src/components/button/button.stories.ts",
  };
  assert.deepEqual(f.generate().components.button.storybook.stories[1], {
    id: "custom-id",
    name: "別表示",
    exportName: "Alternate",
  });
  f.config.components.button.defaultStory = "Alternate";
  assert.equal(
    f.generate().components.button.storybook.defaultEntryId,
    "custom-id",
  );
  assert.equal(
    f.generate().components.button.storybook.defaultEntryPath,
    "/story/custom-id",
  );
});

test("GitHubの基底URLと変更していないsourceDirから公開URLを生成できる", () => {
  const f = fixture();
  f.add("button");
  const manifest = f.generate();
  assert.equal(manifest.components.button.sourceDir, "src/components/button");
  assert.equal(
    new URL(manifest.components.button.sourceDir, manifest.github.baseUrl).href,
    "https://github.com/digital-go-jp/design-system-example-components-html/tree/main/src/components/button",
  );
});

for (const type of ["docs", "story"]) {
  test(`${type}: indexの種別とIDから未エンコードの代表パスを生成する`, () => {
    const f = fixture();
    f.add("button");
    const oldId = type === "docs" ? "button--docs" : "button--playground";
    const entryId =
      type === "docs"
        ? "components-ボタン／日本語--playground"
        : "components-ボタン／日本語--docs";
    f.index.entries[entryId] = {
      ...f.index.entries[oldId],
      id: entryId,
      title: "種別を判定できないタイトル",
    };
    delete f.index.entries[oldId];
    if (type === "story")
      f.config.components.button.defaultStory = "Playground";
    const manifest = f.generate();
    const result = manifest.components.button.storybook;
    assert.equal(result.defaultEntryId, entryId);
    assert.equal(result.defaultEntryPath, `/${type}/${entryId}`);
    const url = new URL(manifest.storybook.baseUrl);
    url.searchParams.set("path", result.defaultEntryPath);
    assert.equal(
      new URL(url.href).searchParams.get("path"),
      `/${type}/${entryId}`,
    );
  });
}

test("新フィールドの必須指定とURL・pathの形式を検証する", () => {
  const f = fixture();
  f.add("button");
  const cases = [
    (m) => delete m.github,
    (m) => delete m.github.baseUrl,
    (m) => {
      m.github.baseUrl = m.github.baseUrl.slice(0, -1);
    },
    (m) => {
      m.github.baseUrl = "not-a-url/";
    },
    (m) => delete m.components.button.storybook.defaultEntryPath,
    ...["/docs/", "/unknown/button--docs", "?path=/docs/button--docs"].map(
      (value) => (m) => {
        m.components.button.storybook.defaultEntryPath = value;
      },
    ),
  ];
  for (const change of cases) {
    const manifest = f.generate();
    change(manifest);
    assert.throws(() => validateSchema(manifest, schema), /スキーマ違反/);
  }
});

test("未定義依存は失敗し、循環しても解決が停止する", () => {
  assert.throws(
    () => dependencyClosure({ a: { dependencies: ["missing"] } }, ["a"]),
    /missing/,
  );
  assert.deepEqual(
    dependencyClosure(
      { a: { dependencies: ["b"] }, b: { dependencies: ["a"] } },
      ["a"],
    ),
    ["b", "a"],
  );
});

test("存在しないファイル・抽出対象・ストーリー参照は失敗する", () => {
  const f = fixture();
  f.add("button");
  f.write(
    "src/components/button/button.md",
    `[HTML](./playground.html#.missing)\n`,
  );
  assert.throws(f.generate, /抽出セレクター/);
  f.write(
    "src/components/button/button.md",
    `[Story](./button.stories.ts#Missing)\n`,
  );
  assert.throws(f.generate, /export/);
  f.write("src/components/button/button.md", `[CSS](./missing.css)\n`);
  assert.throws(f.generate, /存在しません/);
});

test("HTMLのsrcsetを取得し、CSS/JSとインラインコードは解析しない", () => {
  const f = fixture();
  f.write(
    "demo.css",
    `@import './missing.css'; x { background: url('missing.png'); }`,
  );
  f.write(
    "demo.js",
    `import './missing.js'; new URL('missing.png', import.meta.url);`,
  );
  f.write("photo.png");
  f.write("photo@2x.png");
  f.write(
    "demo.html",
    `<link rel="stylesheet" href="demo.css"><img src="photo.png" srcset="photo.png 1x, photo@2x.png 2x"><script src="demo.js"></script><style>x{background:url('missing.png')}</style><script>import './missing.js';</script>`,
  );
  assert.deepEqual(new Resources(f.root).collect(["demo.html"]), [
    "demo.html",
    "demo.css",
    "photo.png",
    "photo@2x.png",
    "demo.js",
  ]);
  assert.deepEqual(
    srcsetUrls("data:image/png;base64,AAAA 1x, photo@2x.png 2x"),
    ["data:image/png;base64,AAAA", "photo@2x.png"],
  );
});

test("ローカルファイルの収集では外部・埋め込み参照を無視し、リポジトリ外への参照を拒否する", () => {
  const f = fixture();
  const resources = new Resources(f.root);
  assert.equal(
    resources.resolve("demo.html", "https://example.test/a.png"),
    null,
  );
  assert.equal(
    resources.resolve("demo.html", "data:image/png;base64,AAAA"),
    null,
  );
  assert.equal(resources.resolve("demo.html", "#icon"), null);
  assert.throws(
    () => resources.resolve("demo.html", "../outside.png"),
    /リポジトリ外/,
  );
});

test("外部CSS・JSをタグで判別し、任意属性・出現順を保持して重複を除く", () => {
  const f = fixture();
  f.add("button");
  f.write(
    "src/components/button/playground.html",
    `<link rel="stylesheet" href="button.css">
<link rel="stylesheet" href="https://cdn.example.test/styles?version=1&amp;theme=dark" integrity="sha384-css" crossorigin="anonymous" media="screen">
<link rel="stylesheet" href="//cdn.example.test/second.js" crossorigin>
<link rel="stylesheet" href="http://cdn.example.test/third">
<script src="https://cdn.example.test/script.css" integrity="sha384-js" crossorigin="use-credentials" type="module" async defer></script>
<script src="//cdn.example.test/second"></script>
<script src="https://cdn.example.test/script.css" integrity="sha384-js" crossorigin="use-credentials"></script>
<link rel="stylesheet" href="//cdn.example.test/second.js" crossorigin>
<script src="https://cdn.example.test/script.css"></script>
<div class="dads-button"></div>`,
  );
  const example = f.generate().components.button.examples.playground;
  assert.deepEqual(example.externalResources, {
    css: [
      {
        href: "https://cdn.example.test/styles?version=1&theme=dark",
        integrity: "sha384-css",
        crossorigin: "anonymous",
      },
      { href: "//cdn.example.test/second.js", crossorigin: "" },
      { href: "http://cdn.example.test/third" },
    ],
    js: [
      {
        src: "https://cdn.example.test/script.css",
        integrity: "sha384-js",
        crossorigin: "use-credentials",
      },
      { src: "//cdn.example.test/second" },
      { src: "https://cdn.example.test/script.css" },
    ],
  });
  assert.deepEqual(example.additionalFiles, { css: [], js: [], assets: [] });
});

test("Google Fonts・preconnect・画像・埋め込み参照・インラインコードを外部リソースに含めない", () => {
  const f = fixture();
  f.add("button");
  f.write(
    "src/components/button/playground.html",
    `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP">
<link rel="stylesheet" href="//fonts.googleapis.com/css?family=Noto+Sans+JP">
<link rel="stylesheet" href="https://FONTS.GOOGLEAPIS.COM/css">
<link rel="preload" href="https://cdn.example.test/styles" as="style">
<link rel="stylesheet" href="data:text/css,body{}">
<script src="data:text/javascript,void(0)"></script>
<script src="blob:https://example.test/id"></script>
<script src="#script"></script>
<script>import 'https://cdn.example.test/script';</script>
<style>@import 'https://cdn.example.test/styles';</style>
<img src="https://cdn.example.test/image.png">
<div class="dads-button"></div>`,
  );
  assert.deepEqual(
    f.generate().components.button.examples.playground.externalResources,
    { css: [], js: [] },
  );
  f.write(
    "demo.html",
    `<link rel="stylesheet" href="https://fonts.googleapis.com.example.test/css">`,
  );
  assert.deepEqual(new Resources(f.root).external("demo.html"), {
    css: [{ href: "https://fonts.googleapis.com.example.test/css" }],
    js: [],
  });
});

test("外部リソースのSchemaは種別ごとのURLを必須にし、属性の型と未知の項目を検証する", () => {
  const f = fixture();
  f.add("button");
  const result = f.generate();
  const example = result.components.button.examples.playground;
  assert.deepEqual(example.externalResources, { css: [], js: [] });
  for (const [kind, attribute] of [
    ["css", "href"],
    ["js", "src"],
  ]) {
    for (const resource of [
      {},
      { [attribute]: "relative/path" },
      { [attribute]: "data:text/plain,test" },
      { [attribute]: "https://example.test/resource", integrity: 1 },
      { [attribute]: "https://example.test/resource", crossorigin: true },
      { [attribute]: "https://example.test/resource", unknown: "value" },
    ]) {
      example.externalResources = { css: [], js: [], [kind]: [resource] };
      assert.throws(() => validateSchema(result, schema), /スキーマ違反/);
    }
  }
});

test("同じ入力から同じ結果を生成し、未知のスキーマ項目を拒否する", () => {
  const f = fixture();
  f.add("button");
  assert.deepEqual(f.generate(), f.generate());
  const result = f.generate();
  assert.equal(result.$schema, "./component-manifest.schema.json");
  result.schemaVersion = 2;
  assert.throws(() => validateSchema(result, schema), /スキーマ違反/);
});

test("同じSchemaを再利用しても検証エラーが次の検証に残らない", () => {
  const valueSchema = {
    type: "object",
    required: ["name"],
    properties: { name: { type: "string" } },
    additionalProperties: false,
  };
  assert.throws(
    () => validateSchema({}, valueSchema),
    /required property 'name'/,
  );
  assert.throws(
    () => validateSchema({ name: 1 }, valueSchema),
    /must be string/,
  );
  assert.doesNotThrow(() => validateSchema({ name: "button" }, valueSchema));
  assert.doesNotThrow(() => validateSchema(1, { type: "number" }));
  assert.throws(
    () => validateSchema({}, valueSchema),
    /required property 'name'/,
  );
});

test("異なるSchemaオブジェクトは同じ$idでも独立して検証する", () => {
  const stringSchema = { $id: "https://example.test/value", type: "string" };
  const numberSchema = { $id: "https://example.test/value", type: "number" };
  assert.doesNotThrow(() => validateSchema("button", stringSchema));
  assert.doesNotThrow(() => validateSchema(1, numberSchema));
  assert.throws(() => validateSchema(1, stringSchema), /must be string/);
  assert.throws(() => validateSchema("button", numberSchema), /must be number/);
});

test("付属JSとアセットを保持し、サンプルの追加ファイルから除外する", () => {
  const f = fixture();
  f.add("button");
  f.config.components.button.files.js = ["button.js"];
  f.config.components.button.files.assets = ["images/icon.svg"];
  f.write("src/components/button/button.js");
  f.write("src/components/button/images/icon.svg");
  f.write(
    "src/components/button/playground.html",
    `<link rel="stylesheet" href="button.css"><script src="button.js"></script><div class="dads-button"><img src="images/icon.svg"></div>`,
  );
  const result = f.generate().components.button;
  assert.deepEqual(result.files, {
    css: ["src/components/button/button.css"],
    js: ["src/components/button/button.js"],
    assets: ["src/components/button/images/icon.svg"],
  });
  assert.deepEqual(result.examples.playground.additionalFiles, {
    css: [],
    js: [],
    assets: [],
  });
});

test("Storybook情報の取得で既存のエラー条件を維持する", async (t) => {
  const cases = [
    {
      name: "storiesファイルが複数ある",
      change: (f) => f.write("src/components/button/extra.stories.js"),
      message: "button: storiesファイルは1つ必要です",
    },
    {
      name: "Docsがない",
      change: (f) => delete f.index.entries["button--docs"],
      message: "button: Storybookのドキュメントが一意に見つかりません",
    },
    {
      name: "Docsが複数ある",
      change: (f) => {
        f.index.entries["duplicate--docs"] = {
          ...f.index.entries["button--docs"],
          id: "duplicate--docs",
        };
      },
      message: "button: Storybookのドキュメントが一意に見つかりません",
    },
    {
      name: "ストーリーがない",
      change: (f) => delete f.index.entries["button--playground"],
      message: "button: Storybookのストーリーが見つかりません",
    },
    {
      name: "exportNameがない",
      change: (f) => delete f.index.entries["button--playground"].exportName,
      message: "button: index.jsonにexportNameがありません: button--playground",
    },
    {
      name: "defaultStoryが存在しない",
      change: (f) => {
        f.config.components.button.defaultStory = "Missing";
      },
      message: "button: defaultStoryが存在しません",
    },
    ...["docs", "playground"].map((suffix) => ({
      name: `${suffix}の種別が不明`,
      change: (f) => {
        if (suffix === "playground")
          f.config.components.button.defaultStory = "Playground";
        f.index.entries[`button--${suffix}`].type = "unknown";
      },
      message: `button: 不明なStorybookエントリー種別: unknown (button--${suffix})`,
    })),
    {
      name: "indexキーとIDが一致しない",
      change: (f) => {
        f.index.entries["button--docs"].id = "missing";
      },
      message: "Storybook indexのエントリーIDが不正です: button--docs",
    },
  ];
  for (const { name, change, message } of cases) {
    await t.test(name, () => {
      const f = fixture();
      f.add("button");
      change(f);
      assert.throws(f.generate, { message });
    });
  }
});

test("別コンポーネントのDocsと同名exportのストーリーを区別する", () => {
  const f = fixture();
  f.add("button");
  f.add("label");
  f.write(
    "src/components/button/button.md",
    `[説明](./?path=/docs/label--docs#使い方)\n\n[Story](../label/label.stories.ts#Playground)\n`,
  );
  assert.deepEqual(f.generate().components.button.documentation.references, [
    { type: "storybook", entryId: "label--docs", fragment: "使い方" },
    {
      type: "story",
      entryId: "label--playground",
      exportName: "Playground",
      parameters: {},
    },
  ]);
});

test("component.jsonを検証し、固定の共通設定と組み合わせる", () => {
  const f = fixture();
  f.add("button");
  f.add("select");
  const { components } = f.config;
  f.write(
    "src/components/component.schema.json",
    fs.readFileSync(
      path.join(repository, "src/components/component.schema.json"),
      "utf8",
    ),
  );
  for (const [id, metadata] of Object.entries(components))
    f.write(`src/components/${id}/component.json`, JSON.stringify(metadata));
  assert.deepEqual(loadConfig(f.root), {
    githubBaseUrl:
      "https://github.com/digital-go-jp/design-system-example-components-html/tree/main/",
    storybookBaseUrl: "https://design.digital.go.jp/dads/html/",
    shared: { css: ["src/global.css"], js: [] },
    components,
  });
  f.write(
    "src/components/button/component.json",
    JSON.stringify({
      ...components.button,
      examples: {
        playground: { additionalFiles: { assets: ["dynamic.png"] } },
      },
    }),
  );
  assert.throws(() => loadConfig(f.root), /component.json/);
});

test("component.jsonの登録漏れを検出する", () => {
  const f = fixture();
  f.add("button");
  delete f.config.components.button;
  assert.throws(f.generate, /component.json未登録/);
});
