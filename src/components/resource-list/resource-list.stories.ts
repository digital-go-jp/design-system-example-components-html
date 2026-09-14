import type { Meta, StoryObj } from "@storybook/html-vite";
import { HTMLElement } from "node-html-parser";
import { HtmlFragment } from "../../helpers/html-fragment";

import "./resource-list.css";
import "../checkbox/checkbox.css";
import multipleItems from "./multiple-items.html?raw";
import plain from "./plain.html?raw";
import plainWithInlineLink from "./plain-with-inline-link.html?raw";
import plainWithWholeLink from "./plain-with-whole-link.html?raw";
import selectableWithInlineInteraction from "./selectable-with-inline-interaction.html?raw";
import selectableWithWholeInteraction from "./selectable-with-whole-interaction.html?raw";

const meta = {
  title: "Components/リソースリスト",
} satisfies Meta;

export default meta;

interface ResourceListPlainProps {
  style: "list" | "frame";
  headingLevel: "h2" | "h3" | "h4" | "h5" | "h6";
  hasFrontIcon: boolean;
  hasLabel: boolean;
  hasSupportText: boolean;
  hasSubLabel: boolean;
  hasAction: boolean;
}

export const Plain: StoryObj<ResourceListPlainProps> = {
  name: "Plain",
  render(args: ResourceListPlainProps) {
    const fragment = new HtmlFragment(plain, "body > ul");
    const root = fragment.root.querySelector(
      ".dads-resource-list",
    ) as unknown as HTMLElement;
    const icon = root.querySelector(".dads-resource-list__body > svg");
    const label = root.querySelector(".dads-resource-list__label");
    const title = root.querySelector(".dads-resource-list__title");
    const supportText = root.querySelector(".dads-resource-list__support");
    const sub = root.querySelector(".dads-resource-list__sub");
    const action = root.querySelector(".dads-resource-list__action");

    if (!icon) throw new Error();
    if (!label) throw new Error();
    if (!title) throw new Error();
    if (!supportText) throw new Error();
    if (!sub) throw new Error();
    if (!action) throw new Error();

    root.setAttribute("data-style", args.style);

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
    headingLevel: "h2",
    hasFrontIcon: true,
    hasLabel: true,
    hasSupportText: true,
    hasSubLabel: true,
    hasAction: true,
  },
};

export const PlainWithInlineLink: StoryObj = {
  render() {
    return new HtmlFragment(plainWithInlineLink, "body > ul").toString({
      trimBlankLines: true,
    });
  },
};

interface ResourceListPlainWithWholeLinkProps {
  style: "list" | "frame";
  hasAction: boolean;
}

export const PlainWithWholeLink: StoryObj<ResourceListPlainWithWholeLinkProps> =
  {
    render(args: ResourceListPlainWithWholeLinkProps) {
      const fragment = new HtmlFragment(plainWithWholeLink, "body > ul");
      const root = fragment.root.querySelector(
        ".dads-resource-list",
      ) as unknown as HTMLElement;
      const action = root.querySelector(".dads-resource-list__action");

      if (!action) throw new Error();

      root.setAttribute("data-style", args.style);

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
      hasAction: {
        control: { type: "boolean" },
      },
    },
    args: {
      style: "list",
      hasAction: true,
    },
  };

interface ResourceListSelectableWithInlineInteractionProps {
  style: "list" | "frame";
  disabled: boolean;
}

export const SelectableWithInlineInteraction: StoryObj<ResourceListSelectableWithInlineInteractionProps> =
  {
    render(args: ResourceListSelectableWithInlineInteractionProps) {
      const fragment = new HtmlFragment(
        selectableWithInlineInteraction,
        "body > ul",
      );
      const root = fragment.root.querySelector(
        ".dads-resource-list",
      ) as unknown as HTMLElement;
      const checkbox = root.querySelector(".dads-checkbox");

      if (!checkbox) throw new Error();

      root.setAttribute("data-style", args.style);

      if (args.disabled) {
        checkbox.querySelector("input")?.setAttribute("disabled", "");
      }

      return fragment.toString({ trimBlankLines: true });
    },
    argTypes: {
      style: {
        control: { type: "inline-radio" },
        options: ["list", "frame"],
      },
      disabled: {
        control: { type: "boolean" },
      },
    },
    args: {
      style: "list",
      disabled: false,
    },
  };

interface ResourceListSelectableWithWholeInteractionProps {
  style: "list" | "frame";
  disabled: boolean;
  hasAction: boolean;
}

export const SelectableWithWholeInteraction: StoryObj<ResourceListSelectableWithWholeInteractionProps> =
  {
    render(args: ResourceListSelectableWithWholeInteractionProps) {
      const fragment = new HtmlFragment(
        selectableWithWholeInteraction,
        "body > ul",
      );
      const root = fragment.root.querySelector(
        ".dads-resource-list",
      ) as unknown as HTMLElement;
      const checkbox = root.querySelector(".dads-checkbox");
      const action = root.querySelector(".dads-resource-list__action");
      const actionButton = root.querySelector(
        ".dads-resource-list__action-button",
      );

      if (!checkbox) throw new Error();
      if (!action) throw new Error();
      if (!actionButton) throw new Error();

      root.setAttribute("data-style", args.style);

      if (args.disabled) {
        checkbox.querySelector("input")?.setAttribute("disabled", "");
        actionButton.setAttribute("disabled", "");
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
      disabled: {
        control: { type: "boolean" },
      },
      hasAction: {
        control: { type: "boolean" },
      },
    },
    args: {
      style: "list",
      disabled: false,
      hasAction: true,
    },
  };

export const MultipleItems = () =>
  new HtmlFragment(multipleItems, "body > ul").toString();
