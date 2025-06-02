import type { Meta, StoryObj } from "@storybook/html";
import { HtmlFragment } from "../../helpers/html-fragment";

import "./disclosure.css";
import playground from "./playground.html?raw";

interface DisclosureProps {
  opened: boolean;
  label: string;
}

const meta = {
  title: "Components/ディスクロージャー",
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
} satisfies Meta<DisclosureProps>;

export default meta;
type Story = StoryObj<DisclosureProps>;

export const Playground: Story = {
  args: {
    opened: false,
    label: "ダミーテキストとは何ですか？",
  },
};
