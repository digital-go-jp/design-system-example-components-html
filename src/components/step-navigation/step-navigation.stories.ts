import type { Meta, StoryObj } from "@storybook/html-vite";
import { HtmlFragment } from "../../helpers/html-fragment";

import "./step-navigation.css";
import asNavigation from "./as-navigation.html?raw";
import numberOnly from "./number-only.html?raw";
import playground from "./playground.html?raw";
import setStepWidth from "./set-step-width.html?raw";
import stepCompleted from "./step-completed.html?raw";
import stepDefault from "./step-default.html?raw";
import stepEditing from "./step-editing.html?raw";
import stepError from "./step-error.html?raw";
import stepReached from "./step-reached.html?raw";
import stepSkipped from "./step-skipped.html?raw";

const meta = {
  title: "Components/ステップナビゲーション",
} satisfies Meta;

export default meta;

interface PlaygroundProps {
  orientation: "horizontal" | "vertical";
  size: "normal" | "small";
}

export const Playground: StoryObj<PlaygroundProps> = {
  render(args) {
    const fragment = new HtmlFragment(playground, ".dads-step-navigation");
    const stepNav = fragment.root;

    stepNav.setAttribute("data-orientation", args.orientation);
    stepNav.setAttribute("data-size", args.size);

    return fragment.toString({ trimBlankLines: true });
  },
  argTypes: {
    orientation: {
      control: "radio",
      options: ["horizontal", "vertical"],
    },
    size: {
      control: "radio",
      options: ["normal", "small"],
    },
  },
  args: {
    orientation: "horizontal",
    size: "normal",
  },
};

export const AsNavigation = () =>
  new HtmlFragment(asNavigation, ".dads-step-navigation").toString();

export const NumberOnly = () =>
  new HtmlFragment(numberOnly, ".dads-step-navigation").toString();

interface SetStepWidthProps {
  stepWidth: number;
  stepMinWidth: number;
}

export const SetStepWidth: StoryObj<SetStepWidthProps> = {
  name: "Set Step Width",
  render(args) {
    const fragment = new HtmlFragment(setStepWidth, ".dads-step-navigation");
    const stepNav = fragment.root;

    stepNav.setAttribute(
      "style",
      `--_step-width: ${args.stepWidth}; --_step-min-width: ${args.stepMinWidth};`,
    );

    return fragment.toString({ trimBlankLines: true });
  },
  argTypes: {
    stepWidth: {
      control: {
        type: "number",
        min: 0,
        max: 1000,
        step: 8,
      },
    },
    stepMinWidth: {
      control: {
        type: "number",
        min: 0,
        max: 1000,
        step: 8,
      },
    },
  },
  args: {
    stepWidth: 320,
    stepMinWidth: 160,
  },
};

interface StepProps {
  interaction: "none" | "link" | "button";
  first: boolean;
  last: boolean;
  current: boolean;
  title: string;
  description: string;
}

const renderStep = (html: string, args: StepProps) => {
  const fragment = new HtmlFragment(html, ".dads-step-navigation");
  const stepNav = fragment.root;
  const step = stepNav.querySelector(".dads-step-navigation__step");
  const header = stepNav.querySelector(".dads-step-navigation__header");
  const title = stepNav.querySelector(".dads-step-navigation__title");
  const desc = stepNav.querySelector(".dads-step-navigation__description");

  if (!step) throw new Error();
  if (!header) throw new Error();
  if (!title) throw new Error();
  if (!desc) throw new Error();

  if (args.interaction === "link") {
    stepNav.tagName = "NAV";
    stepNav.setAttribute("aria-label", "ステップ");
    header.tagName = "A";
    header.setAttribute("href", "#");
  } else if (args.interaction === "button") {
    stepNav.tagName = "DIV";
    stepNav.removeAttribute("aria-label");
    header.tagName = "BUTTON";
    header.setAttribute("type", "button");
  }

  if (args.first) {
    step.setAttribute("data-first", "");
  }
  if (args.last) {
    step.setAttribute("data-last", "");
  }

  if (args.current) {
    step.setAttribute("aria-current", "true");
  }

  if (args.title) {
    title.textContent = args.title;
  } else {
    title.remove();
  }

  if (args.description) {
    desc.textContent = args.description;
  } else {
    desc.remove();
  }

  return fragment.toString({ trimBlankLines: true });
};

const stepArgTypes = {
  interaction: {
    control: "radio",
    options: ["none", "link", "button"],
  },
  first: { control: "boolean" },
  last: { control: "boolean" },
  current: { control: "boolean" },
  title: { control: "text" },
  description: { control: "text" },
} as const;

const stepArgs = {
  interaction: "none",
  first: false,
  last: false,
  current: false,
  title: "ステップのタイトル",
  description: "ステップの説明が入ります。",
} as const;

export const StepDefault: StoryObj<StepProps> = {
  name: "Step / Default",
  render: (args) => renderStep(stepDefault, args),
  argTypes: stepArgTypes,
  args: stepArgs,
};

export const StepReached: StoryObj<StepProps> = {
  name: "Step / Reached",
  render: (args) => renderStep(stepReached, args),
  argTypes: stepArgTypes,
  args: stepArgs,
};

export const StepCompleted: StoryObj<StepProps> = {
  name: "Step / Completed",
  render: (args) => renderStep(stepCompleted, args),
  argTypes: stepArgTypes,
  args: stepArgs,
};

export const StepEditing: StoryObj<StepProps> = {
  name: "Step / Editing",
  render: (args) => renderStep(stepEditing, args),
  argTypes: stepArgTypes,
  args: stepArgs,
};

export const StepError: StoryObj<StepProps> = {
  name: "Step / Error",
  render: (args) => renderStep(stepError, args),
  argTypes: stepArgTypes,
  args: stepArgs,
};

export const StepSkipped: StoryObj<StepProps> = {
  name: "Step / Skipped",
  render: (args) => renderStep(stepSkipped, args),
  argTypes: stepArgTypes,
  args: stepArgs,
};
