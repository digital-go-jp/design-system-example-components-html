import type { Meta, StoryObj } from "@storybook/html-vite";
import { HtmlFragment } from "../../helpers/html-fragment";

import "../form-control-label/form-control-label.css";
import "./switch-on-off.css";
import "./switch-mode.css";

import "./switch-on-off.js";
import "./switch-mode.js";

import playgroundOnOff from "./playground-on-off.html?raw";
import playgroundMode from "./playground-mode.html?raw";
import withFormControlLabelOnOff from "./with-form-control-label-on-off.html?raw";
import withFormControlLabelMode from "./with-form-control-label-mode.html?raw";

const meta = {
  title: "Components/スイッチ",
} satisfies Meta;

export default meta;

interface SwitchOnOffPlaygroundProps {
  checked: boolean;
  disabled: boolean;
}

export const PlaygroundOnOff: StoryObj<SwitchOnOffPlaygroundProps> = {
  name: "Playground (On/Off)",
  render: (args) => {
    const fragment = new HtmlFragment(playgroundOnOff, ".dads-switch-on-off");
    const component = fragment.root;
    const button = component.querySelector(".dads-switch-on-off__button");

    if (!button) throw new Error();

    if (args.checked) {
      button.setAttribute("aria-checked", "true");
    }

    if (args.disabled) {
      button.setAttribute("disabled", "");
    }

    return fragment.toString({ trimBlankLines: true });
  },
  argTypes: {
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    checked: false,
    disabled: false,
  },
};

export const WithFormControlLabelOnOff = () =>
  new HtmlFragment(
    withFormControlLabelOnOff,
    ".dads-form-control-label",
  ).toString();
WithFormControlLabelOnOff.storyName = "With Form Control Label (On/Off)";

interface SwitchModePlaygroundProps {
  leftLabel: string;
  rightLabel: string;
  disabled: boolean;
}

export const PlaygroundMode: StoryObj<SwitchModePlaygroundProps> = {
  name: "Playground (Mode)",
  render: (args) => {
    const fragment = new HtmlFragment(playgroundMode, ".dads-switch-mode");
    const component = fragment.root;
    const options = component.querySelectorAll(".dads-switch-mode__option");
    const labels = component.querySelectorAll(".dads-switch-mode__label");

    if (options.length < 2) throw new Error();

    const leftOption = options[0];
    const rightOption = options[1];
    const leftLabel = labels[0];
    const rightLabel = labels[1];

    if (!leftOption || !rightOption || !leftLabel || !rightLabel)
      throw new Error();

    leftLabel.textContent = args.leftLabel;
    rightLabel.textContent = args.rightLabel;

    if (args.disabled) {
      leftOption.setAttribute("disabled", "");
      rightOption.setAttribute("disabled", "");
    }

    return fragment.toString();
  },
  argTypes: {
    leftLabel: { control: "text" },
    rightLabel: { control: "text" },
    disabled: { control: "boolean" },
  },
  args: {
    leftLabel: "モード1",
    rightLabel: "モード2",
    disabled: false,
  },
};

export const WithFormControlLabelMode = () =>
  new HtmlFragment(
    withFormControlLabelMode,
    ".dads-form-control-label",
  ).toString();
WithFormControlLabelMode.storyName = "With Form Control Label (Mode)";
