import type { Meta, StoryObj } from "@storybook/html-vite";
import { HtmlFragment } from "../../helpers/html-fragment";

import "./notice-block.css";
import "../chip-label/chip-label.css";
import "../disclosure/disclosure.css";
import "../link/link.css";
import "../list/list.css";
import playground from "./playground.html?raw";
import withChipLabelInBody from "./with-chip-label-in-body.html?raw";
import withChipLabelInTitle from "./with-chip-label-in-title.html?raw";
import withDisclosureAndChipLabel from "./with-disclosure-and-chip-label.html?raw";

const meta = {
  title: "Components/注釈ブロック",
} satisfies Meta;

export default meta;

interface NoticeBlockProps {
  style: "border-rounded" | "border-solid" | "fill-rounded" | "fill-solid";
  color: "gray" | "light-blue";
}

interface NoticeBlockPlaygroundProps extends NoticeBlockProps {
  showTitle: boolean;
  title: string;
  text: string;
}

const variantArgTypes = {
  style: {
    control: { type: "radio" },
    options: ["border-rounded", "border-solid", "fill-rounded", "fill-solid"],
  },
  color: {
    control: { type: "radio" },
    options: ["gray", "light-blue"],
  },
} as const;

const createFragment = (html: string, args: NoticeBlockProps) => {
  const fragment = new HtmlFragment(html, ".dads-notice-block");
  fragment.root.setAttribute("data-style", args.style);
  fragment.root.setAttribute("data-color", args.color);
  return fragment;
};

export const Playground: StoryObj<NoticeBlockPlaygroundProps> = {
  render: (args) => {
    const fragment = createFragment(playground, args);
    const header = fragment.root.querySelector(".dads-notice-block__header");
    const text = fragment.root.querySelector(".dads-notice-block__body > p");
    if (!header || !text) throw new Error();

    header.textContent = args.title;
    text.textContent = args.text;
    if (!args.showTitle) header.remove();

    return fragment.toString({ trimBlankLines: true });
  },
  argTypes: {
    ...variantArgTypes,
    showTitle: { control: "boolean" },
    title: { control: "text", if: { arg: "showTitle" } },
    text: { control: "text" },
  },
  args: {
    style: "border-rounded",
    color: "gray",
    showTitle: true,
    title: "タイトル",
    text: "テキストテキストテキストテキストテキスト",
  },
};

export const WithChipLabelInTitle: StoryObj<NoticeBlockProps> = {
  render: (args) => createFragment(withChipLabelInTitle, args).toString(),
  argTypes: variantArgTypes,
  args: {
    style: "border-rounded",
    color: "gray",
  },
};

export const WithChipLabelInBody: StoryObj<NoticeBlockProps> = {
  render: (args) => createFragment(withChipLabelInBody, args).toString(),
  argTypes: variantArgTypes,
  args: {
    style: "border-rounded",
    color: "gray",
  },
};

export const WithDisclosureAndChipLabel: StoryObj<NoticeBlockProps> = {
  render: (args) => createFragment(withDisclosureAndChipLabel, args).toString(),
  argTypes: variantArgTypes,
  args: {
    style: "border-solid",
    color: "light-blue",
  },
};
