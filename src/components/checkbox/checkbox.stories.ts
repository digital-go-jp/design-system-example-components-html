import type { Meta, StoryObj } from "@storybook/html";
import { HtmlFragment } from "../../helpers/html-fragment";

import "./checkbox.css";
import "../form-control-label/form-control-label.css";
import playground from "./playground.html?raw";
import standalone from "./standalone.html?raw";
import allCheckboxes from "./all-checkboxes.html?raw";
import stacked from "./stacked.html?raw";
import errored from "./errored.html?raw";
import indeterminate from "./indeterminate.html?raw";

type CheckboxSize = "lg" | "md" | "sm";

interface CheckboxProps {
  size: CheckboxSize;
  checked: boolean;
  errored: boolean;
  disabled: boolean;
  label: string;
}

const meta = {
  title: "Components/チェックボックス",
  render: (args) => {
    const fragment = new HtmlFragment(playground, ".dads-checkbox");
    const checkbox = fragment.root;
    const input = checkbox.querySelector(
      ".dads-checkbox__input",
    ) as unknown as HTMLInputElement;
    const label = checkbox.querySelector(".dads-checkbox__label");

    if (!input) throw new Error();
    if (!label) throw new Error();

    checkbox.setAttribute("data-size", args.size);

    if (args.checked) {
      input.setAttribute("checked", "");
    }

    if (args.errored) {
      input.setAttribute("aria-invalid", "true");
    }

    if (args.disabled) {
      input.setAttribute("disabled", "");
    }

    label.textContent = args.label;

    return fragment.toString();
  },
} satisfies Meta<CheckboxProps>;

export default meta;
type Story = StoryObj<CheckboxProps>;

export const Playground: Story = {
  argTypes: {
    size: {
      control: { type: "radio" },
      options: ["sm", "md", "lg"],
    },
    label: { control: "text" },
  },
  args: {
    size: "sm",
    checked: false,
    errored: false,
    disabled: false,
    label: "ラベル",
  },
};

export const Standalone = () =>
  new HtmlFragment(standalone, ".dads-checkbox").toString();

export const AllCheckboxes = () =>
  new HtmlFragment(allCheckboxes, "div").toString();

export const Stacked: StoryObj<{ size: string }> = {
  render(args) {
    const fragment = new HtmlFragment(stacked, ".dads-form-control-label");
    const fieldset = fragment.root;
    const checkboxes = fieldset.querySelectorAll(".dads-checkbox");

    fieldset.setAttribute("data-size", args.size);

    for (const checkbox of checkboxes) {
      checkbox.setAttribute("data-size", args.size);
    }

    return fragment.toString();
  },
  argTypes: {
    size: {
      control: { type: "radio" },
      options: ["sm", "md", "lg"],
    },
  },
  args: {
    size: "sm",
  },
};

export const Errored = () =>
  new HtmlFragment(errored, ".dads-form-control-label").toString();

export const Indeterminate = () =>
  new HtmlFragment(indeterminate, "body > *").toString();
