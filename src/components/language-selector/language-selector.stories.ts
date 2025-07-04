import type { Meta, StoryObj } from "@storybook/html-vite";
import { HtmlFragment } from "../../helpers/html-fragment";

import "./language-selector.stories.css";

import "./language-selector";
import "./language-selector.css";
import "../menu-list/menu-list.css";
import "../menu-list-box//menu-list-box.css";
import playground from "./playground.html?raw";

const meta = {
  title: "Components/ランゲージセレクター",
} satisfies Meta;

export default meta;

export const Playground: StoryObj = {
  render() {
    const fragment = new HtmlFragment(playground, "dads-language-selector");
    return fragment.toString();
  },
  parameters: {
    docs: {
      story: {
        height: "360px",
      },
    },
  },
};
