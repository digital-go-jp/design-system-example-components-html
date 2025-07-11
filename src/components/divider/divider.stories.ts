import type { Meta, StoryObj } from "@storybook/html-vite";
import { HtmlFragment } from "../../helpers/html-fragment";

import "./divider.css";
import playground from "./playground.html?raw";
import allDividers from "./all-dividers.html?raw";

const meta = {
  title: "Components/ディバイダー",
} satisfies Meta;

export default meta;

interface DividerPlaygroundProps {
  color: string;
  style: string;
  width: string;
}

export const Playground: StoryObj<DividerPlaygroundProps> = {
  render: (args) => {
    const fragment = new HtmlFragment(playground, ".dads-divider");
    const divider = fragment.root;

    divider.setAttribute("data-color", args.color);
    divider.setAttribute("data-style", args.style);
    divider.setAttribute("data-width", args.width);

    return fragment.toString();
  },
  argTypes: {
    color: {
      control: "radio",
      options: ["solid-gray-420", "solid-gray-536", "black"],
    },
    style: {
      control: "radio",
      options: ["solid", "dashed"],
    },
    width: {
      control: "radio",
      options: ["1", "2", "3", "4"],
    },
  },
  args: {
    color: "solid-gray-420",
    style: "solid",
    width: "1",
  },
};

export const AllDividers = () =>
  new HtmlFragment(allDividers, "body > div").toString();
