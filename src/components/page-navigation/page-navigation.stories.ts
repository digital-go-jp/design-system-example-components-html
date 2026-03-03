import type { Meta, StoryObj } from "@storybook/html-vite";
import { HtmlFragment } from "../../helpers/html-fragment";

import "../button/button.css";
import "./page-navigation.css";

import textButton from "./text-button.html?raw";
import outlinedButton from "./outlined-button.html?raw";
import arrowButton from "./arrow-button.html?raw";

const meta = {
  title: "Components/ページナビゲーション",
} satisfies Meta;

export default meta;

interface ElementProps {
  element: "button" | "link";
  currentPage: number;
  totalPages: number;
}

interface ArrowProps extends ElementProps {
  size: "lg" | "md" | "sm" | "xs";
}

function applyElement(
  fragment: HtmlFragment,
  selector: string,
  element: "button" | "link",
) {
  const buttons = fragment.root.querySelectorAll(selector);
  buttons.forEach((btn) => {
    if (element === "link") {
      btn.tagName = "A";
      btn.setAttribute("href", "#");
      btn.removeAttribute("type");
    } else {
      btn.tagName = "BUTTON";
      btn.setAttribute("type", "button");
      btn.removeAttribute("href");
    }
  });
}

function applyPageState(
  fragment: HtmlFragment,
  currentPage: number,
  totalPages: number,
) {
  const counter = fragment.root.querySelector(".dads-page-navigation__counter");
  if (counter) {
    counter.textContent = `${currentPage} / ${totalPages.toLocaleString("ja-JP")}`;
  }

  if (currentPage <= 1) {
    fragment.root.querySelector("[data-control='prev']")?.remove();
  }

  if (currentPage >= totalPages) {
    fragment.root.querySelector("[data-control='next']")?.remove();
  }
}

const pageArgTypes = {
  currentPage: {
    control: { type: "number" as const, min: 1 },
  },
  totalPages: {
    control: { type: "number" as const, min: 1 },
  },
};

const pageArgs = {
  currentPage: 5,
  totalPages: 9999,
};

export const Text: StoryObj<ElementProps> = {
  render: (args) => {
    if (args.totalPages <= 1) return "";
    const fragment = new HtmlFragment(textButton, ".dads-page-navigation");
    applyElement(fragment, ".dads-button", args.element);
    applyPageState(fragment, args.currentPage, args.totalPages);
    return fragment.toString({ trimBlankLines: true });
  },
  argTypes: {
    element: {
      control: { type: "radio" },
      options: ["button", "link"],
    },
    ...pageArgTypes,
  },
  args: {
    element: "button",
    ...pageArgs,
  },
};

export const Outlined: StoryObj<ElementProps> = {
  render: (args) => {
    if (args.totalPages <= 1) return "";
    const fragment = new HtmlFragment(outlinedButton, ".dads-page-navigation");
    applyElement(fragment, ".dads-button", args.element);
    applyPageState(fragment, args.currentPage, args.totalPages);
    return fragment.toString({ trimBlankLines: true });
  },
  argTypes: {
    element: {
      control: { type: "radio" },
      options: ["button", "link"],
    },
    ...pageArgTypes,
  },
  args: {
    element: "button",
    ...pageArgs,
  },
};

export const Arrow: StoryObj<ArrowProps> = {
  render: (args) => {
    if (args.totalPages <= 1) return "";
    const fragment = new HtmlFragment(arrowButton, ".dads-page-navigation");
    applyElement(fragment, ".dads-page-navigation__arrow-button", args.element);
    const buttons = fragment.root.querySelectorAll(
      ".dads-page-navigation__arrow-button",
    );
    buttons.forEach((btn) => {
      btn.setAttribute("data-size", args.size);
    });
    applyPageState(fragment, args.currentPage, args.totalPages);
    return fragment.toString({ trimBlankLines: true });
  },
  argTypes: {
    element: {
      control: { type: "radio" },
      options: ["button", "link"],
    },
    size: {
      control: { type: "radio" },
      options: ["lg", "md", "sm", "xs"],
    },
    ...pageArgTypes,
  },
  args: {
    element: "button",
    size: "lg",
    ...pageArgs,
  },
};
