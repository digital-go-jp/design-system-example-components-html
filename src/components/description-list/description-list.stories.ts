import type { Meta } from "@storybook/html-vite";
import { HtmlFragment } from "../../helpers/html-fragment";

import "./description-list.css";
import bullet from "./bullet.html?raw";
import customIconMarker from "./custom-icon-marker.html?raw";
import customMarker from "./custom-marker.html?raw";
import withoutMarker from "./without-marker.html?raw";

const meta = {
  title: "Components/説明リスト",
} satisfies Meta;

export default meta;

export const WithoutMarker = () => {
  const fragment = new HtmlFragment(withoutMarker, ".dads-description-list");
  return fragment.toString();
};

export const Bullet = () => {
  const fragment = new HtmlFragment(bullet, ".dads-description-list");
  return fragment.toString();
};

export const CustomMarker = () => {
  const fragment = new HtmlFragment(customMarker, ".dads-description-list");
  return fragment.toString();
};

export const CustomIconMarker = () => {
  const fragment = new HtmlFragment(customIconMarker, ".dads-description-list");
  return fragment.toString();
};
