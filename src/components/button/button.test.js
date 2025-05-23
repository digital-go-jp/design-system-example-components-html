import path from "node:path";
import { resetCssVrt } from "../../../tests/helpers/reset-css-vrt";

const { dirname } = import.meta;

resetCssVrt(
  "all-buttons-using-button",
  path.join(dirname, "all-buttons-using-button.html"),
);

resetCssVrt(
  "all-buttons-using-link",
  path.join(dirname, "all-buttons-using-link.html"),
);
