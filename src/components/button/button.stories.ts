import type { Meta, StoryObj } from "@storybook/html-vite";
import { HtmlFragment } from "../../helpers/html-fragment";

import "./button.css";
import asLink from "./as-link.html?raw";
import disabledLink from "./disabled-link.html?raw";
import disabled from "./disabled.html?raw";
import playground from "./playground.html?raw";
import usingButtonElement from "./using-button-element.html?raw";
import usingLink from "./using-link.html?raw";
import withIcon from "./with-icon.html?raw";

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

export const AsLink = () =>
  new HtmlFragment(asLink, ".dads-button").toString({ trimBlankLines: true });

export const Disabled = () =>
  new HtmlFragment(disabled, ".dads-button").toString({
    trimBlankLines: true,
  });

export const DisabledLink = () =>
  new HtmlFragment(disabledLink, ".dads-button").toString({
    trimBlankLines: true,
  });

export const WithIcon = () =>
  new HtmlFragment(withIcon, ".dads-button").toString({
    trimBlankLines: true,
  });

export const AllButtonsUsingButton = () =>
  new HtmlFragment(usingButtonElement, "body > div").toString();

AllButtonsUsingButton.storyName = "Using Button Element";

export const AllButtonsUsingLink = () =>
  new HtmlFragment(usingLink, "body > div").toString();

AllButtonsUsingLink.storyName = "Using Link";
