import type { Meta, StoryObj } from "@storybook/html-vite";
import { HtmlFragment } from "../../helpers/html-fragment";

import "../form-control-label/form-control-label.css";
import "./select.css";
import disabled from "./disabled.html?raw";
import error from "./error.html?raw";
import optgroup from "./optgroup.html?raw";
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
    const selectControl = select.querySelector(".dads-select__control");
    const selectSelect = select.querySelector(".dads-select__select");

    if (!selectControl) throw new Error();
    if (!selectSelect) throw new Error();

    selectSelect.setAttribute("data-size", args.size);

    if (args.error) {
      selectSelect.setAttribute("aria-invalid", "true");
      selectSelect.setAttribute("aria-describedby", "playground-error-text");
      selectControl.insertAdjacentHTML(
        "afterend",
        '<span id="playground-error-text" class="dads-select__error-text">＊エラーテキストが入ります。</span>',
      );
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

export const Errored = () => new HtmlFragment(error, ".dads-select").toString();

export const Disabled = () =>
  new HtmlFragment(disabled, ".dads-select").toString();

export const Optgroup = () =>
  new HtmlFragment(optgroup, ".dads-select").toString();
