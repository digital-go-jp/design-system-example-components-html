import type { Meta, StoryObj } from "@storybook/html-vite";
import { HtmlFragment } from "../../helpers/html-fragment";

import "../button/button.css";
import "./progress-indicator.css";
import "./progress-indicator.stories.css";

import "./progress-indicator";

import linearFill from "./linear-fill.html?raw";
import linearLoop from "./linear-loop.html?raw";
import spinnerFill from "./spinner-fill.html?raw";
import spinnerLoop from "./spinner-loop.html?raw";
import staticIndicator from "./static.html?raw";
import interactiveDemo from "./interactive-demo.html?raw";

const meta = {
  title: "Components/プログレスインジケーター",
} satisfies Meta;

export default meta;

interface SpinnerLoopProps {
  label: string;
}

export const SpinnerLoop: StoryObj<SpinnerLoopProps> = {
  name: "Spinner (Loop)",
  render: (args) => {
    const fragment = new HtmlFragment(spinnerLoop, "dads-progress-indicator");

    for (const root of fragment.roots) {
      const label = root.querySelector(".dads-progress-indicator__label");
      if (label) {
        label.textContent = args.label;
      }
    }

    return fragment.toString();
  },
  argTypes: {
    label: {
      control: { type: "text" },
    },
  },
  args: {
    label: "読み込み中",
  },
};

interface SpinnerFillProps {
  value: number;
  label: string;
}

export const SpinnerFill: StoryObj<SpinnerFillProps> = {
  name: "Spinner (Fill)",
  render: (args) => {
    const fragment = new HtmlFragment(spinnerFill, "dads-progress-indicator");

    for (const root of fragment.roots) {
      root.setAttribute("value", args.value.toString());

      const label = root.querySelector(".dads-progress-indicator__label");
      if (label?.childNodes[0]) {
        label.childNodes[0].rawText = `${args.label}`;
      }
    }

    return fragment.toString();
  },
  argTypes: {
    value: {
      control: { type: "range", min: 0, max: 100, step: 5 },
    },
    label: {
      control: { type: "text" },
    },
  },
  args: {
    value: 35,
    label: "読み込み中",
  },
};

interface LinearLoopProps {
  label: string;
}

export const LinearLoop: StoryObj<LinearLoopProps> = {
  name: "Linear (Loop)",
  render: (args) => {
    const fragment = new HtmlFragment(linearLoop, "dads-progress-indicator");

    for (const root of fragment.roots) {
      const label = root.querySelector(".dads-progress-indicator__label");
      if (label) {
        label.textContent = args.label;
      }
    }

    return fragment.toString();
  },
  argTypes: {
    label: {
      control: { type: "text" },
    },
  },
  args: {
    label: "読み込み中",
  },
};

interface LinearFillProps {
  value: number;
  label: string;
}

export const LinearFill: StoryObj<LinearFillProps> = {
  name: "Linear (Fill)",
  render: (args) => {
    const fragment = new HtmlFragment(linearFill, "dads-progress-indicator");

    for (const root of fragment.roots) {
      root.setAttribute("value", args.value.toString());

      const label = root.querySelector(".dads-progress-indicator__label");
      if (label?.childNodes[0]) {
        label.childNodes[0].rawText = `${args.label}`;
      }
    }

    return fragment.toString();
  },
  argTypes: {
    value: {
      control: { type: "range", min: 0, max: 100, step: 5 },
    },
    label: {
      control: { type: "text" },
    },
  },
  args: {
    value: 35,
    label: "読み込み中",
  },
};

interface StaticProps {
  label: string;
}

export const Static: StoryObj<StaticProps> = {
  render: (args) => {
    const fragment = new HtmlFragment(
      staticIndicator,
      "dads-progress-indicator",
    );

    for (const root of fragment.roots) {
      const label = root.querySelector(".dads-progress-indicator__label");
      if (label) {
        label.textContent = args.label;
      }
    }

    return fragment.toString();
  },
  argTypes: {
    label: {
      control: { type: "text" },
    },
  },
  args: {
    label: "読み込み中",
  },
};

export const InteractiveDemo = () =>
  new HtmlFragment(interactiveDemo, "body > *").toString();
