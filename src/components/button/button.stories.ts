import type { Meta, StoryObj } from "@storybook/html";
import { HtmlFragment } from "../../helpers/html-fragment";

import "./button.css";
import playground from "./playground.html?raw";
import allButtonsUsingButton from "./all-buttons-using-button.html?raw";
import allButtonsUsingLink from "./all-buttons-using-link.html?raw";

type ButtonVariant = "solid-fill" | "outline" | "text";
type ButtonSize = "lg" | "md" | "sm" | "xs";

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  label: string;
}

const meta = {
  title: "Components/ボタン",
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
      control: { type: "select" },
      options: ["solid-fill", "outline", "text"],
    },
    size: {
      control: { type: "select" },
      options: ["lg", "md", "sm", "xs"],
    },
    label: { control: "text" },
  },
} satisfies Meta<ButtonProps>;

export default meta;
type Story = StoryObj<ButtonProps>;

export const Playground: Story = {
  args: {
    variant: "solid-fill",
    size: "md",
    label: "ボタン",
  },
};

export const AllButtonsUsingButton = () =>
  new HtmlFragment(allButtonsUsingButton, "div").toString();

export const AllButtonsUsingLink = () =>
  new HtmlFragment(allButtonsUsingLink, "div").toString();
