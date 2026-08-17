import fs from "node:fs";
import path from "node:path";
import { isStub, transformMarkdown, transformStub, } from "./transform.mjs";

const VIRTUAL_SUFFIX = ".md.mdx";

/**
 * .md を「仮想の .mdx」として解決し、Storybook の MDX プラグインに処理させる Vite プラグイン。
 * Storybook の mdx プラグインは id が /\.mdx$/ にマッチするかだけを見ているので、
 * 拡張子を付け替えた仮想IDを返すだけで、公式のコンパイル経路にそのまま乗る。
 */
export function dadsMarkdownPlugin() {
  return {
    name: "dads:markdown",
    enforce: "pre",

    resolveId(source, importer) {
      if (!source.endsWith(".md") || !importer) return null;
      if (!source.startsWith(".")) return null;
      const abs = path.resolve(path.dirname(importer.split("?")[0]), source);
      if (!fs.existsSync(abs)) return null;
      return `${abs}.mdx`; // 仮想ID
    },

    load(id) {
      if (!id.endsWith(VIRTUAL_SUFFIX)) return null;
      const mdPath = id.slice(0, -4);
      this.addWatchFile(mdPath);
      return transformMarkdown(fs.readFileSync(mdPath, "utf8"), mdPath);
    },

    transform(code, id) {
      const file = id.split("?")[0];
      if (!file.endsWith(".mdx")) return null;
      if (file.endsWith(VIRTUAL_SUFFIX)) return null; // load で生成済み
      if (!isStub(code)) return null; // 旧形式の .mdx はそのまま
      return { code: transformStub(code), map: null };
    },
  };
}
