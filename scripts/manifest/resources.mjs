import fs from "node:fs";
import path from "node:path";
import { parse as parseHtml } from "node-html-parser";
import { parseTarget } from "../../.storybook/dads-md/references.mjs";

export function srcsetUrls(value) {
  const urls = [];
  let rest = value.trim();
  while (rest) {
    rest = rest.replace(/^[\s,]+/, "");
    const token = rest.match(/^\S+/)?.[0];
    if (!token) break;
    rest = rest.slice(token.length);
    urls.push(token.replace(/,+$/, ""));
    if (!token.endsWith(",")) {
      const comma = rest.indexOf(",");
      rest = comma === -1 ? "" : rest.slice(comma + 1);
    }
  }
  return urls;
}

export class Resources {
  constructor(root) {
    this.root = fs.realpathSync(root);
    this.cache = new Map();
  }

  resolve(from, target) {
    if (
      !target ||
      target.startsWith("#") ||
      target.startsWith("?") ||
      target.startsWith("//") ||
      /^[a-z][a-z\d+.-]*:/i.test(target)
    )
      return null;
    const { file } = parseTarget(target);
    const decoded = decodeURIComponent(file);
    const absolute = decoded.startsWith("/")
      ? path.resolve(this.root, `.${decoded}`)
      : path.resolve(this.root, path.dirname(from), decoded);
    const relative = path
      .relative(this.root, absolute)
      .split(path.sep)
      .join("/");
    if (!relative || relative.startsWith("../") || path.isAbsolute(relative))
      throw new Error(`${from}: リポジトリ外の参照 ${target}`);
    this.assertFile(relative);
    return relative;
  }

  assertFile(file) {
    if (
      typeof file !== "string" ||
      file.includes("\\") ||
      file.startsWith("/") ||
      file.split("/").includes("..")
    )
      throw new Error(`不正なパス: ${file}`);
    const absolute = path.join(this.root, file);
    if (!fs.existsSync(absolute) || !fs.statSync(absolute).isFile())
      throw new Error(`参照先ファイルが存在しません: ${file}`);
    const real = path.relative(this.root, fs.realpathSync(absolute));
    if (real.startsWith(`..${path.sep}`) || path.isAbsolute(real))
      throw new Error(`リポジトリ外のファイル: ${file}`);
  }

  read(file) {
    this.assertFile(file);
    return fs.readFileSync(path.join(this.root, file), "utf8");
  }

  htmlRefs(source) {
    const root = parseHtml(source, { comment: false });
    const refs = [];
    for (const node of root.querySelectorAll("*")) {
      const tag = node.rawTagName.toLowerCase();
      if (
        tag === "link" &&
        node.getAttribute("rel")?.split(/\s+/).includes("stylesheet")
      )
        refs.push(node.getAttribute("href"));
      if (
        [
          "img",
          "script",
          "source",
          "video",
          "audio",
          "track",
          "iframe",
          "embed",
          "input",
        ].includes(tag)
      )
        refs.push(node.getAttribute("src"));
      if (tag === "video") refs.push(node.getAttribute("poster"));
      if (tag === "object") refs.push(node.getAttribute("data"));
      if (["image", "use"].includes(tag))
        refs.push(node.getAttribute("href") || node.getAttribute("xlink:href"));
      const srcset = node.getAttribute("srcset");
      if (srcset) refs.push(...srcsetUrls(srcset));
    }
    return refs.filter(Boolean);
  }

  direct(file) {
    if (this.cache.has(file)) return this.cache.get(file);
    // CSS・JSの内容は解析しない。HTMLに宣言されたファイルだけを取得する。
    const targets = file.endsWith(".html")
      ? this.htmlRefs(this.read(file))
      : [];
    const refs = [];
    for (const target of targets) {
      const resolved = this.resolve(file, target);
      if (resolved && !refs.includes(resolved)) refs.push(resolved);
    }
    this.cache.set(file, refs);
    return refs;
  }

  external(file) {
    const root = parseHtml(this.read(file), { comment: false });
    const result = { css: [], js: [] };
    for (const node of root.querySelectorAll("link, script")) {
      const tag = node.rawTagName.toLowerCase();
      const kind = tag === "script" ? "js" : "css";
      if (
        kind === "css" &&
        !node
          .getAttribute("rel")
          ?.toLowerCase()
          .split(/\s+/)
          .includes("stylesheet")
      )
        continue;
      const attribute = kind === "css" ? "href" : "src";
      const target = node.getAttribute(attribute);
      if (!target || !/^(?:https?:)?\/\//i.test(target)) continue;
      const url = new URL(target.startsWith("//") ? `https:${target}` : target);
      // Google Fontsはサンプルの表示用であり、取得対象に含めない。
      if (kind === "css" && url.hostname === "fonts.googleapis.com") continue;
      const resource = { [attribute]: target };
      for (const name of ["integrity", "crossorigin"]) {
        if (node.hasAttribute(name)) resource[name] = node.getAttribute(name);
      }
      if (
        !result[kind].some(
          (item) => JSON.stringify(item) === JSON.stringify(resource),
        )
      )
        result[kind].push(resource);
    }
    return result;
  }

  collect(files) {
    const result = [];
    const seen = new Set();
    const visit = (file) => {
      if (seen.has(file)) return;
      this.assertFile(file);
      seen.add(file);
      result.push(file);
      for (const dependency of this.direct(file)) visit(dependency);
    };
    for (const file of files) visit(file);
    return result;
  }
}

export function fileLists(files) {
  const result = { css: [], js: [], assets: [] };
  for (const file of [...new Set(files)]) {
    const ext = path.extname(file).toLowerCase();
    const kind =
      ext === ".css"
        ? "css"
        : [".js", ".mjs", ".ts", ".tsx"].includes(ext)
          ? "js"
          : "assets";
    result[kind].push(file);
  }
  return result;
}
