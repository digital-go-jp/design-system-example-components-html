import type { Meta, StoryObj } from "@storybook/html-vite";
import { parse, HTMLElement } from "node-html-parser";
import { HtmlFragment } from "../../helpers/html-fragment";

import "./resource-list.css";
import "../checkbox/checkbox.css";
import "../radio/radio.css";
import playground from "./playground.html?raw";
import withControl from "./with-control.html?raw";
import multipleItems from "./multiple-items.html?raw";

const meta = {
  title: "Components/リソースリスト",
} satisfies Meta;

export default meta;

interface ResourceListPlaygroundProps {
  style: "list" | "frame";
  link: boolean;
  interactionType: "inline" | "whole";
  headingLevel: "h2" | "h3" | "h4" | "h5" | "h6";
  hasFrontIcon: boolean;
  hasLabel: boolean;
  hasSupportText: boolean;
  hasSubLabel: boolean;
  hasAction: boolean;
}

export const Playground: StoryObj<ResourceListPlaygroundProps> = {
  name: "Playground (Plain)",
  render(args: ResourceListPlaygroundProps) {
    const fragment = new HtmlFragment(playground, "body > ul");
    const root = fragment.root.querySelector(
      ".dads-resource-list",
    ) as unknown as HTMLElement;
    const body = root.querySelector(".dads-resource-list__body");
    const icon = root.querySelector(".dads-resource-list__body > svg");
    const label = root.querySelector(".dads-resource-list__label");
    const title = root.querySelector(".dads-resource-list__title");
    const supportText = root.querySelector(".dads-resource-list__support");
    const sub = root.querySelector(".dads-resource-list__sub");
    const action = root.querySelector(".dads-resource-list__action");

    if (!body) throw new Error();
    if (!icon) throw new Error();
    if (!label) throw new Error();
    if (!title) throw new Error();
    if (!supportText) throw new Error();
    if (!sub) throw new Error();
    if (!action) throw new Error();

    root.setAttribute("data-style", args.style);

    if (args.link) {
      if (args.interactionType === "inline") {
        const text = title.textContent;
        const anchor = parse('<a href="#"></a>').querySelector("a");
        if (anchor) {
          anchor.textContent = text;
          title.textContent = "";
          title.appendChild(anchor);
        }
      } else if (args.interactionType === "whole") {
        body.tagName = "A";
        body.setAttribute("href", "#");
      }
    }

    title.tagName = args.headingLevel.toUpperCase();

    if (!args.hasFrontIcon) {
      icon.remove();
    }

    if (!args.hasLabel) {
      label.remove();
    }

    if (!args.hasSupportText) {
      supportText.remove();
    }

    if (!args.hasSubLabel) {
      sub.remove();
    }

    if (!args.hasAction) {
      action.remove();
    }

    return fragment.toString({ trimBlankLines: true });
  },
  argTypes: {
    style: {
      control: { type: "inline-radio" },
      options: ["list", "frame"],
    },
    link: {
      control: { type: "boolean" },
    },
    interactionType: {
      control: { type: "inline-radio" },
      options: ["inline", "whole"],
      if: { arg: "link" },
    },
    headingLevel: {
      control: { type: "inline-radio" },
      options: ["h2", "h3", "h4", "h5", "h6"],
    },
    hasFrontIcon: {
      control: { type: "boolean" },
    },
    hasLabel: {
      control: { type: "boolean" },
    },
    hasSupportText: {
      control: { type: "boolean" },
    },
    hasSubLabel: {
      control: { type: "boolean" },
    },
    hasAction: {
      control: { type: "boolean" },
    },
  },
  args: {
    style: "list",
    link: false,
    interactionType: "inline",
    headingLevel: "h2",
    hasFrontIcon: true,
    hasLabel: true,
    hasSupportText: true,
    hasSubLabel: true,
    hasAction: true,
  },
};

interface ResourceListWithControlProps {
  style: "list" | "frame";
  control: "checkbox" | "radio";
  interactionType: "inline" | "whole";
  disabled: boolean;
  hasFrontIcon: boolean;
  hasLabel: boolean;
  hasSupportText: boolean;
  hasSubLabel: boolean;
  hasAction: boolean;
}

export const WithControl: StoryObj<ResourceListWithControlProps> = {
  name: "Playground (with Control)",
  render(args: ResourceListWithControlProps) {
    const fragment = new HtmlFragment(withControl, "body > ul");
    const root = fragment.root.querySelector(
      ".dads-resource-list",
    ) as unknown as HTMLElement;
    const checkbox = root.querySelector(".dads-checkbox");
    const radio = root.querySelector(".dads-radio");
    const icon = root.querySelector(".dads-resource-list__body > svg");
    const title = root.querySelector(".dads-resource-list__title");
    const controlLabel = root.querySelector(".dads-resource-list__title label");
    const label = root.querySelector(".dads-resource-list__label");
    const supportText = root.querySelector(".dads-resource-list__support");
    const sub = root.querySelector(".dads-resource-list__sub");
    const action = root.querySelector(".dads-resource-list__action");
    const actionButton = root.querySelector(
      ".dads-resource-list__action-button",
    );

    if (!checkbox) throw new Error();
    if (!radio) throw new Error();
    if (!icon) throw new Error();
    if (!title) throw new Error();
    if (!controlLabel) throw new Error();
    if (!label) throw new Error();
    if (!supportText) throw new Error();
    if (!sub) throw new Error();
    if (!action) throw new Error();
    if (!actionButton) throw new Error();

    root.setAttribute("data-style", args.style);

    if (args.disabled) {
      checkbox.querySelector("input")?.setAttribute("disabled", "");
      radio.querySelector("input")?.setAttribute("disabled", "");

      if (args.interactionType === "whole") {
        actionButton.setAttribute("disabled", "");
      }
    }

    if (args.control === "checkbox") {
      radio.remove();
    } else if (args.control === "radio") {
      checkbox.remove();
    }

    if (args.interactionType === "whole") {
      root.setAttribute("data-interaction", "whole");
    } else {
      root.removeAttribute("data-interaction");
    }

    if (!args.hasFrontIcon) {
      icon.remove();
    }

    if (!args.hasLabel) {
      label.remove();
    }

    if (!args.hasSupportText) {
      supportText.remove();
    }

    if (!args.hasSubLabel) {
      sub.remove();
    }

    if (!args.hasAction) {
      action.remove();
    }

    return fragment.toString({ trimBlankLines: true });
  },
  argTypes: {
    style: {
      control: { type: "inline-radio" },
      options: ["list", "frame"],
    },
    control: {
      control: { type: "inline-radio" },
      options: ["checkbox", "radio"],
    },
    interactionType: {
      control: { type: "inline-radio" },
      options: ["inline", "whole"],
    },
    disabled: {
      control: { type: "boolean" },
    },
    hasFrontIcon: {
      control: { type: "boolean" },
    },
    hasLabel: {
      control: { type: "boolean" },
    },
    hasSupportText: {
      control: { type: "boolean" },
    },
    hasSubLabel: {
      control: { type: "boolean" },
    },
    hasAction: {
      control: { type: "boolean" },
    },
  },
  args: {
    style: "list",
    control: "checkbox",
    interactionType: "inline",
    disabled: false,
    hasFrontIcon: true,
    hasLabel: true,
    hasSupportText: true,
    hasSubLabel: true,
    hasAction: true,
  },
};

export const MultipleItems = () =>
  new HtmlFragment(multipleItems, "body > ul").toString();
