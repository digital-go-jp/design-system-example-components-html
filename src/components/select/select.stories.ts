import type { Meta, StoryObj } from "@storybook/html";
import { HtmlFragment } from "../../helpers/html-fragment";

import "../form-control-label/form-control-label.css";
import "./select.css";
import playground from "./playground.html?raw";
import withFormControlLabel from "./with-form-control-label.html?raw";

type SelectSize = "sm" | "md" | "lg";

interface SelectProps {
  size: SelectSize;
  error: boolean;
  disabled: boolean;
}

const meta = {
  title: "Components/セレクトボックス",
  argTypes: {
    size: {
      control: { type: "radio" },
      options: ["sm", "md", "lg"],
    },
  },
} satisfies Meta<SelectProps>;

export default meta;
type Story = StoryObj<SelectProps>;

export const Playground: Story = {
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

    return fragment.toString();
  },
  args: {
    size: "md",
    error: false,
    disabled: false,
  },
};

export const WithFormControlLabel: Story = {
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
  args: {
    size: "md",
  },
};
