import path from "node:path";
import { resetCssVrt } from "../../../tests/helpers/reset-css-vrt";

const { dirname } = import.meta;

resetCssVrt(
  "step-navigation-playground",
  path.join(dirname, "playground.html"),
);

resetCssVrt(
  "step-navigation-as-navigation",
  path.join(dirname, "as-navigation.html"),
);

resetCssVrt(
  "step-navigation-step-default",
  path.join(dirname, "step-default.html"),
);
