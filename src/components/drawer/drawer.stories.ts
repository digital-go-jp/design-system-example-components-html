import type { Meta, StoryObj } from "@storybook/html-vite";
import { HtmlFragment } from "../../helpers/html-fragment";

import "./drawer.css";
import "../hamburger-menu-button/hamburger-menu-button.css";
import left from "./left.html?raw";
import right from "./right.html?raw";

const meta = {
  title: "Components/ドロワー",
} satisfies Meta;

export default meta;

export const Left = () => {
  const fragment = new HtmlFragment(left, "body > *");
  return fragment.toString({ trimBlankLines: true });
};

export const Right = () => {
  const fragment = new HtmlFragment(right, "body > *");
  return fragment.toString({ trimBlankLines: true });
};
