import type { Meta, StoryObj } from "@storybook/html-vite";
import { HtmlFragment } from "../../helpers/html-fragment";

import "../button/button.css";
import "../disclosure/disclosure.css";
import "../checkbox/checkbox.css";
import "../form-control-label/form-control-label.css";
import "../radio/radio.css";
import "./search-box.css";
import playground from "./playground.html?raw";
import withDetail from "./with-detail.html?raw";

const meta = {
  title: "Components/検索ボックス",
} satisfies Meta;

export default meta;

interface SearchBoxPlaygroundProps {
  size: "lg" | "md" | "sm";
  hasOption: boolean;
}

export const Playground: StoryObj<SearchBoxPlaygroundProps> = {
  render: (args) => {
    const fragment = new HtmlFragment(playground, ".dads-search-box");
    const searchBox = fragment.root;
    const option = searchBox.querySelector(".dads-search-box__select");
    const button = searchBox.querySelector(".dads-button");

    if (!option) throw new Error();
    if (!button) throw new Error();

    searchBox.setAttribute("data-size", args.size);
    button.setAttribute("data-size", args.size);

    if (!args.hasOption) {
      option.remove();
    }

    return fragment.toString({ trimBlankLines: true });
  },
  argTypes: {
    size: {
      control: { type: "radio" },
      options: ["lg", "md", "sm"],
    },
    hasOption: { control: "boolean" },
  },
  args: {
    size: "lg",
    hasOption: true,
  },
};

export const WithDetail = () =>
  new HtmlFragment(withDetail, "body > *").toString({ trimBlankLines: true });
