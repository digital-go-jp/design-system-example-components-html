import type { Meta, StoryObj } from "@storybook/html-vite";
import { HtmlFragment } from "../../helpers/html-fragment";

import "./link.css";
import playground from "./playground.html?raw";

const meta = {
  title: "Components/リンク",
} satisfies Meta;

export default meta;

interface LinkPlaygroundProps {
  target: string;
  label: string;
}

export const Playground: StoryObj<LinkPlaygroundProps> = {
  render: (args) => {
    const fragment = new HtmlFragment(playground, ".dads-link");
    const link = fragment.root;
    const icon = link.querySelector(".dads-link__icon");

    if (!icon) throw new Error();

    link.setAttribute("target", args.target);
    if (args.target !== "_blank") {
      link.removeAttribute("target");
      icon.remove();
    }

    // link.textContent = args.label;
    /* [0] label
     * [1] tail icon */
    link.childNodes[0].rawText = link.childNodes[0].rawText.replace(
      /(\s*).+(\s*)/m,
      `$1${args.label}$2`,
    );

    return fragment.toString({ trimBlankLines: true });
  },
  argTypes: {
    target: {
      control: "radio",
      options: ["_self", "_blank"],
    },
    label: { control: "text" },
  },
  args: {
    target: "_self",
    label: "リンクテキスト",
  },
};
