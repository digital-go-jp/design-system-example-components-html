import type { Meta, StoryObj } from "@storybook/html-vite";
import { HtmlFragment } from "../../helpers/html-fragment";

import "./accordion.css";
import playground from "./playground.html?raw";
import stacked from "./stacked.html?raw";

interface AccordionProps {
  opened: boolean;
  label: string;
}

const meta = {
  title: "Components/アコーディオン",
  render: (args) => {
    const fragment = new HtmlFragment(playground, ".dads-accordion");
    const accordion = fragment.root;

    if (args.opened) {
      accordion.setAttribute("open", "");
    } else {
      accordion.removeAttribute("open");
    }

    if (args.label) {
      const heading = accordion.querySelector(
        ".dads-accordion__summary :is(h1, h2, h3, h4, h5, h6)",
      );
      if (heading) {
        heading.textContent = args.label;
      }
      const backLink = accordion.querySelector(".dads-accordion__back-link");
      if (backLink) {
        /* [0] whitespace
         * [1] svg
         * [2] label */
        backLink.childNodes[2].textContent = `「${args.label}」の先頭に戻る`;
      }
    }

    return fragment.toString();
  },
  argTypes: {
    opened: { control: "boolean" },
    label: { control: "text" },
  },
} satisfies Meta<AccordionProps>;

export default meta;
type Story = StoryObj<AccordionProps>;

export const Playground: Story = {
  args: {
    opened: false,
    label: "ダミーテキストとは何ですか？",
  },
};

export const Stacked = () =>
  new HtmlFragment(stacked, ".dads-accordion").toString();
