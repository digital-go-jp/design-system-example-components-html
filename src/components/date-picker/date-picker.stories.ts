import type { Meta, StoryObj } from "@storybook/html-vite";
import { HtmlFragment } from "../../helpers/html-fragment";

import "./date-picker.stories.css";

import "./date-picker";
import "../calendar/calendar";
import "../button/button.css";
import "../calendar/calendar.css";
import "./date-picker.css";
import "../form-control-label/form-control-label.css";
import "../select/select.css";
import playgroundConsolidated from "./playground-consolidated.html?raw";
import playgroundSeparated from "./playground-separated.html?raw";
import playgroundConsolidatedWithCalendar from "./playground-consolidated-with-calendar.html?raw";
import playgroundSeparatedWithCalendar from "./playground-separated-with-calendar.html?raw";
import withFormControlLabel from "./with-form-control-label.html?raw";
import readonly from "./readonly.html?raw";
import error from "./error.html?raw";
import disabled from "./disabled.html?raw";

const meta = {
  title: "Components/日付ピッカー",
} satisfies Meta;

export default meta;

function getDateYmd(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

interface DatePickerPlaygroundProps {
  size: string;
  year: boolean;
  day: boolean;
}

interface DatePickerWithCalendarPlaygroundProps {
  minDate?: string;
  maxDate?: string;
}

export const Consolidated: StoryObj<DatePickerPlaygroundProps> = {
  render: (args) => {
    const fragment = new HtmlFragment(
      playgroundConsolidated,
      ".dads-date-picker",
    );

    const datePicker = fragment.root;
    const controls = datePicker.querySelector(".dads-date-picker__controls");
    const yearInput = datePicker.querySelector(".dads-date-picker__year input");
    const dayInput = datePicker.querySelector(".dads-date-picker__day input");

    if (!controls) throw new Error();
    if (!yearInput) throw new Error();
    if (!dayInput) throw new Error();

    controls.setAttribute("data-size", args.size);

    if (!args.year) {
      yearInput.parentNode.remove();
    }

    if (!args.day) {
      dayInput.parentNode.remove();
    }

    return fragment.toString({ trimBlankLines: true });
  },
  argTypes: {
    size: {
      control: "radio",
      options: ["sm", "md", "lg"],
    },
    year: { control: "boolean" },
    day: { control: "boolean" },
  },
  args: {
    size: "md",
    year: true,
    day: true,
  },
};

export const Separated: StoryObj<DatePickerPlaygroundProps> = {
  render(args) {
    const fragment = new HtmlFragment(playgroundSeparated, ".dads-date-picker");

    const datePicker = fragment.root;
    const controls = datePicker.querySelector(".dads-date-picker__controls");
    const yearInput = datePicker.querySelector(
      ".dads-date-picker__separated-year input",
    );
    const dayInput = datePicker.querySelector(
      ".dads-date-picker__separated-day input",
    );

    if (!controls) throw new Error();
    if (!yearInput) throw new Error();
    if (!dayInput) throw new Error();

    controls.setAttribute("data-size", args.size);

    if (!args.year) {
      yearInput.parentNode.remove();
    }

    if (!args.day) {
      dayInput.parentNode.remove();
    }

    return fragment.toString({ trimBlankLines: true });
  },
  argTypes: {
    size: {
      control: "radio",
      options: ["sm", "md", "lg"],
    },
    year: { control: "boolean" },
    day: { control: "boolean" },
  },
  args: {
    size: "md",
    year: true,
    day: true,
  },
};

export const ConsolidatedWithCalendar: StoryObj<DatePickerWithCalendarPlaygroundProps> =
  {
    render: (args) => {
      const fragment = new HtmlFragment(
        playgroundConsolidatedWithCalendar,
        ".dads-date-picker",
      );

      const datePicker = fragment.root;
      const calendar = datePicker.querySelector("dads-calendar");

      if (!calendar) throw new Error();

      if (args.minDate) {
        const minDate = new Date(args.minDate);
        calendar.setAttribute("min-date", getDateYmd(minDate));
      }

      if (args.maxDate) {
        const maxDate = new Date(args.maxDate);
        calendar.setAttribute("max-date", getDateYmd(maxDate));
      }

      return fragment.toString({ trimBlankLines: true });
    },
    argTypes: {
      minDate: { control: "date" },
      maxDate: { control: "date" },
    },
    parameters: {
      docs: {
        story: {
          height: "560px",
        },
      },
    },
  };

export const SeparatedWithCalendar: StoryObj<DatePickerWithCalendarPlaygroundProps> =
  {
    render(args) {
      const fragment = new HtmlFragment(
        playgroundSeparatedWithCalendar,
        ".dads-date-picker",
      );

      const datePicker = fragment.root;
      const calendar = datePicker.querySelector("dads-calendar");

      if (!calendar) throw new Error();

      if (args.minDate) {
        const minDate = new Date(args.minDate);
        calendar.setAttribute("min-date", getDateYmd(minDate));
      }

      if (args.maxDate) {
        const maxDate = new Date(args.maxDate);
        calendar.setAttribute("max-date", getDateYmd(maxDate));
      }

      return fragment.toString({ trimBlankLines: true });
    },
    argTypes: {
      minDate: { control: "date" },
      maxDate: { control: "date" },
    },
    parameters: {
      docs: {
        story: {
          height: "560px",
        },
      },
    },
  };

export const WithFormControlLabel = () =>
  new HtmlFragment(withFormControlLabel, ".dads-form-control-label").toString();

export const Readonly = () =>
  new HtmlFragment(readonly, ".dads-form-control-label").toString();

export const ErrorStory: StoryObj = {
  name: "Error",
  render: () => new HtmlFragment(error, ".dads-form-control-label").toString(),
};

export const Disabled = () =>
  new HtmlFragment(disabled, ".dads-form-control-label").toString();
