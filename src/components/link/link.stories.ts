import type { Meta, StoryObj } from "@storybook/html-vite";
import { HtmlFragment } from "../../helpers/html-fragment";

import "./link.css";
import playground from "./playground.html?raw";

interface LinkProps {
  target: string;
  label: string;
}

const meta = {
  title: "Components/リンク",
  render: (args) => {
    const fragment = new HtmlFragment(playground, ".dads-link");
    const link = fragment.root;

    link.setAttribute("target", args.target);
    if (args.target !== "_blank") {
      link.removeAttribute("target");
    }

    link.textContent = args.label;

    return fragment.toString();
  },
  argTypes: {
    target: {
      control: "radio",
      options: ["_self", "_blank"],
    },
    label: { control: "text" },
  },
} satisfies Meta<LinkProps>;

export default meta;
type Story = StoryObj<LinkProps>;

export const Playground: Story = {
  args: {
    target: "_self",
    label: "リンクテキスト",
  },
};
