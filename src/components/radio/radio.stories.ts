import type { Meta, StoryObj } from "@storybook/html-vite";
import { HtmlFragment } from "../../helpers/html-fragment";

import "./radio.css";
import "../form-control-label/form-control-label.css";
import playground from "./playground.html?raw";
import standalone from "./standalone.html?raw";
import allRadios from "./all-radios.html?raw";
import stacked from "./stacked.html?raw";
import errored from "./errored.html?raw";

type RadioSize = "lg" | "md" | "sm";

interface RadioProps {
  size: RadioSize;
  checked: boolean;
  errored: boolean;
  disabled: boolean;
  label: string;
}

const meta = {
  title: "Components/ラジオボタン",
  render: (args) => {
    console.log("aa");
    const fragment = new HtmlFragment(playground, ".dads-radio");
    const radio = fragment.root;
    const input = radio.querySelector(
      ".dads-radio__input",
    ) as unknown as HTMLInputElement;
    const label = radio.querySelector(".dads-radio__label");

    if (!input) throw new Error();
    if (!label) throw new Error();

    radio.setAttribute("data-size", args.size);

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
} satisfies Meta<RadioProps>;

export default meta;
type Story = StoryObj<RadioProps>;

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
  new HtmlFragment(standalone, ".dads-radio").toString();

export const AllRadios = () => new HtmlFragment(allRadios, "div").toString();

export const Stacked: StoryObj<{ size: string }> = {
  render(args) {
    const fragment = new HtmlFragment(stacked, ".dads-form-control-label");
    const fieldset = fragment.root;
    const radioes = fieldset.querySelectorAll(".dads-radio");

    fieldset.setAttribute("data-size", args.size);

    for (const radio of radioes) {
      radio.setAttribute("data-size", args.size);
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
