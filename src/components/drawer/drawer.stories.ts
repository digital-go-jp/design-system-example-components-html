import type { Meta, StoryObj } from "@storybook/html-vite";
import { HtmlFragment } from "../../helpers/html-fragment";

import "./drawer.css";
import "../hamburger-menu-button/hamburger-menu-button.css";
import playground from "./playground.html?raw";

const meta = {
  title: "Components/ドロワー",
} satisfies Meta;

export default meta;

interface DrawerPlaygroundProps {
  placement: string;
}

export const Playground: StoryObj<DrawerPlaygroundProps> = {
  render: (args) => {
    const fragment = new HtmlFragment(playground, "body > *");
    const [button, drawer] = fragment.roots;

    const currentStyle = button.getAttribute("style");
    const justify = args.placement === "left" ? "start" : "end";
    button.setAttribute("style", `${currentStyle} justify-content: ${justify}`);

    drawer.setAttribute("data-placement", args.placement);

    return fragment.toString();
  },
  argTypes: {
    placement: {
      control: "radio",
      options: ["left", "right"],
    },
  },
  args: {
    placement: "left",
  },
};
