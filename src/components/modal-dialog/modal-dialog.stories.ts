import type { Meta, StoryObj } from "@storybook/html-vite";
import { HtmlFragment } from "../../helpers/html-fragment";

import "../button/button.css";
import "./modal-dialog.css";

import playground from "./playground.html?raw";
import innerScroll from "./inner-scroll.html?raw";
import innerScrollWithFixedHeader from "./inner-scroll-with-fixed-header.html?raw";
import innerScrollWithFixedActions from "./inner-scroll-with-fixed-actions.html?raw";
import innerScrollWithFixedBoth from "./inner-scroll-with-fixed-both.html?raw";
import fixedWidth from "./fixed-width.html?raw";

interface ModalDialogCommonProps {
  hasCloseButton: boolean;
  longContent?: boolean;
}

const meta = {
  title: "Components/モーダルダイアログ",
  beforeEach: async (context) => {
    return () => {
      const button = context.canvasElement.querySelector<HTMLButtonElement>(
        'button[command="close"]',
      );
      button?.click();
    };
  },
} satisfies Meta;

export default meta;

function processRender(fragment: HtmlFragment, args: ModalDialogCommonProps) {
  const dialog = fragment.roots[1];
  const body = dialog.querySelector(".dads-modal-dialog__body");
  const closeButton = dialog.querySelector(".dads-modal-dialog__close");

  if (!closeButton) throw new Error("");
  if (!body) throw new Error("");

  if (!args.hasCloseButton) {
    closeButton.remove();
  }

  if (args.longContent) {
    body.innerHTML = "<p>コンテンツ</p>".repeat(50);
  }

  return fragment.toString({ trimBlankLines: true });
}

export const Playground: StoryObj<ModalDialogCommonProps> = {
  render: (args) => {
    const fragment = new HtmlFragment(playground, "body > *");
    return processRender(fragment, args);
  },
  args: {
    hasCloseButton: true,
    longContent: false,
  },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector<HTMLButtonElement>(
      'button[command="show-modal"]',
    );
    button?.click();
  },
};

export const InnerScroll: StoryObj<ModalDialogCommonProps> = {
  render: (args) => {
    const fragment = new HtmlFragment(innerScroll, "body > *");
    return processRender(fragment, args);
  },
  args: {
    hasCloseButton: true,
    longContent: true,
  },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector<HTMLButtonElement>(
      'button[command="show-modal"]',
    );
    button?.click();
  },
};

export const InnerScrollWithFixedHeader: StoryObj<ModalDialogCommonProps> = {
  render: (args) => {
    const fragment = new HtmlFragment(innerScrollWithFixedHeader, "body > *");
    return processRender(fragment, args);
  },
  args: {
    hasCloseButton: true,
    longContent: true,
  },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector<HTMLButtonElement>(
      'button[command="show-modal"]',
    );
    button?.click();
  },
};

export const InnerScrollWithFixedActions: StoryObj<ModalDialogCommonProps> = {
  render: (args) => {
    const fragment = new HtmlFragment(innerScrollWithFixedActions, "body > *");
    return processRender(fragment, args);
  },
  args: {
    hasCloseButton: true,
    longContent: true,
  },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector<HTMLButtonElement>(
      'button[command="show-modal"]',
    );
    button?.click();
  },
};

export const InnerScrollWithFixedBoth: StoryObj<ModalDialogCommonProps> = {
  render: (args) => {
    const fragment = new HtmlFragment(innerScrollWithFixedBoth, "body > *");
    return processRender(fragment, args);
  },
  args: {
    hasCloseButton: true,
    longContent: true,
  },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector<HTMLButtonElement>(
      'button[command="show-modal"]',
    );
    button?.click();
  },
};

export const FixedWidth: StoryObj = {
  render: () => {
    return new HtmlFragment(fixedWidth, "body > *").toString();
  },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector<HTMLButtonElement>(
      'button[command="show-modal"]',
    );
    button?.click();
  },
};
