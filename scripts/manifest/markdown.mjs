/** 現在の文書記法だけを扱う。説明画像は冒頭の静的import、参照はMarkdownリンク。 */
export function markdownReferences(source) {
  const references = [];
  const assets = [];
  const lines = source.replace(/^\uFEFF/, "").split(/\r?\n/);
  for (const line of lines) {
    if (!line.trim()) continue;
    const imported = line.match(
      /^import\s+[A-Za-z_$][\w$]*\s+from\s+(["'])([^"']+)\1\s*;?\s*$/,
    );
    if (!imported) break;
    assets.push(imported[2]);
  }
  // 文書内の単独行リンクと通常の本文中リンク。コード例にはこの参照記法を使わない。
  for (const match of source.matchAll(/(?<!!)\[[^\]\n]*\]\(([^\s)]+)\)/g))
    references.push(match[1]);
  return { references, assets };
}
