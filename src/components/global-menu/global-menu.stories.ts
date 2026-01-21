import type { Meta, StoryObj } from "@storybook/html-vite";
import { HtmlFragment } from "../../helpers/html-fragment";
import type { HTMLElement } from "node-html-parser";

import "./global-menu.css";
import playground from "./playground.html?raw";

const meta = {
  title: "Components/グローバルメニュー",
} satisfies Meta;

export default meta;

interface GlobalMenuPlaygroundProps {
  items: number;
  label: string;
  hasFrontIcon: boolean;
  isCurrent: boolean;
  hasSubmenu: boolean;
  isExpanded: boolean;
}

export const Playground: StoryObj<GlobalMenuPlaygroundProps> = {
  render(args) {
    const fragment = new HtmlFragment(playground, ".dads-global-menu");
    const menu = fragment.root;
    const menuItem = menu.querySelector(".dads-global-menu__item");
    const whiteSpace = menuItem?.previousSibling;

    if (!menuItem) throw new Error();
    if (!whiteSpace) throw new Error();

    if (args.items > 1) {
      const htmlToInsert = [];
      for (let i = 1; i < args.items; i++) {
        htmlToInsert.push(whiteSpace.toString());
        const newMenuItem = menuItem.clone() as HTMLElement;
        const newFrontIcon = newMenuItem.querySelector(
          ".dads-global-menu__front-icon",
        );
        const newLabel = newMenuItem.querySelector(".dads-global-menu__label");
        const newChevron = newMenuItem.querySelector(
          ".dads-global-menu__chevron",
        );

        if (!newLabel) throw new Error();

        newLabel.textContent = `メニュー${i + 1}`;
        newFrontIcon?.remove();
        newChevron?.remove();

        htmlToInsert.push(newMenuItem.toString());
      }

      menuItem.insertAdjacentHTML("afterend", htmlToInsert.join(""));
    }

    const menuItemInner = menuItem.querySelector(
      ".dads-global-menu__item-inner",
    );
    const frontIcon = menuItem.querySelector(".dads-global-menu__front-icon");
    const label = menuItem.querySelector(".dads-global-menu__label");
    const chevron = menuItem.querySelector(".dads-global-menu__chevron");

    if (!menuItemInner) throw new Error();
    if (!frontIcon) throw new Error();
    if (!label) throw new Error();
    if (!chevron) throw new Error();

    label.textContent = args.label;

    if (!args.hasFrontIcon) {
      frontIcon.remove();
    }

    if (args.hasSubmenu) {
      menuItemInner.tagName = "BUTTON";
      menuItemInner.setAttribute("type", "button");
      menuItemInner.removeAttribute("href");
      menuItemInner.setAttribute("aria-expanded", String(args.isExpanded));
    } else {
      menuItemInner.tagName = "A";
      menuItemInner.setAttribute("href", "#");
      menuItemInner.removeAttribute("type");
      menuItemInner.removeAttribute("aria-expanded");
      chevron.remove();
    }

    if (args.isCurrent) {
      menuItemInner.setAttribute("aria-current", "true");
    }

    return fragment.toString({ trimBlankLines: true });
  },
  argTypes: {
    items: { control: { type: "number", min: 1 } },
    label: { control: "text" },
    hasFrontIcon: { control: "boolean" },
    isCurrent: { control: "boolean" },
    hasSubmenu: { control: "boolean" },
    isExpanded: { control: "boolean", if: { arg: "hasSubmenu" } },
  },
  args: {
    items: 3,
    label: "メニュー1",
    hasFrontIcon: false,
    isCurrent: false,
    hasSubmenu: false,
    isExpanded: false,
  },
};
