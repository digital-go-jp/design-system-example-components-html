import type { Meta, StoryObj } from "@storybook/html-vite";
import { HtmlFragment } from "../../helpers/html-fragment";

import "../checkbox/checkbox.css";
import "./form-control-label.css";
import "../input-text/input-text.css";
import single from "./single.html?raw";
import multiple from "./multiple.html?raw";

interface FormControlLabelProps {
  size: string;
  required: boolean;
  supportText: boolean;
  error: boolean;
}

const meta = {
  title: "Components/フォームコントロールラベル",
  argTypes: {
    size: {
      control: "radio",
      options: ["sm", "md", "lg"],
    },
  },
} satisfies Meta<FormControlLabelProps>;

export default meta;
type Story = StoryObj<FormControlLabelProps>;

export const Single: Story = {
  render: (args) => {
    const fragment = new HtmlFragment(single, ".dads-form-control-label");
    const formControlLabel = fragment.root;
    const requirement = formControlLabel.querySelector(
      ".dads-form-control-label__requirement",
    );
    const supportText = formControlLabel.querySelector(
      ".dads-form-control-label__support-text",
    );
    const input = formControlLabel.querySelector(".dads-input-text__input");
    const errorText = formControlLabel.querySelector(
      ".dads-input-text__error-text",
    );
    const descriptions = [];

    if (!requirement) throw new Error();
    if (!supportText) throw new Error();
    if (!input) throw new Error();
    if (!errorText) throw new Error();

    formControlLabel.setAttribute("data-size", args.size);

    if (!args.required) {
      requirement.setAttribute("data-required", "false");
      requirement.textContent = "※任意";
    }

    if (args.error) {
      descriptions.push(errorText.id);
      input.setAttribute("aria-invalid", "true");
    } else {
      input.removeAttribute("aria-invalid");
      errorText.remove();
    }

    if (args.supportText) {
      descriptions.push(supportText.id);
    } else {
      supportText.remove();
    }

    if (descriptions.length > 0) {
      input.setAttribute("aria-describedby", descriptions.join(" "));
    } else {
      input.removeAttribute("aria-describedby");
    }

    return fragment.toString({ trimBlankLines: true });
  },
  args: {
    size: "md",
    required: true,
    supportText: true,
    error: false,
  },
};

export const Multiple: Story = {
  render: (args) => {
    const fragment = new HtmlFragment(multiple, ".dads-form-control-label");
    const formControlLabel = fragment.root;
    const requirement = formControlLabel.querySelector(
      ".dads-form-control-label__requirement",
    );
    const supportText = formControlLabel.querySelector(
      ".dads-form-control-label__support-text",
    );
    const inputs = formControlLabel.querySelectorAll(".dads-checkbox__input");
    const errorText = formControlLabel.querySelector(
      ".dads-form-control-label__error-text",
    );
    const descriptions = [];

    if (!requirement) throw new Error();
    if (!supportText) throw new Error();
    if (!errorText) throw new Error();

    formControlLabel.setAttribute("data-size", args.size);

    if (!args.required) {
      requirement.setAttribute("data-required", "false");
      requirement.textContent = "※任意";
    }

    if (args.error) {
      descriptions.push(errorText.id);
      for (const input of inputs) {
        input.setAttribute("aria-invalid", "true");
      }
    } else {
      for (const input of inputs) {
        input.removeAttribute("aria-invalid");
      }
      errorText.remove();
    }

    if (args.supportText) {
      descriptions.push(supportText.id);
    } else {
      supportText.remove();
    }

    if (descriptions.length > 0) {
      formControlLabel.setAttribute("aria-describedby", descriptions.join(" "));
    } else {
      formControlLabel.removeAttribute("aria-describedby");
    }

    return fragment.toString();
  },
  args: {
    size: "md",
    required: true,
    supportText: true,
    error: false,
  },
};
