import type { Meta, StoryObj } from "@storybook/html-vite";
import { HtmlFragment } from "../../helpers/html-fragment";

import "./utility-link.css";
import playground from "./playground.html?raw";
import multiple from "./multiple.html?raw";

const meta = {
  title: "Components/ユーティリティーリンク",
} satisfies Meta;

export default meta;

interface PlaygroundProps {
  hasLeadIcon: boolean;
  target: string;
  label: string;
}

export const Playground: StoryObj<PlaygroundProps> = {
  render: (args) => {
    const fragment = new HtmlFragment(playground, ".dads-utility-link");
    const link = fragment.root;
    const leadIcon = link.querySelector(".dads-utility-link__lead-icon");
    const label = link.querySelector(".dads-utility-link__label");
    const tailIcon = link.querySelector(".dads-utility-link__tail-icon");

    if (!leadIcon) throw new Error();
    if (!label) throw new Error();
    if (!tailIcon) throw new Error();

    if (!args.hasLeadIcon) {
      leadIcon.remove();
    }

    link.setAttribute("target", args.target);
    if (args.target !== "_blank") {
      link.removeAttribute("target");
      tailIcon.remove();
    }

    label.textContent = args.label;

    return fragment.toString({ trimBlankLines: true });
  },
  argTypes: {
    hasLeadIcon: { control: "boolean" },
    target: {
      control: "radio",
      options: ["_self", "_blank"],
    },
    label: { control: "text" },
  },
  args: {
    hasLeadIcon: true,
    target: "_self",
    label: "リンクテキスト",
  },
};

export const MultipleLinks = () =>
  new HtmlFragment(multiple, "body > div").toString();
