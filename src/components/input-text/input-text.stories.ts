import type { Meta, StoryObj } from "@storybook/html-vite";
import { HtmlFragment } from "../../helpers/html-fragment";

import "./input-text.css";
import "../form-control-label/form-control-label.css";
import playground from "./playground.html?raw";
import withFormControlLabel from "./with-form-control-label.html?raw";

type InputTextSize = "sm" | "md" | "lg";

const meta = {
  title: "Components/インプットテキスト",
} satisfies Meta;

export default meta;

interface InputTextPlaygroundProps {
  size: InputTextSize;
  errored: boolean;
  disabled: boolean;
  value?: string;
}

export const Playground: StoryObj<InputTextPlaygroundProps> = {
  render: (args) => {
    const fragment = new HtmlFragment(playground, ".dads-input-text");
    const inputText = fragment.root;
    const input = inputText.querySelector(".dads-input-text__input");
    const errorText = inputText.querySelector(".dads-input-text__error-text");

    if (!input) throw new Error();
    if (!errorText) throw new Error();

    input.setAttribute("data-size", args.size);

    if (!args.errored) {
      input.removeAttribute("aria-describedby");
      input.removeAttribute("aria-invalid");
      errorText.remove();
    }

    if (args.disabled) {
      input.setAttribute("disabled", "");
    }

    if (args.value) {
      input.setAttribute("value", args.value);
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
    size: "sm",
    errored: false,
    disabled: false,
    value: "",
  },
};

export const WithFormControlLabel = () =>
  new HtmlFragment(withFormControlLabel, ".dads-form-control-label").toString();
