import type { Meta } from "@storybook/html-vite";
import { HtmlFragment } from "../../helpers/html-fragment";

import "../link/link.css";
import "./list.css";
import bullet from "./bullet.html?raw";
import customMarkerFormat from "./custom-marker-format.html?raw";
import nested from "./nested.html?raw";
import numbered from "./numbered.html?raw";
import numberedWithLinks from "./numbered-with-links.html?raw";

const meta = {
  title: "Components/箇条書きリスト",
} satisfies Meta;

export default meta;

export const Bullet = () =>
  new HtmlFragment(bullet, "body>.dads-list").toString();

export const Numbered = () =>
  new HtmlFragment(numbered, "body>.dads-list").toString();

export const CustomMarkerFormat = () =>
  new HtmlFragment(customMarkerFormat, "body>.dads-list").toString();

export const NumberedWithLinks = () =>
  new HtmlFragment(numberedWithLinks, "body>.dads-list").toString();

export const Nested = () =>
  new HtmlFragment(nested, "body>.dads-list").toString();
