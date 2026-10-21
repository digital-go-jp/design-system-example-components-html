import type { Meta, StoryObj } from "@storybook/html-vite";
import { HtmlFragment } from "../../helpers/html-fragment";

import "../form-control-label/form-control-label.css";
import "./textarea.css";
import "./textarea-counter.js";
import basic from "./basic.html?raw";
import disabled from "./disabled.html?raw";
import errored from "./errored.html?raw";
import readonly from "./readonly.html?raw";
import withCounter from "./with-counter.html?raw";
import withFormControlLabel from "./with-form-control-label.html?raw";

const meta = {
  title: "Components/テキストエリア",
} satisfies Meta;

export default meta;

export const Basic = () => new HtmlFragment(basic, ".dads-textarea").toString();

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

export const WithCounter = () =>
  new HtmlFragment(withCounter, "body > div").toString();

export const Errored = () =>
  new HtmlFragment(errored, ".dads-form-control-label").toString();

export const Disabled = () =>
  new HtmlFragment(disabled, ".dads-form-control-label").toString();
