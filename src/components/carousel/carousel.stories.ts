import type { Meta, StoryObj } from "@storybook/html-vite";
import { HtmlFragment } from "../../helpers/html-fragment";

import "./carousel";
import "./carousel.css";
import "./carousel-single.css";
import "../disclosure/disclosure.css";
import container from "./container.html?raw";
import keyVisualMulti from "./key-visual-multi.html?raw";
import keyVisualSingle from "./key-visual-single.html?raw";

import image1 from "./image-1.webp";
import image2 from "./image-2.webp";
import image3 from "./image-3.webp";
import image4 from "./image-4.webp";
import image5 from "./image-5.webp";
import image6 from "./image-6.webp";
import image7 from "./image-7.webp";
import image8 from "./image-8.webp";
import image9 from "./image-9.webp";

import image1_2x from "./image-1@2x.webp";
import image2_2x from "./image-2@2x.webp";
import image3_2x from "./image-3@2x.webp";
import image4_2x from "./image-4@2x.webp";
import image5_2x from "./image-5@2x.webp";
import image6_2x from "./image-6@2x.webp";
import image7_2x from "./image-7@2x.webp";
import image8_2x from "./image-8@2x.webp";
import image9_2x from "./image-9@2x.webp";

const images: Record<string, string> = {
  "image-1.webp": image1,
  "image-2.webp": image2,
  "image-3.webp": image3,
  "image-4.webp": image4,
  "image-5.webp": image5,
  "image-6.webp": image6,
  "image-7.webp": image7,
  "image-8.webp": image8,
  "image-9.webp": image9,
};

const images2x: Record<string, string> = {
  "image-1.webp": image1_2x,
  "image-2.webp": image2_2x,
  "image-3.webp": image3_2x,
  "image-4.webp": image4_2x,
  "image-5.webp": image5_2x,
  "image-6.webp": image6_2x,
  "image-7.webp": image7_2x,
  "image-8.webp": image8_2x,
  "image-9.webp": image9_2x,
};

function updateImageSrcAndSrcset(img: Element) {
  const src = img.getAttribute("src")?.match(/\/?([^/]+)$/)?.[1];
  if (src && images[src]) {
    img.setAttribute("src", images[src]);
    img.setAttribute("srcset", `${images2x[src]} 2x`);
  }
}

const meta = {
  title: "Components/カルーセル",
} satisfies Meta;

export default meta;

export const Container: StoryObj = {
  name: "Container (Multi Slides)",
  render: () => {
    const fragment = new HtmlFragment(container, "dads-carousel");

    fragment.root.querySelectorAll("img").forEach((img) => {
      updateImageSrcAndSrcset(img);
    });

    return fragment.toString();
  },
};

export const ContainerWithoutLink: StoryObj = {
  name: "Container (Multi Slides without Links)",
  render: () => {
    const fragment = new HtmlFragment(container, "dads-carousel");

    fragment.root.querySelectorAll("img").forEach((img) => {
      updateImageSrcAndSrcset(img);
    });

    fragment.root.querySelectorAll("a[href]").forEach((anchor) => {
      anchor.removeAttribute("href");
      anchor.removeAttribute("target");
      anchor.removeAttribute("rel");
    });

    return fragment.toString();
  },
};

export const KeyVisual: StoryObj = {
  name: "Key Visual (Multi Slides without Link)",
  render: () => {
    const fragment = new HtmlFragment(keyVisualMulti, "dads-carousel");

    fragment.root.querySelectorAll("img").forEach((img) => {
      updateImageSrcAndSrcset(img);
    });

    return fragment.toString();
  },
};

export const KeyVisualWithoutLink: StoryObj = {
  name: "Key Visual (Single Slide without Link)",
  render: () => {
    const fragment = new HtmlFragment(keyVisualSingle, ".dads-carousel-single");

    fragment.root.querySelectorAll("img").forEach((img) => {
      updateImageSrcAndSrcset(img);
    });

    return fragment.toString();
  },
};
