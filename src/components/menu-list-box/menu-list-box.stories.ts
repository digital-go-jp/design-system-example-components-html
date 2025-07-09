import type { Meta, StoryObj } from "@storybook/html-vite";
import { HtmlFragment } from "../../helpers/html-fragment";

import "./menu-list-box.stories.css";

import "../menu-list/menu-list.css";
import "./menu-list-box";
import "./menu-list-box.css";
import playground from "./playground.html?raw";

const meta = {
  title: "Components/メニューリストボックス",
} satisfies Meta;

export default meta;

interface MenuListBoxPlaygroundProps {
  size: "sm" | "md";
  style: "text" | "outlined" | "filled";
  fontWeight: "normal" | "bold";
}

export const Playground: StoryObj<MenuListBoxPlaygroundProps> = {
  render: (args) => {
    const fragment = new HtmlFragment(playground, ".dads-menu-list-box");
    const menuListBox = fragment.root;
    const opener = menuListBox.querySelector(".dads-menu-list-box__opener");

    if (!opener) throw new Error();

    opener.setAttribute("data-size", args.size);
    opener.setAttribute("data-style", args.style);
    opener.setAttribute("data-text-weight", args.fontWeight);

    return fragment.toString();
  },
  argTypes: {
    size: {
      control: { type: "radio" },
      options: ["sm", "md"],
    },
    style: {
      control: { type: "radio" },
      options: ["text", "outlined", "filled"],
    },
    fontWeight: {
      control: { type: "radio" },
      options: ["normal", "bold"],
    },
  },
  args: {
    size: "sm",
    style: "text",
    fontWeight: "normal",
  },
  parameters: {
    docs: {
      story: {
        height: "360px",
      },
    },
  },
};
