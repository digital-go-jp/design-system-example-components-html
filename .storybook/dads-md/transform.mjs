import fs from "node:fs";
import path from "node:path";

/**
 * 正味のコンテンツは .md（素のMarkdown）に置く。
 * .mdx は Storybook にインデックスさせるためだけの4行のスタブで、.md を読み込んで描画する。
 *
 *   accordion.mdx（スタブ / Storybookのアダプタ）
 *     import * as AccordionStories from "./accordion.stories";
 *     import Content from "./accordion.md";
 *     <Meta of={AccordionStories} />
 *     <Content />
 *
 *   accordion.md（正本 / 素のMarkdown）
 *     ## ソースコード
 *     [playground.html](./playground.html#.dads-accordion)
 *     ...
 *
 * .md は Vite 上で「仮想の .mdx」として解決され、Storybook の MDX パイプラインで
 * そのままコンパイルされる。ディスク上に生成物は作らない。
 */

const LANG_BY_EXT = {
  ".html": "html",
  ".css": "css",
  ".js": "javascript",
  ".ts": "typescript",
};

const BLOCKS_IMPORT =
  'import { Canvas, Controls, Description, Meta, Source, Stories, Subtitle, Title, Unstyled } from "@storybook/addon-docs/blocks";';

const LINK_ONLY_LINE = /^\[([^\]]*)\]\((\.[^)\s]+)\)\s*$/;
const FENCE = /^\s*(```|~~~)/;

function parseTarget(target) {
  const hashAt = target.indexOf("#");
  const hash = hashAt === -1 ? "" : target.slice(hashAt + 1);
  const head = hashAt === -1 ? target : target.slice(0, hashAt);
  const qAt = head.indexOf("?");
  return {
    file: qAt === -1 ? head : head.slice(0, qAt),
    query: qAt === -1 ? "" : head.slice(qAt + 1),
    hash,
  };
}

/** 同ディレクトリの *.stories.ts を探す（規約） */
function findSiblingStories(mdPath) {
  const dir = path.dirname(mdPath);
  const hit = fs
    .readdirSync(dir)
    .find((f) => /\.stories\.(ts|js)$/.test(f));
  return hit ? `./${hit.replace(/\.(ts|js)$/, "")}` : null;
}

/** 素のMarkdown → 完全なMDXソース */
export function transformMarkdown(source, filename) {
  const storiesSpec = findSiblingStories(filename);
  const STORIES = "__stories";

  const generatedImports = [];
  const rawVars = new Map();
  const out = [];
  let uid = 0;
  let usesHtmlFragment = false;

  const lines = source.split("\n");
  let inFence = false;

  for (const line of lines) {
    if (FENCE.test(line)) {
      inFence = !inFence;
      out.push(line);
      continue;
    }
    if (inFence || !LINK_ONLY_LINE.test(line)) {
      out.push(line);
      continue;
    }

    const [, , target] = line.match(LINK_ONLY_LINE);
    const { file, query, hash } = parseTarget(target);

    // --- ストーリー参照 ---
    if (/\.stories\.(ts|js)$/.test(file)) {
      if (!storiesSpec) {
        throw new Error(`[dads-md] ${filename}: stories ファイルが見つかりません`);
      }
      const name = hash || "Playground";
      const params = new URLSearchParams(query);
      const toolbar = params.has("no-toolbar") ? "" : " withToolbar";
      const sourceState = params.has("source") ? ' sourceState="shown"' : "";
      out.push(`<Canvas of={${STORIES}.${name}}${toolbar}${sourceState} />`);
      if (params.has("controls")) {
        out.push(`<Controls of={${STORIES}.${name}} />`);
      }
      continue;
    }

    // --- ソース埋め込み ---
    const lang = LANG_BY_EXT[path.extname(file)];
    if (!lang) {
      out.push(line);
      continue;
    }

    let v = rawVars.get(target);
    if (!v) {
      v = `__src${uid++}`;
      rawVars.set(target, v);
      generatedImports.push(
        `import ${v} from ${JSON.stringify(`${file}?raw`)};`,
      );
    }

    let expr = v;
    if (hash) {
      usesHtmlFragment = true;
      expr = `new HtmlFragment(${v}, ${JSON.stringify(hash)}).toString({ trimBlankLines: true })`;
    }
    out.push(`<Source code={${expr}} language="${lang}" />`);
  }

  if (usesHtmlFragment) {
    let rel = path
      .relative(
        path.dirname(filename),
        path.resolve(process.cwd(), "src/helpers/html-fragment"),
      )
      .split(path.sep)
      .join("/");
    if (!rel.startsWith(".")) rel = `./${rel}`;
    generatedImports.unshift(
      `import { HtmlFragment } from ${JSON.stringify(rel)};`,
    );
  }

  const header = [
    BLOCKS_IMPORT,
    ...(storiesSpec
      ? [`import * as ${STORIES} from ${JSON.stringify(storiesSpec)};`]
      : []),
    ...generatedImports,
    "",
    "<Unstyled>",
    '<div className="prose">',
    "",
    "<Title />",
    "<Subtitle />",
    "<Description />",
    "",
  ].join("\n");

  const footer = [
    "",
    "</div>",
    "</Unstyled>",
    "",
  ].join("\n");

  return header + out.join("\n") + footer;
}

/** スタブ .mdx に blocks の import を注入する */
export function transformStub(source) {
  return `${BLOCKS_IMPORT}\n${source}`;
}

export function isStub(source) {
  return /^import\s+\w+\s+from\s+["']\.[^"']*\.md["'];?\s*$/m.test(source);
}
