import { parse, type HTMLElement } from "node-html-parser";

export class HtmlFragment {
  originalFragment: string;
  root: HTMLElement;

  constructor(fragment: string, contextSelector?: string) {
    this.originalFragment = fragment;

    this.root = parse(fragment);

    if (contextSelector) {
      const context = this.root.querySelector(contextSelector);
      if (!context) {
        throw new Error(
          `Context element not found for selector: ${contextSelector}`,
        );
      }
      this.root = context;
    }
  }

  toString() {
    return this.root.toString();
  }
}
