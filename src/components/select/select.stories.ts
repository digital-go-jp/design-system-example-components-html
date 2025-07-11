import type { Meta, StoryObj } from "@storybook/html-vite";
import { HtmlFragment } from "../../helpers/html-fragment";

import "../form-control-label/form-control-label.css";
import "./select.css";
import playground from "./playground.html?raw";
import withFormControlLabel from "./with-form-control-label.html?raw";

const meta = {
  title: "Components/セレクトボックス",
} satisfies Meta;

export default meta;

interface SelectPlaygroundProps {
  size: "sm" | "md" | "lg";
  error: boolean;
  disabled: boolean;
}

export const Playground: StoryObj<SelectPlaygroundProps> = {
  render: (args) => {
    const fragment = new HtmlFragment(playground, ".dads-select");
    const select = fragment.root;
    const selectSelect = select.querySelector(".dads-select__select");
    const errorText = select.querySelector(".dads-select__error-text");

    if (!selectSelect) throw new Error();
    if (!errorText) throw new Error();

    selectSelect.setAttribute("data-size", args.size);

    if (!args.error) {
      selectSelect.removeAttribute("aria-describedby");
      selectSelect.removeAttribute("aria-invalid");
      errorText.remove();
    }

    if (args.disabled) {
      selectSelect.setAttribute("disabled", "");
    }

    return fragment.toString({ trimBlankLines: true });
  },
  argTypes: {
    size: {
      control: { type: "radio" },
      options: ["sm", "md", "lg"],
    },
  },
  args: {
    size: "md",
    error: false,
    disabled: false,
  },
};

export const WithFormControlLabel: StoryObj<{ size: string }> = {
  render: (args) => {
    const fragment = new HtmlFragment(
      withFormControlLabel,
      ".dads-form-control-label",
    );
    const formControlLabel = fragment.root;
    const selectSelect = formControlLabel.querySelector(".dads-select__select");

    if (!selectSelect) throw new Error();

    formControlLabel.setAttribute("data-size", args.size);
    selectSelect.setAttribute("data-size", args.size);

    return fragment.toString();
  },
  argTypes: {
    size: {
      control: { type: "radio" },
      options: ["sm", "md", "lg"],
    },
  },
  args: {
    size: "md",
  },
};
