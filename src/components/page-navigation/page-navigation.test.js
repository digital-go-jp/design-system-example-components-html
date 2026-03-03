import path from "node:path";
import { resetCssVrt } from "../../../tests/helpers/reset-css-vrt";

const { dirname } = import.meta;

resetCssVrt("page-navigation-text", path.join(dirname, "text-button.html"));
resetCssVrt(
  "page-navigation-outlined",
  path.join(dirname, "outlined-button.html"),
);
resetCssVrt("page-navigation-arrow", path.join(dirname, "arrow-button.html"));
