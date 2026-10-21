import type { Meta, StoryObj } from "@storybook/html-vite";
import { HtmlFragment } from "../../helpers/html-fragment";

import "./horizontal-menu.css";
import linksOnly from "./links-only.html?raw";
import playground from "./playground.html?raw";
import submenuButton from "./submenu-button.html?raw";

const meta = {
  title: "Components/水平メニュー",
} satisfies Meta;

export default meta;

interface HorizontalMenuPlaygroundProps {
  label: string;
  hasFrontIcon: boolean;
  isCurrent: boolean;
}

export const Playground: StoryObj<HorizontalMenuPlaygroundProps> = {
  render(args) {
    const fragment = new HtmlFragment(playground, ".dads-horizontal-menu");
    const menu = fragment.root;
    const menuItem = menu.querySelector(".dads-horizontal-menu__item");

    if (!menuItem) throw new Error();

    const menuItemInner = menuItem.querySelector(
      ".dads-horizontal-menu__item-inner",
    );
    const frontIcon = menuItem.querySelector(
      ".dads-horizontal-menu__front-icon",
    );
    const label = menuItem.querySelector(".dads-horizontal-menu__label");

    if (!menuItemInner) throw new Error();
    if (!frontIcon) throw new Error();
    if (!label) throw new Error();

    label.textContent = args.label;

    if (!args.hasFrontIcon) {
      frontIcon.remove();
    }

    if (args.isCurrent) {
      menuItemInner.setAttribute("aria-current", "true");
    } else {
      menuItemInner.removeAttribute("aria-current");
    }

    return fragment.toString({ trimBlankLines: true });
  },
  argTypes: {
    label: { control: "text" },
    hasFrontIcon: { control: "boolean" },
    isCurrent: { control: "boolean" },
  },
  args: {
    label: "メニュー1",
    hasFrontIcon: true,
    isCurrent: true,
  },
};

export const LinksOnly = () =>
  new HtmlFragment(linksOnly, ".dads-horizontal-menu").toString();

export const SubmenuButton = () =>
  new HtmlFragment(submenuButton, ".dads-horizontal-menu").toString();
