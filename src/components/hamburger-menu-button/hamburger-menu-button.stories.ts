import type { Meta } from "@storybook/html-vite";
import { HtmlFragment } from "../../helpers/html-fragment";

import "./hamburger-menu-button.css";
import "./hamburger-menu-icon-button.css";
import desktopAndMobile from "./desktop-and-mobile.html?raw";
import iconButton from "./icon-button.html?raw";
import mobileConditionalEn from "./mobile-conditional-en.html?raw";
import mobileConditional from "./mobile-conditional.html?raw";
import textButton from "./text-button.html?raw";

const meta = {
  title: "Components/ハンバーガーメニューボタン",
} satisfies Meta;

export default meta;

export const DesktopAndMobile = () =>
  new HtmlFragment(desktopAndMobile, "body > div").toString();

export const MobileConditional = () =>
  new HtmlFragment(mobileConditional, "body > div").toString();

export const MobileConditionalEn = () =>
  new HtmlFragment(mobileConditionalEn, "body > div").toString();
MobileConditionalEn.storyName = "Mobile Conditional (En)";

export const TextButton = () =>
  new HtmlFragment(textButton, ".dads-hamburger-menu-button").toString();

export const IconButton = () =>
  new HtmlFragment(iconButton, ".dads-hamburger-menu-icon-button").toString();
