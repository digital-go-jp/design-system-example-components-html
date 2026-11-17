/** Storybookのソース埋め込みとマニフェストで共有する参照記法。 */
export const LINK_ONLY_LINE = /^\[([^\]]*)\]\((\.[^)\s]+)\)\s*$/;

export function parseTarget(target) {
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
