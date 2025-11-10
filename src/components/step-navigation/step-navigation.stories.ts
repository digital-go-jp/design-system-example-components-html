import type { Meta, StoryObj } from "@storybook/html-vite";
import { HtmlFragment } from "../../helpers/html-fragment";
import type { HTMLElement } from "node-html-parser";

import "./step-navigation.css";
import playgroundSingle from "./playground-single.html?raw";
import playgroundFull from "./playground-full.html?raw";

const meta = {
  title: "Components/ステップナビゲーション",
} satisfies Meta;

export default meta;

interface PlaygroundSingleProps {
  interaction: "none" | "link" | "button";
  first: boolean;
  last: boolean;
  current: boolean;
  state: "default" | "reached" | "completed" | "editing" | "error" | "skipped";
  title: string;
  description: string;
}

interface PlaygroundFullProps {
  orientation: "horizontal" | "vertical";
  size: "normal" | "small";
  numberOnly: boolean;
  steps: number;
  stepWidth?: number;
  stepMinWidth?: number;
}

export const PlaygroundSingle: StoryObj<PlaygroundSingleProps> = {
  name: "Playground (Single)",
  render(args) {
    const fragment = new HtmlFragment(
      playgroundSingle,
      ".dads-step-navigation",
    );
    const stepNav = fragment.root;
    const steps = stepNav.querySelectorAll(".dads-step-navigation__step");
    const step = steps.find((step) => {
      const state = step.getAttribute("data-state") || "default";
      return state === args.state;
    });

    if (!step) throw new Error();

    const header = step.querySelector(".dads-step-navigation__header");
    const number = step.querySelector(".dads-step-navigation__number");
    const title = step.querySelector(".dads-step-navigation__title");
    const desc = step.querySelector(".dads-step-navigation__description");

    if (!header) throw new Error();
    if (!number) throw new Error();
    if (!title) throw new Error();
    if (!desc) throw new Error();

    steps.forEach((s) => {
      if (step !== s) {
        s.remove();
      }
    });

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
  },
  argTypes: {
    interaction: {
      control: "radio",
      options: ["none", "link", "button"],
    },
    first: { control: "boolean" },
    last: { control: "boolean" },
    current: { control: "boolean" },
    state: {
      control: "radio",
      options: [
        "default",
        "reached",
        "completed",
        "editing",
        "error",
        "skipped",
      ],
    },
    title: { control: "text" },
    description: { control: "text" },
  },
  args: {
    interaction: "none",
    first: false,
    last: false,
    current: false,
    state: "default",
    title: "ステップのタイトル",
    description: "ステップの説明が入ります。",
  },
};

export const PlaygroundFull: StoryObj<PlaygroundFullProps> = {
  name: "Playground (Full)",
  render(args) {
    const fragment = new HtmlFragment(playgroundFull, ".dads-step-navigation");
    const stepNav = fragment.root;
    const reached = stepNav.querySelector(":scope > p");
    const step = stepNav.querySelector(".dads-step-navigation__step");
    const whiteSpace = step?.previousSibling;

    if (!reached) throw new Error();
    if (!step) throw new Error();
    if (!whiteSpace) throw new Error();

    stepNav.setAttribute("data-orientation", args.orientation);
    stepNav.setAttribute("data-size", args.size);

    if (args.numberOnly) {
      stepNav.querySelector(".dads-step-navigation__title")?.remove();
      stepNav.querySelector(".dads-step-navigation__description")?.remove();
    }

    const htmlToInsert = [];
    for (let i = 0; i < args.steps; i++) {
      htmlToInsert.push(whiteSpace.toString());
      const newStep = step.clone() as HTMLElement;
      if (i === 0) {
        newStep.setAttribute("data-state", "reached");
        newStep.setAttribute("data-first", "");
        newStep.setAttribute("aria-current", "true");
      }
      if (i === args.steps - 1) {
        newStep.setAttribute("data-last", "");
      }

      const number = newStep.querySelector(
        ".dads-step-navigation__number",
      ) as HTMLElement;
      number.textContent = String(i + 1);

      htmlToInsert.push(newStep.toString());
    }
    const container = step.parentNode;
    container.insertAdjacentHTML("afterbegin", htmlToInsert.join(""));
    step.remove();
    whiteSpace.remove();

    reached.textContent = reached.textContent
      .replace("{total}", String(args.steps))
      .replace("{reached}", "1");

    if (args.stepWidth || args.stepMinWidth) {
      stepNav.setAttribute(
        "style",
        `--_width: ${args.stepWidth}; --_step-min-width: ${args.stepMinWidth};`,
      );
    } else {
      stepNav.removeAttribute("style");
    }

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
    numberOnly: {
      control: "boolean",
    },
    steps: {
      control: {
        type: "number",
        min: 1,
        max: 100,
        step: 1,
      },
    },
    stepWidth: {
      control: {
        type: "number",
        min: 0,
        max: 1000,
        step: 8,
      },
      if: { arg: "orientation", eq: "horizontal" },
    },
    stepMinWidth: {
      control: {
        type: "number",
        min: 0,
        max: 1000,
        step: 8,
      },
      if: { arg: "orientation", eq: "horizontal" },
    },
  },
  args: {
    orientation: "horizontal",
    size: "normal",
    numberOnly: false,
    steps: 3,
    stepWidth: 320,
    stepMinWidth: 160,
  },
};
