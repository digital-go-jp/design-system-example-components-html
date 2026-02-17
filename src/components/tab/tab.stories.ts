import type { Meta, StoryObj } from "@storybook/html-vite";
import { HtmlFragment } from "../../helpers/html-fragment";

import "../heading/heading.css";
import "../link/link.css";
import "./tab.css";
import "./tab-aria.js";
import "./tab.js";

import exampleHtml from "./example.html?raw";
import playground from "./playground.html?raw";
import playgroundAria from "./playground-aria.html?raw";
import playgroundStatic from "./playground-static.html?raw";

const meta = {
  title: "Components/タブ",
} satisfies Meta;

export default meta;

interface TabPlaygroundProps {
  position: "top" | "bottom" | "left" | "right";
}

export const Playground: StoryObj<TabPlaygroundProps> = {
  name: "Playground (Tab key navigation)",
  render: (args) => {
    const fragment = new HtmlFragment(playground, "body > *");
    const [_heading, tab] = fragment.roots;
    const tablist = tab.querySelector(".dads-tab__list");

    if (!tablist) throw new Error("");

    if (args.position === "top") {
      tab.removeAttribute("data-position");
    } else {
      tab.setAttribute("data-position", args.position);
    }

    if (args.position === "bottom") {
      const panelsWrapper = tab.querySelector(".dads-tab__panels");
      const whitespaceBeforeTablist = tablist.previousSibling;
      panelsWrapper?.after(tablist);
      if (whitespaceBeforeTablist)
        panelsWrapper?.after(whitespaceBeforeTablist);
    }

    return fragment.toString();
  },
  argTypes: {
    position: {
      control: { type: "radio" },
      options: ["top", "bottom", "left", "right"],
    },
  },
  args: {
    position: "top",
  },
};

interface TabAriaPlaygroundProps {
  position: "top" | "bottom" | "left" | "right";
  activation: "auto" | "manual";
}

export const PlaygroundAria: StoryObj<TabAriaPlaygroundProps> = {
  name: "Playground (Arrow key navigation)",
  render: (args) => {
    const fragment = new HtmlFragment(playgroundAria, ".dads-tab");
    const tab = fragment.root;
    const tablist = tab.querySelector('[role="tablist"]');

    if (!tablist) throw new Error("");

    if (args.position === "top") {
      tab.removeAttribute("data-position");
    } else {
      tab.setAttribute("data-position", args.position);
    }

    if (args.position === "left" || args.position === "right") {
      tablist.setAttribute("aria-orientation", "vertical");
    } else {
      tablist.removeAttribute("aria-orientation");
    }

    if (args.activation === "manual") {
      tab.setAttribute("data-activation", "manual");
    } else {
      tab.removeAttribute("data-activation");
    }

    if (args.position === "bottom") {
      const panelsWrapper = tab.querySelector(".dads-tab__panels");
      const whitespaceBeforeTablist = tablist.previousSibling;
      panelsWrapper?.after(tablist);
      if (whitespaceBeforeTablist)
        panelsWrapper?.after(whitespaceBeforeTablist);
    }

    return fragment.toString();
  },
  argTypes: {
    position: {
      control: { type: "radio" },
      options: ["top", "bottom", "left", "right"],
    },
    activation: {
      control: { type: "radio" },
      options: ["auto", "manual"],
    },
  },
  args: {
    position: "top",
    activation: "auto",
  },
};

interface TabStaticPlaygroundProps {
  position: "top" | "bottom" | "left" | "right";
}

export const PlaygroundStatic: StoryObj<TabStaticPlaygroundProps> = {
  name: "Playground (Classic link list)",
  render: (args) => {
    const fragment = new HtmlFragment(playgroundStatic, ".dads-tab");
    const tab = fragment.root;
    const tablist = tab.querySelector(".dads-tab__list");

    if (!tablist) throw new Error("");

    if (args.position === "top") {
      tab.removeAttribute("data-position");
    } else {
      tab.setAttribute("data-position", args.position);
    }

    if (args.position === "bottom") {
      const panelsWrapper = tab.querySelector(".dads-tab__panels");
      const whitespaceBeforeTablist = tablist.previousSibling;
      panelsWrapper?.after(tablist);
      if (whitespaceBeforeTablist)
        panelsWrapper?.after(whitespaceBeforeTablist);
    }

    return fragment.toString();
  },
  argTypes: {
    position: {
      control: { type: "radio" },
      options: ["top", "bottom", "left", "right"],
    },
  },
  args: {
    position: "top",
  },
};

export const Example: StoryObj = {
  name: "商品紹介ページの例",
  render() {
    return new HtmlFragment(exampleHtml, "body > *").toString();
  },
};
