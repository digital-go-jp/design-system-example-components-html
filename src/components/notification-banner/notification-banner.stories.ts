import type { Meta, StoryObj } from "@storybook/html-vite";
import { HtmlFragment } from "../../helpers/html-fragment";

import "../button/button.css";
import "./notification-banner.css";
import info1 from "./info-1.html?raw";
import info2 from "./info-2.html?raw";
import success from "./success.html?raw";
import warning from "./warning.html?raw";
import error from "./error.html?raw";
import mobileCompact from "./mobile-compact.html?raw";

interface NotificationBannerProps {
  style: string;
  dismissible: boolean;
  actionable: boolean;
}

const meta = {
  title: "Components/ノティフィケーションバナー",
  argTypes: {
    style: {
      control: "radio",
      options: ["standard", "color-chip"],
    },
  },
} satisfies Meta<NotificationBannerProps>;

export default meta;

export const Success: StoryObj<NotificationBannerProps> = {
  render(args) {
    const fragment = new HtmlFragment(success, ".dads-notification-banner");
    const closeButton = fragment.root.querySelector(
      ".dads-notification-banner__close",
    );
    const actions = fragment.root.querySelector(
      ".dads-notification-banner__actions",
    );

    if (!closeButton) throw new Error();
    if (!actions) throw new Error();

    fragment.root.setAttribute("data-style", args.style);

    if (!args.dismissible) {
      closeButton.remove();
    }

    if (!args.actionable) {
      actions.remove();
    }

    return fragment.toString();
  },
  args: {
    style: "standard",
    dismissible: true,
    actionable: true,
  },
};

export const ErrorStory: StoryObj<NotificationBannerProps> = {
  name: "Error",
  render(args) {
    const fragment = new HtmlFragment(error, ".dads-notification-banner");
    const closeButton = fragment.root.querySelector(
      ".dads-notification-banner__close",
    );
    const actions = fragment.root.querySelector(
      ".dads-notification-banner__actions",
    );

    if (!closeButton) throw new Error();
    if (!actions) throw new Error();

    fragment.root.setAttribute("data-style", args.style);

    if (!args.dismissible) {
      closeButton.remove();
    }

    if (!args.actionable) {
      actions.remove();
    }

    return fragment.toString();
  },
  args: {
    style: "standard",
    dismissible: true,
    actionable: true,
  },
};

export const Warning: StoryObj<NotificationBannerProps> = {
  render(args) {
    const fragment = new HtmlFragment(warning, ".dads-notification-banner");
    const closeButton = fragment.root.querySelector(
      ".dads-notification-banner__close",
    );
    const actions = fragment.root.querySelector(
      ".dads-notification-banner__actions",
    );

    if (!closeButton) throw new Error();
    if (!actions) throw new Error();

    fragment.root.setAttribute("data-style", args.style);

    if (!args.dismissible) {
      closeButton.remove();
    }

    if (!args.actionable) {
      actions.remove();
    }

    return fragment.toString();
  },
  args: {
    style: "standard",
    dismissible: true,
    actionable: true,
  },
};

export const Info1: StoryObj<NotificationBannerProps> = {
  render(args) {
    const fragment = new HtmlFragment(info1, ".dads-notification-banner");
    const closeButton = fragment.root.querySelector(
      ".dads-notification-banner__close",
    );
    const actions = fragment.root.querySelector(
      ".dads-notification-banner__actions",
    );

    if (!closeButton) throw new Error();
    if (!actions) throw new Error();

    fragment.root.setAttribute("data-style", args.style);

    if (!args.dismissible) {
      closeButton.remove();
    }

    if (!args.actionable) {
      actions.remove();
    }

    return fragment.toString();
  },
  args: {
    style: "standard",
    dismissible: true,
    actionable: true,
  },
};

export const Info2: StoryObj<NotificationBannerProps> = {
  render(args) {
    const fragment = new HtmlFragment(info2, ".dads-notification-banner");
    const closeButton = fragment.root.querySelector(
      ".dads-notification-banner__close",
    );
    const actions = fragment.root.querySelector(
      ".dads-notification-banner__actions",
    );

    if (!closeButton) throw new Error();
    if (!actions) throw new Error();

    fragment.root.setAttribute("data-style", args.style);

    if (!args.dismissible) {
      closeButton.remove();
    }

    if (!args.actionable) {
      actions.remove();
    }

    return fragment.toString();
  },
  args: {
    style: "standard",
    dismissible: true,
    actionable: true,
  },
};

/** 改行が多くなる場合に備えてモバイルでコンパクトタイプの閉じるボタンを使用している例 */
export const MobileCompact: StoryObj = {
  render() {
    return new HtmlFragment(
      mobileCompact,
      ".dads-notification-banner",
    ).toString();
  },
  argTypes: {
    style: {
      table: { disable: true },
    },
  },
};
