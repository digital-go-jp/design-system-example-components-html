import type { Meta, StoryObj } from "@storybook/html-vite";
import { HtmlFragment } from "../../helpers/html-fragment";

import "./description-list.css";
import playground from "./playground.html?raw";

const meta = {
  title: "Components/説明リスト",
} satisfies Meta;

export default meta;

interface DescriptionListPlaygroundProps {
  marker: "none" | "bullet" | "custom";
}

export const Playground: StoryObj<DescriptionListPlaygroundProps> = {
  render: (args) => {
    const fragment = new HtmlFragment(playground, ".dads-description-list");
    const descriptionList = fragment.root;
    const markers = descriptionList.querySelectorAll("dt > span:first-child");

    if (args.marker === "none") {
      descriptionList.removeAttribute("data-marker");
      markers.forEach((marker) => marker.remove());
    } else if (args.marker === "bullet") {
      descriptionList.setAttribute("data-marker", "bullet");
      markers.forEach((marker) => marker.remove());
    } else {
      descriptionList.setAttribute("data-marker", "custom");
    }

    return fragment.toString();
  },
  argTypes: {
    marker: {
      control: "radio",
      options: ["none", "bullet", "custom"],
    },
  },
  args: {
    marker: "none",
  },
};
