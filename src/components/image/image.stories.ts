import type { Meta, StoryObj } from "@storybook/html-vite";
import { HtmlFragment } from "../../helpers/html-fragment";

import "./image.css";

import playground from "./playground.html?raw";
import withPictureElement from "./with-picture-element.html?raw";

import sample from "./sample.png";
import sample2x from "./sample@2x.png";
import sampleMobile from "./sample-mobile.png";
import sampleMobile2x from "./sample-mobile@2x.png";

const meta = {
  title: "Components/画像",
} satisfies Meta;

export default meta;

interface ImagePlaygroundProps {
  type: string;
  fullWidth: boolean;
  showCaption: boolean;
  captionStyle: string;
  captionText: string;
  alt: string;
}

export const Playground: StoryObj<ImagePlaygroundProps> = {
  render: (args) => {
    const fragment = new HtmlFragment(playground, ".dads-image");
    const component = fragment.root;
    const caption = component.querySelector(".dads-image__caption");
    const imageArea = component.querySelector(".dads-image__image-area");
    const img = component.querySelector(".dads-image__img");

    if (!caption) throw new Error();
    if (!imageArea) throw new Error();
    if (!img) throw new Error();

    if (args.fullWidth) {
      component.setAttribute("data-full-width", "");
    } else {
      component.removeAttribute("data-full-width");
    }

    if (args.type === "border") {
      imageArea.setAttribute("data-bordered", "");
    } else {
      imageArea.removeAttribute("data-bordered");
    }
    if (args.type === "link") {
      imageArea.tagName = "A";
      imageArea.setAttribute("href", "#");
    }

    if (!args.showCaption) {
      caption.remove();
    } else {
      caption.setAttribute("data-style", args.captionStyle);
      caption.textContent = args.captionText;
    }

    img.setAttribute("src", sample);
    img.setAttribute("srcset", `${sample2x} 2x`);
    img.setAttribute("alt", args.alt);

    return fragment.toString({ trimBlankLines: true });
  },
  argTypes: {
    type: {
      control: { type: "radio" },
      options: ["border", "borderless", "link"],
    },
    fullWidth: { control: "boolean" },
    showCaption: { control: "boolean" },
    captionStyle: {
      if: { arg: "showCaption" },
      control: { type: "radio" },
      options: ["dashed", "solid"],
    },
    captionText: {
      if: { arg: "showCaption" },
      control: "text",
    },
    alt: { control: "text" },
  },
  args: {
    type: "border",
    fullWidth: false,
    showCaption: true,
    captionStyle: "dashed",
    captionText:
      "これはダミーの画像キャプションです。ダミーの画像キャプションは、デザインやレイアウトの作成時に使用される仮の文章です。",
    alt: "サンプル画像",
  },
};

export const WithPictureElement = () => {
  const fragment = new HtmlFragment(withPictureElement, ".dads-image");
  const component = fragment.root;
  const img = component.querySelector(".dads-image__img");
  const sources = component.querySelectorAll("source");

  if (!img) throw new Error();

  img.setAttribute("src", sample);
  img.setAttribute("srcset", `${sample2x} 2x`);

  for (const source of sources) {
    const media = source.getAttribute("media") || "";
    if (media.includes("max-width")) {
      source.setAttribute("srcset", `${sampleMobile}, ${sampleMobile2x} 2x`);
    }
  }

  return fragment.toString();
};
