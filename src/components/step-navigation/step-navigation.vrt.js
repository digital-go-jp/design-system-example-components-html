import path from "node:path";
import { resetCssVrt } from "../../../tests/helpers/reset-css-vrt";

const { dirname } = import.meta;

resetCssVrt(
  "step-navigation-playground-single",
  path.join(dirname, "playground-single.html"),
);

resetCssVrt(
  "step-navigation-playground-full",
  path.join(dirname, "playground-full.html"),
);
