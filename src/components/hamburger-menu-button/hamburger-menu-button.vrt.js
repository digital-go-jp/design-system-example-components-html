import path from "node:path";
import { resetCssVrt } from "../../../tests/helpers/reset-css-vrt";

const { dirname } = import.meta;

resetCssVrt(
  "hamburger-menu-button-desktop-and-mobile",
  path.join(dirname, "desktop-and-mobile.html"),
);

resetCssVrt(
  "hamburger-menu-button-mobile",
  path.join(dirname, "mobile-conditional.html"),
);
