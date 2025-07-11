import type { Meta, StoryObj } from "@storybook/html-vite";
import { HtmlFragment } from "../../helpers/html-fragment";

import "./disclosure.css";
import playground from "./playground.html?raw";

const meta = {
  title: "Components/ディスクロージャー",
} satisfies Meta;

export default meta;

interface DisclosurePlaygroundProps {
  opened: boolean;
  label: string;
}

export const Playground: StoryObj<DisclosurePlaygroundProps> = {
  render: (args) => {
    const fragment = new HtmlFragment(playground, ".dads-disclosure");
    const disclosure = fragment.root;
    const summary = disclosure.querySelector(".dads-disclosure__summary");
    const backLink = disclosure.querySelector(".dads-disclosure__back-link");

    if (!summary) throw new Error();
    if (!backLink) throw new Error();

    if (args.opened) {
      disclosure.setAttribute("open", "");
    } else {
      disclosure.removeAttribute("open");
    }

    if (args.label) {
      /* [0] whitespace
       * [1] svg
       * [2] label */
      summary.childNodes[2].textContent = args.label;
      /* [0] whitespace
       * [1] svg
       * [2] label */
      backLink.childNodes[2].textContent = `「${args.label}」の先頭に戻る`;
    }

    return fragment.toString();
  },
  argTypes: {
    opened: { control: "boolean" },
    label: { control: "text" },
  },
  args: {
    opened: false,
    label: "ダミーテキストとは何ですか？",
  },
};
