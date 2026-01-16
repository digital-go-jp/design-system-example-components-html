import type { Meta, StoryObj } from "@storybook/html-vite";
import { HtmlFragment } from "../../helpers/html-fragment";
import { type HTMLElement } from "node-html-parser";

import "../button/button.css";
import "./card-example-1.css";
import "./card-example-2.css";
import "./card-example-3.css";
import "./card-example-4.css";
import "./card-example-5.css";
import "./card-example-6.css";
import "../checkbox/checkbox.css";
import "../link/link.css";

import example1 from "./example-1.html?raw";
import example2 from "./example-2.html?raw";
import example3 from "./example-3.html?raw";
import example4 from "./example-4.html?raw";
import example5 from "./example-5.html?raw";
import example6 from "./example-6.html?raw";

import card2Image from "./card-2.jpg";
import card3_1Image from "./card-3-1.png";
import card3_2Image from "./card-3-2.png";
import card4Image from "./card-4.jpg";
import card5Image from "./card-5.jpg";
import card6Image from "./card-6.jpg";

const images: Record<string, string> = {
  "card-2.jpg": card2Image,
  "card-3-1.png": card3_1Image,
  "card-3-2.png": card3_2Image,
  "card-4.jpg": card4Image,
  "card-5.jpg": card5Image,
  "card-6.jpg": card6Image,
};

function replaceImages(root: HTMLElement) {
  root.querySelectorAll("img").forEach((img) => {
    const src = img.getAttribute("src")?.match(/\/?([^/]+)$/)?.[1];
    if (src) {
      img.setAttribute("src", images[src]);
    }
  });
}

const meta = {
  title: "Components/カード",
} satisfies Meta;

export default meta;

export const Example1: StoryObj = {
  render() {
    return new HtmlFragment(example1, "body > ul").toString();
  },
};

export const Example2: StoryObj = {
  render() {
    const fragment = new HtmlFragment(example2, "body > ul");
    replaceImages(fragment.root);
    return fragment.toString();
  },
};

export const Example3: StoryObj = {
  render() {
    const fragment = new HtmlFragment(example3, "body > ul");
    replaceImages(fragment.root);
    return fragment.toString();
  },
};

export const Example4: StoryObj = {
  render() {
    const fragment = new HtmlFragment(example4, "body > ul");
    replaceImages(fragment.root);
    return fragment.toString();
  },
};

export const Example5: StoryObj = {
  render() {
    const fragment = new HtmlFragment(example5, "body > ul");
    replaceImages(fragment.root);
    return fragment.toString();
  },
};

export const Example6: StoryObj = {
  render() {
    const fragment = new HtmlFragment(example6, "body > ul");
    replaceImages(fragment.root);
    return fragment.toString();
  },
};
