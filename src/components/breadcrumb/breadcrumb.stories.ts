import type { Meta, StoryObj } from "@storybook/html-vite";
import { HtmlFragment } from "../../helpers/html-fragment";

import "./breadcrumb.css";
import plain from "./plain.html?raw";
import withVisibleLabel from "./with-visible-label.html?raw";
import withHomeIcon from "./with-home-icon.html?raw";

const meta = {
  title: "Components/パンくずリスト",
  render: () => {
    const fragment = new HtmlFragment(plain, ".dads-breadcrumb");
    return fragment.toString();
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Plain: Story = {};

export const WithVisibleLabel = () =>
  new HtmlFragment(withVisibleLabel, ".dads-breadcrumb").toString();

export const WithHomeIcon = () =>
  new HtmlFragment(withHomeIcon, ".dads-breadcrumb").toString();
