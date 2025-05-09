import type { Meta, StoryObj } from "@storybook/html";

import "./button.css";

type ButtonVariant = "solid-fill" | "outline" | "text";
type ButtonSize = "lg" | "md" | "sm" | "xs";

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  label: string;
}

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Example/Button",
  tags: ["autodocs"],
  render: (args) => {
    return `<button class="dads-button" data-size="${args.size}" data-type="${args.variant}">
  ${args.label}
</button>`;
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

export const SolidFill: Story = {
  args: {
    variant: "solid-fill",
    size: "md",
    label: "ボタン",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    size: "md",
    label: "ボタン",
  },
};

export const Text: Story = {
  args: {
    variant: "text",
    size: "md",
    label: "ボタン",
  },
};

export const Large: Story = {
  args: {
    variant: "solid-fill",
    size: "lg",
    label: "ボタン",
  },
};

export const Small: Story = {
  args: {
    variant: "solid-fill",
    size: "sm",
    label: "ボタン",
  },
};
