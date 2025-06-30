import type { Meta, StoryObj } from "@storybook/html-vite";
import { HtmlFragment } from "../../helpers/html-fragment";

import "./emergency-banner.css";
import playground from "./playground.html?raw";

interface EmergencyBannerProps {
  link: boolean;
  target: string;
}

const meta = {
  title: "Components/緊急時バナー",
  render: (args) => {
    const fragment = new HtmlFragment(playground, ".dads-emergency-banner");
    const banner = fragment.root;
    const action = banner.querySelector(".dads-emergency-banner__action");
    const button = banner.querySelector(".dads-emergency-banner__button");
    const icon = banner.querySelector(".dads-emergency-banner__button-icon");

    if (!action) throw new Error();
    if (!button) throw new Error();
    if (!icon) throw new Error();

    if (!args.link) {
      action.remove();
    }

    button.setAttribute("target", args.target);
    if (args.target !== "_blank") {
      button.removeAttribute("target");
      icon.remove();
    }

    return fragment.toString({ trimBlankLines: true });
  },
  argTypes: {
    link: { control: "boolean" },
    target: {
      control: "radio",
      options: ["_blank", "_self"],
      if: { arg: "link" },
    },
  },
} satisfies Meta<EmergencyBannerProps>;

export default meta;
type Story = StoryObj<EmergencyBannerProps>;

export const Playground: Story = {
  args: {
    link: true,
    target: "_self",
  },
};
