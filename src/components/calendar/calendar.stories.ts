import type { Meta, StoryObj } from "@storybook/html-vite";
import { HtmlFragment } from "../../helpers/html-fragment";

import "../button/button.css";
import "./calendar";
import "./calendar.css";
import "../select/select.css";
import playground from "./playground.html?raw";

const meta = {
  title: "Components/カレンダー",
} satisfies Meta;

export default meta;

function getDateYmd(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

interface CalendarPlaygroundProps {
  minDate?: string;
  maxDate?: string;
}

export const Playground: StoryObj<CalendarPlaygroundProps> = {
  render: (args) => {
    const fragment = new HtmlFragment(playground, "body > *");
    const [calendar] = fragment.roots;

    if (args.minDate) {
      const minDate = new Date(args.minDate);
      calendar.setAttribute("min-date", getDateYmd(minDate));
    }

    if (args.maxDate) {
      const maxDate = new Date(args.maxDate);
      calendar.setAttribute("max-date", getDateYmd(maxDate));
    }

    return fragment.toString();
  },
  argTypes: {
    minDate: { control: "date" },
    maxDate: { control: "date" },
  },
};
