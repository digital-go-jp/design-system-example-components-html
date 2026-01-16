import type { Meta, StoryObj } from "@storybook/html-vite";
import { HtmlFragment } from "../../helpers/html-fragment";

import "./chip-label.css";
import playground from "./playground.html?raw";
import allChipLabels from "./all-chip-labels.html?raw";

const meta = {
  title: "Components/チップラベル",
} satisfies Meta;

export default meta;

interface ChipLabelPlaygroundProps {
  style: "text" | "outline" | "filled-outline" | "fill";
  color:
    | "gray"
    | "blue"
    | "light-blue"
    | "cyan"
    | "green"
    | "lime"
    | "yellow"
    | "orange"
    | "red"
    | "magenta"
    | "purple";
  icon: boolean;
  text: string;
}

export const Playground: StoryObj<ChipLabelPlaygroundProps> = {
  render: (args) => {
    const fragment = new HtmlFragment(playground, ".dads-chip-label");
    const chipLabel = fragment.root;
    const icon = chipLabel.querySelector(".dads-chip-label__icon");

    if (!icon) throw new Error("");

    chipLabel.setAttribute("data-style", args.style);
    chipLabel.setAttribute("data-color", args.color);

    /* [0] whitespace
     * [1] svg
     * [2] text */
    chipLabel.childNodes[2].rawText = chipLabel.childNodes[2].rawText.replace(
      /(\s*).+(\s*)/m,
      `$1${args.text}$2`,
    );

    if (!args.icon) {
      icon.remove();
    }

    return fragment.toString({ trimBlankLines: true });
  },
  argTypes: {
    style: {
      control: "radio",
      options: ["text", "outline", "filled-outline", "fill"],
    },
    color: {
      control: "inline-radio",
      options: [
        "gray",
        "blue",
        "light-blue",
        "cyan",
        "green",
        "lime",
        "yellow",
        "orange",
        "red",
        "magenta",
        "purple",
      ],
    },
    icon: { control: "boolean" },
    text: { control: "text" },
  },
  args: {
    style: "text",
    color: "gray",
    icon: true,
    text: "ラベル",
  },
};

export const AllChipLabels: StoryObj = {
  render() {
    const fragment = new HtmlFragment(allChipLabels, "body > div");
    return fragment.toString();
  },
};
