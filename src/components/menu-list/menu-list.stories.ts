import type { Meta, StoryObj } from "@storybook/html-vite";
import { HtmlFragment } from "../../helpers/html-fragment";

import "./menu-list.css";
import playground from "./playground.html?raw";
import hasChildren from "./has-children.html?raw";

interface MenuListPlaygroundProps {
  type: "standard" | "box";
  size: "regular" | "small";
  current: boolean;
  hasFrontIcon: boolean;
  hasTailIcon: boolean;
  hasEndIcon: boolean;
  label: string;
  indent: number;
}

const meta = {
  title: "Components/メニューリスト",
} satisfies Meta;

export default meta;

export const Playground: StoryObj<MenuListPlaygroundProps> = {
  render(args) {
    const fragment = new HtmlFragment(playground, ".dads-menu-list");
    const menuList = fragment.root;
    const menuListItem = menuList.querySelector(".dads-menu-list__item");
    const frontIcon = menuList.querySelector(".dads-menu-list__front-icon");
    const label = menuList.querySelector(".dads-menu-list__label");
    const tailIcon = menuList.querySelector(".dads-menu-list__tail-icon");
    const endIcon = menuList.querySelector(".dads-menu-list__end-icon");

    if (!menuListItem) throw new Error();
    if (!frontIcon) throw new Error();
    if (!label) throw new Error();
    if (!tailIcon) throw new Error();
    if (!endIcon) throw new Error();

    menuListItem.setAttribute("data-type", args.type);
    menuListItem.setAttribute("data-size", args.size);

    if (args.current) {
      menuListItem.setAttribute("data-current", "");
    }

    if (!args.hasFrontIcon) {
      frontIcon.remove();
    }

    if (!args.hasTailIcon) {
      tailIcon.remove();
    }

    if (!args.hasEndIcon) {
      endIcon.remove();
    }

    /* [0] label
     * [1] tail icon */
    label.childNodes[0].rawText = label.childNodes[0].rawText.replace(
      /(\s*).+(\s*)/m,
      `$1${args.label}$2`,
    );

    if (args.indent > 0) {
      menuList.setAttribute("style", `--menu-list-indentation: ${args.indent}`);
    }

    return fragment.toString({ trimBlankLines: true });
  },
  argTypes: {
    type: {
      control: "radio",
      options: ["standard", "box"],
    },
    size: {
      control: "radio",
      options: ["regular", "small"],
    },
    current: { control: "boolean" },
    hasFrontIcon: { control: "boolean" },
    hasTailIcon: { control: "boolean" },
    hasEndIcon: { control: "boolean" },
    label: { control: "text" },
    indent: {
      control: "number",
      min: 0,
    },
  },
  args: {
    type: "standard",
    size: "regular",
    current: false,
    hasFrontIcon: true,
    hasTailIcon: true,
    hasEndIcon: true,
    label: "メニュー項目",
    indent: 0,
  },
};

export const HasChildren = () =>
  new HtmlFragment(hasChildren, ".dads-menu-list").toString();
