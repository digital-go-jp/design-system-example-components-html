import path from "node:path";
import { resetCssVrt } from "../../../tests/helpers/reset-css-vrt";

const { dirname } = import.meta;

resetCssVrt(
  "switch-on-off-playground",
  path.join(dirname, "playground-on-off.html"),
);
resetCssVrt(
  "switch-mode-playground",
  path.join(dirname, "playground-mode.html"),
);
