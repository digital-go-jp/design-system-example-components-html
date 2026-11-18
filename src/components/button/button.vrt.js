import path from "node:path";
import { resetCssVrt } from "../../../tests/helpers/reset-css-vrt";

const { dirname } = import.meta;

resetCssVrt(
  "using-button-element",
  path.join(dirname, "using-button-element.html"),
);

resetCssVrt("using-link", path.join(dirname, "using-link.html"));
