import path from "node:path";
import { resetCssVrt } from "../../../tests/helpers/reset-css-vrt";

const { dirname } = import.meta;

resetCssVrt(
  "breadcrumb-with-visible-label",
  path.join(dirname, "with-visible-label.html"),
);

resetCssVrt(
  "breadcrumb-with-home-icon",
  path.join(dirname, "with-home-icon.html"),
);
