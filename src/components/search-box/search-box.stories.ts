import type { Meta, StoryObj } from "@storybook/html-vite";
import { HtmlFragment } from "../../helpers/html-fragment";

import "../button/button.css";
import "./search-box.css";
import playground from "./playground.html?raw";

const meta = {
  title: "Components/検索ボックス",
} satisfies Meta;

export default meta;

interface SearchBoxPlaygroundProps {
  hasOption: boolean;
}

export const Playground: StoryObj<SearchBoxPlaygroundProps> = {
  render: (args) => {
    const fragment = new HtmlFragment(playground, ".dads-search-box");
    const searchBox = fragment.root;
    const option = searchBox.querySelector(".dads-search-box__select");

    if (!option) throw new Error();

    if (!args.hasOption) {
      option.remove();
    }

    return fragment.toString({ trimBlankLines: true });
  },
  argTypes: {
    hasOption: { control: "boolean" },
  },
  args: {
    hasOption: true,
  },
};
