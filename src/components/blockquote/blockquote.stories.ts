import type { Meta, StoryObj } from "@storybook/html-vite";
import { HtmlFragment } from "../../helpers/html-fragment";

import "./blockquote.css";
import "../list/list.css";
import playground from "./playground.html?raw";
import multipleParagraphsHtml from "./multiple-paragraphs.html?raw";
import withListHtml from "./with-list.html?raw";

const meta = {
  title: "Components/引用ブロック",
} satisfies Meta;

export default meta;

interface BlockquotePlaygroundProps {
  text: string;
}

export const Playground: StoryObj<BlockquotePlaygroundProps> = {
  render: (args) => {
    const fragment = new HtmlFragment(playground, ".dads-blockquote");
    const blockquote = fragment.root;
    const paragraph = blockquote.querySelector("p");

    if (paragraph && args.text) {
      paragraph.textContent = args.text;
    }

    return fragment.toString();
  },
  argTypes: {
    text: { control: "text" },
  },
  args: {
    text: "これは引用文の例です。デジタル庁デザインシステムでは、アクセシビリティファーストの原則に基づいて、すべてのユーザーが利用しやすいサービスの提供を目指しています。",
  },
};

export const MultipleParagraphs: StoryObj = {
  render: () => {
    return new HtmlFragment(
      multipleParagraphsHtml,
      ".dads-blockquote",
    ).toString();
  },
};

export const WithList: StoryObj = {
  render: () => {
    return new HtmlFragment(withListHtml, ".dads-blockquote").toString();
  },
};
