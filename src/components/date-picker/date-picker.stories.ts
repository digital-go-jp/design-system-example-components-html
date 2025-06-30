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
import withFormControlLabel from "./with-form-control-label.html?raw";

interface DatePickerProps {
  size: string;
  year: boolean;
  day: boolean;
  calendar: boolean;
  error: boolean;
  disabled: boolean;
  minDate?: string;
  maxDate?: string;
}

const meta = {
  title: "Components/日付ピッカー",
} satisfies Meta<DatePickerProps>;

export default meta;

function getDateYmd(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export const Playground: StoryObj<DatePickerProps> = {
  name: "Playground (Consolidated)",
  render: (args) => {
    const fragment = new HtmlFragment(
      playgroundConsolidated,
      ".dads-date-picker",
    );

    const datePicker = fragment.root;
    const controls = datePicker.querySelector(".dads-date-picker__controls");
    const inputs = datePicker.querySelector(".dads-date-picker__inputs");
    const yearInput = datePicker.querySelector(".dads-date-picker__year input");
    const monthInput = datePicker.querySelector(
      ".dads-date-picker__month input",
    );
    const dayInput = datePicker.querySelector(".dads-date-picker__day input");
    const calendarButton = datePicker.querySelector(
      ".dads-date-picker__calendar-button",
    );
    const calendar = datePicker.querySelector("dads-calendar");
    const calendarElements = datePicker.querySelectorAll(
      ".dads-date-picker__calendar-button, .dads-date-picker__calendar-popover",
    );
    const errorText = datePicker.querySelector(".dads-date-picker__error-text");

    if (!controls) throw new Error();
    if (!inputs) throw new Error();
    if (!yearInput) throw new Error();
    if (!monthInput) throw new Error();
    if (!dayInput) throw new Error();
    if (!calendarButton) throw new Error();
    if (!calendar) throw new Error();
    if (!errorText) throw new Error();

    controls.setAttribute("data-size", args.size);

    if (!args.year) {
      yearInput.parentNode.remove();
    }

    if (!args.day) {
      dayInput.parentNode.remove();
    }

    if (!args.calendar) {
      for (const el of calendarElements) el.remove();
    }

    if (!args.error) {
      inputs.removeAttribute("data-error");
      yearInput.removeAttribute("aria-describedby");
      yearInput.removeAttribute("aria-invalid");
      monthInput.removeAttribute("aria-describedby");
      monthInput.removeAttribute("aria-invalid");
      dayInput.removeAttribute("aria-describedby");
      dayInput.removeAttribute("aria-invalid");
      errorText.remove();
    }

    if (args.disabled) {
      inputs.setAttribute("data-disabled", "");
      yearInput.setAttribute("disabled", "");
      monthInput.setAttribute("disabled", "");
      dayInput.setAttribute("disabled", "");
      calendarButton.setAttribute("disabled", "");
    }

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
    size: {
      control: "radio",
      options: ["sm", "md", "lg"],
    },
    year: { control: "boolean" },
    day: { control: "boolean" },
    calendar: { control: "boolean" },
    error: { control: "boolean" },
    disabled: { control: "boolean" },
    minDate: { control: "date" },
    maxDate: { control: "date" },
  },
  args: {
    size: "md",
    year: true,
    day: true,
    calendar: false,
    error: false,
    disabled: false,
  },
  parameters: {
    docs: {
      story: {
        height: "560px",
      },
    },
  },
};

export const PlaygroundSeparated: StoryObj<DatePickerProps> = {
  name: "Playground (Separated)",
  render(args) {
    const fragment = new HtmlFragment(playgroundSeparated, ".dads-date-picker");

    const datePicker = fragment.root;
    const controls = datePicker.querySelector(".dads-date-picker__controls");
    const inputs = datePicker.querySelector(
      ".dads-date-picker__separated-inputs",
    );
    const yearInput = datePicker.querySelector(
      ".dads-date-picker__separated-year input",
    );
    const monthInput = datePicker.querySelector(
      ".dads-date-picker__separated-month input",
    );
    const dayInput = datePicker.querySelector(
      ".dads-date-picker__separated-day input",
    );
    const calendarButton = datePicker.querySelector(
      ".dads-date-picker__calendar-button",
    );
    const calendarElements = datePicker.querySelectorAll(
      ".dads-date-picker__calendar-button, .dads-date-picker__calendar-popover",
    );
    const errorText = datePicker.querySelector(".dads-date-picker__error-text");

    if (!controls) throw new Error();
    if (!inputs) throw new Error();
    if (!yearInput) throw new Error();
    if (!monthInput) throw new Error();
    if (!dayInput) throw new Error();
    if (!calendarButton) throw new Error();
    if (!errorText) throw new Error();

    controls.setAttribute("data-size", args.size);

    if (!args.year) {
      yearInput.parentNode.remove();
    }

    if (!args.day) {
      dayInput.parentNode.remove();
    }

    if (!args.calendar) {
      for (const el of calendarElements) el.remove();
    }

    if (!args.error) {
      yearInput.removeAttribute("aria-describedby");
      yearInput.removeAttribute("aria-invalid");
      monthInput.removeAttribute("aria-describedby");
      monthInput.removeAttribute("aria-invalid");
      dayInput.removeAttribute("aria-describedby");
      dayInput.removeAttribute("aria-invalid");
      errorText.remove();
    }

    if (args.disabled) {
      inputs.setAttribute("data-disabled", "");
      yearInput.setAttribute("disabled", "");
      monthInput.setAttribute("disabled", "");
      dayInput.setAttribute("disabled", "");
      calendarButton.setAttribute("disabled", "");
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
    calendar: { control: "boolean" },
    error: { control: "boolean" },
    disabled: { control: "boolean" },
    minDate: { control: "date" },
    maxDate: { control: "date" },
  },
  args: {
    size: "md",
    year: true,
    day: true,
    calendar: false,
    error: false,
    disabled: false,
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
