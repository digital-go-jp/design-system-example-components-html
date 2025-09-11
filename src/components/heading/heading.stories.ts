import type { Meta, StoryObj } from "@storybook/html-vite";
import { HtmlFragment } from "../../helpers/html-fragment";

import "./heading.css";
import playground from "./playground.html?raw";

const meta = {
  title: "Components/見出し",
} satisfies Meta;

export default meta;

interface HeadingPlaygroundProps {
  level: string;
  size: string;
  hasChip: boolean;
  hasIcon: boolean;
  hasRule: boolean;
  ruleSize?: string;
  hasShoulder: boolean;
  shoulderText?: string;
  text: string;
}

export const Playground: StoryObj<HeadingPlaygroundProps> = {
  render: (args) => {
    const fragment = new HtmlFragment(playground, ".dads-heading");
    const heading = fragment.root;
    const shoulder = heading.querySelector(".dads-heading__shoulder");
    const headingEl = heading.querySelector(".dads-heading__heading");
    const icon = heading.querySelector(".dads-heading__icon");

    if (!shoulder) throw new Error();
    if (!headingEl) throw new Error();
    if (!icon) throw new Error();

    headingEl.tagName = args.level.toUpperCase();

    /* [0] whitespace
     * [1] svg
     * [2] text */
    headingEl.childNodes[2].rawText = headingEl.childNodes[2].rawText.replace(
      /(\s*).+(\s*)/m,
      `$1${args.text}$2`,
    );

    heading.setAttribute("data-size", args.size);

    if (args.hasChip) {
      heading.setAttribute("data-chip", "");
    } else {
      heading.removeAttribute("data-chip");
    }

    if (!args.hasIcon) {
      icon.remove();
    }

    if (args.hasRule) {
      heading.setAttribute("data-rule", args.ruleSize || "6");
    } else {
      heading.removeAttribute("data-rule");
    }

    if (!args.hasShoulder) {
      heading.tagName = "DIV";
      shoulder.remove();
    } else if (args.shoulderText) {
      heading.tagName = "HGROUP";
      shoulder.textContent = args.shoulderText;
    }

    return fragment.toString({ trimBlankLines: true });
  },
  argTypes: {
    level: {
      control: { type: "inline-radio" },
      options: ["h1", "h2", "h3", "h4", "h5", "h6"],
    },
    size: {
      control: { type: "inline-radio" },
      options: ["64", "57", "45", "36", "32", "28", "24", "20", "18", "16"],
    },
    hasChip: { control: { type: "boolean" } },
    hasIcon: { control: { type: "boolean" } },
    hasRule: { control: { type: "boolean" } },
    ruleSize: {
      control: { type: "inline-radio" },
      options: ["8", "6", "4", "2"],
      if: { arg: "hasRule", eq: true },
    },
    hasShoulder: { control: { type: "boolean" } },
    shoulderText: {
      control: { type: "text" },
      if: { arg: "hasShoulder", eq: true },
    },
    text: { control: { type: "text" } },
  },
  args: {
    level: "h2",
    size: "36",
    hasChip: false,
    hasIcon: false,
    hasRule: false,
    ruleSize: "6",
    hasShoulder: false,
    shoulderText: "ショルダーテキスト",
    text: "見出しテキスト",
  },
};
