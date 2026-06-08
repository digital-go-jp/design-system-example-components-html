import type { Meta, StoryObj } from "@storybook/html-vite";
import { HtmlFragment } from "../../helpers/html-fragment";

import "../link/link.css";
import "../list/list.css";
import "./toc.css";

import playground from "./playground.html?raw";
import nested from "./nested.html?raw";

const meta = {
  title: "Components/目次",
} satisfies Meta;

export default meta;

interface PlaygroundProps {
  border: "none" | "dotted" | "solid";
}

export const Playground: StoryObj<PlaygroundProps> = {
  render: (args) => {
    const fragment = new HtmlFragment(playground, ".dads-toc");
    const toc = fragment.root;

    if (args.border === "none") {
      toc.removeAttribute("data-border");
    } else {
      toc.setAttribute("data-border", args.border);
    }

    return fragment.toString({ trimBlankLines: true });
  },
  argTypes: {
    border: {
      control: { type: "radio" },
      options: ["none", "dotted", "solid"],
    },
  },
  args: {
    border: "none",
  },
};

export const Nested = () => new HtmlFragment(nested, ".dads-toc").toString();
