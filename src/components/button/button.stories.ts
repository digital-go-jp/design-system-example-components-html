import type { Meta, StoryObj } from "@storybook/html-vite";
import { HtmlFragment } from "../../helpers/html-fragment";

import "./button.css";
import playground from "./playground.html?raw";
import allButtonsUsingButton from "./all-buttons-using-button.html?raw";
import allButtonsUsingLink from "./all-buttons-using-link.html?raw";

type ButtonVariant = "solid-fill" | "outline" | "text";
type ButtonSize = "lg" | "md" | "sm" | "xs";

const meta = {
  title: "Components/ボタン",
} satisfies Meta;

export default meta;

interface ButtonPlaygroundProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  label: string;
}

export const Playground: StoryObj<ButtonPlaygroundProps> = {
  render: (args) => {
    const fragment = new HtmlFragment(playground, ".dads-button");
    const button = fragment.root;

    if (args.size) {
      button.setAttribute("data-size", args.size);
    }
    if (args.variant) {
      button.setAttribute("data-type", args.variant);
    }
    if (args.label) {
      button.textContent = args.label;
    }

    return fragment.toString();
  },
  argTypes: {
    variant: {
      control: { type: "radio" },
      options: ["solid-fill", "outline", "text"],
    },
    size: {
      control: { type: "radio" },
      options: ["lg", "md", "sm", "xs"],
    },
    label: { control: "text" },
  },
  args: {
    variant: "solid-fill",
    size: "md",
    label: "ボタン",
  },
};

export const AllButtonsUsingButton = () =>
  new HtmlFragment(allButtonsUsingButton, "body > div").toString();

export const AllButtonsUsingLink = () =>
  new HtmlFragment(allButtonsUsingLink, "body > div").toString();
