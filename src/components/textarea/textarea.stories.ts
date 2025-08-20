import type { Meta, StoryObj } from "@storybook/html-vite";
import { HtmlFragment } from "../../helpers/html-fragment";

import "../form-control-label/form-control-label.css";
import "./textarea.css";
import playground from "./playground.html?raw";
import withFormControlLabel from "./with-form-control-label.html?raw";
import readonly from "./readonly.html?raw";

const meta = {
  title: "Components/テキストエリア",
} satisfies Meta;

export default meta;

interface TextareaPlaygroundProps {
  error: boolean;
  readonly: boolean;
  disabled: boolean;
}

export const Playground: StoryObj<TextareaPlaygroundProps> = {
  render: (args) => {
    const fragment = new HtmlFragment(playground, ".dads-textarea");
    const textarea = fragment.root;
    const textareaTextarea = textarea.querySelector(".dads-textarea__textarea");
    const errorText = textarea.querySelector(".dads-textarea__error-text");

    if (!textareaTextarea) throw new Error();
    if (!errorText) throw new Error();

    if (!args.error) {
      textareaTextarea.removeAttribute("aria-describedby");
      textareaTextarea.removeAttribute("aria-invalid");
      errorText.remove();
    }

    if (args.readonly) {
      textareaTextarea.setAttribute("readonly", "");
    }

    if (args.disabled) {
      textareaTextarea.setAttribute("disabled", "");
    }

    return fragment.toString({ trimBlankLines: true });
  },
  args: {
    error: false,
    readonly: false,
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

    formControlLabel.setAttribute("data-size", args.size);

    return fragment.toString();
  },
  argTypes: {
    size: {
      control: "radio",
      options: ["sm", "md", "lg"],
    },
  },
  args: {
    size: "md",
  },
};

export const Readonly = () =>
  new HtmlFragment(readonly, ".dads-form-control-label").toString();
