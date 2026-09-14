import type { Meta, StoryObj } from "@storybook/html-vite";
import { HtmlFragment } from "../../helpers/html-fragment";

import "./link.css";
import newTab from "./new-tab.html?raw";
import playground from "./playground.html?raw";

const meta = {
  title: "Components/リンク",
} satisfies Meta;

export default meta;

interface LinkPlaygroundProps {
  target: string;
  label: string;
}

export const Playground: StoryObj<LinkPlaygroundProps> = {
  render: (args) => {
    const fragment = new HtmlFragment(playground, ".dads-link");
    const link = fragment.root;

    // link.textContent = args.label;
    /* [0] label */
    link.childNodes[0].rawText = link.childNodes[0].rawText.replace(
      /(\s*).+(\s*)/m,
      `$1${args.label}$2`,
    );

    if (args.target === "_blank") {
      link.setAttribute("target", "_blank");
      if (!link.querySelector(".dads-link__icon")) {
        link.insertAdjacentHTML(
          "beforeend",
          '\n  <svg class="dads-link__icon" width="16" height="16" viewBox="0 0 48 48" role="img" aria-label="新規タブで開きます">\n    <path d="M22 6V9H9V39H39V26H42V42H6V6H22ZM42 6V20H39V11.2L21 29L19 27L36.8 9H28V6H42Z" fill="currentcolor"/>\n  </svg>\n',
        );
      }
    } else {
      link.removeAttribute("target");
      const icon = link.querySelector(".dads-link__icon");
      icon?.remove();
    }

    return fragment.toString({ trimBlankLines: true });
  },
  argTypes: {
    target: {
      control: "radio",
      options: ["_self", "_blank"],
    },
    label: { control: "text" },
  },
  args: {
    target: "_self",
    label: "リンクテキスト",
  },
};

export const NewTab = () => {
  const fragment = new HtmlFragment(newTab, ".dads-link");

  return fragment.toString({ trimBlankLines: true });
};
