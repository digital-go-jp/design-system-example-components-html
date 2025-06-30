import { parse, type HTMLElement } from "node-html-parser";

export class HtmlFragment {
  originalFragment: string;
  root: HTMLElement;
  roots: HTMLElement[] = [];

  constructor(fragment: string, contextSelector?: string) {
    this.originalFragment = fragment;

    this.root = parse(fragment);

    if (contextSelector) {
      const context = this.root.querySelectorAll(contextSelector);
      if (context.length === 0) {
        throw new Error(
          `Context element not found for selector: ${contextSelector}`,
        );
      }
      this.root = context[0];
      this.roots = context;
    }
  }

  toString({ trimBlankLines = false } = {}) {
    let htmlString = this.roots.map((root) => root.toString()).join("\n\n");
    if (trimBlankLines) {
      htmlString = htmlString.replace(/^\s*[\r\n]+/gm, "");
    }
    return htmlString;
  }
}
