import type { Meta, StoryObj } from "@storybook/html-vite";
import { HtmlFragment } from "../../helpers/html-fragment";

import "./input-text.css";
import "../form-control-label/form-control-label.css";
import basic from "./basic.html?raw";
import disabled from "./disabled.html?raw";
import errored from "./errored.html?raw";
import readonly from "./readonly.html?raw";
import withFormControlLabel from "./with-form-control-label.html?raw";

type InputTextSize = "sm" | "md" | "lg";

const meta = {
  title: "Components/インプットテキスト",
} satisfies Meta;

export default meta;

interface InputTextBasicProps {
  size: InputTextSize;
}

export const Basic: StoryObj<InputTextBasicProps> = {
  render: (args) => {
    const fragment = new HtmlFragment(basic, ".dads-input-text");
    const inputText = fragment.root;
    const input = inputText.querySelector(".dads-input-text__input");

    if (!input) throw new Error();

    input.setAttribute("data-size", args.size);

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
  },
};

export const WithFormControlLabel = () =>
  new HtmlFragment(withFormControlLabel, ".dads-form-control-label").toString();

export const Errored = () =>
  new HtmlFragment(errored, ".dads-form-control-label").toString();

export const Readonly = () =>
  new HtmlFragment(readonly, ".dads-form-control-label").toString();

export const Disabled = () =>
  new HtmlFragment(disabled, ".dads-form-control-label").toString();
