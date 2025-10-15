import type { Meta, StoryObj } from "@storybook/html-vite";
import { HtmlFragment } from "../../helpers/html-fragment";

import "../link/link.css";
import "./list.css";
import allLists from "./all-lists.html?raw";

const meta = {
  title: "Components/箇条書きリスト",
} satisfies Meta;

export default meta;

interface ListAllListsProps {
  spacing: string;
}

export const AllLists: StoryObj<ListAllListsProps> = {
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
  argTypes: {
    spacing: {
      control: "radio",
      options: ["4", "8", "12"],
    },
  },
  args: {
    spacing: "4",
  },
};
