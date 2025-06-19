import type { Meta, StoryObj } from "@storybook/html-vite";
import { HtmlFragment } from "../../helpers/html-fragment";

import "./list.css";
import allLists from "./all-lists.html?raw";

interface ListProps {
  spacing: string;
}

const meta = {
  title: "Components/リスト",
  argTypes: {
    spacing: {
      control: "radio",
      options: ["4", "8", "12"],
    },
  },
} satisfies Meta<ListProps>;

export default meta;
type Story = StoryObj<ListProps>;

export const AllLists: Story = {
  render(args) {
    const fragment = new HtmlFragment(allLists, "body > .dads-list");

    for (const list of fragment.roots) {
      list.setAttribute("data-spacing", args.spacing);

      const innerList = list.querySelectorAll(".dads-list");
      for (const inner of innerList) {
        inner.setAttribute("data-spacing", args.spacing);
      }
    }

    return fragment.toString();
  },
  args: {
    spacing: "4",
  },
};
