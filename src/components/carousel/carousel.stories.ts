import type { Meta, StoryObj } from "@storybook/html-vite";
import { HtmlFragment } from "../../helpers/html-fragment";

import "./carousel";
import "./carousel.css";
import "../disclosure/disclosure.css";
import normal from "./normal.html?raw";

import image1 from "./image-1.webp";
import image2 from "./image-2.webp";
import image3 from "./image-3.webp";
import image4 from "./image-4.webp";

const images: Record<string, string> = {
  "image-1.webp": image1,
  "image-2.webp": image2,
  "image-3.webp": image3,
  "image-4.webp": image4,
};

const meta = {
  title: "Components/カルーセル",
} satisfies Meta;

export default meta;

export const Normal: StoryObj = {
  render: () => {
    const fragment = new HtmlFragment(normal, "dads-carousel");

    fragment.root.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src")?.match(/\/?([^/]+)$/)?.[1];
      if (src) {
        img.setAttribute("src", images[src]);
      }
    });

    return fragment.toString();
  },
};
