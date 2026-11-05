import path from "node:path";
import { resetCssVrt } from "../../../tests/helpers/reset-css-vrt";

const { dirname } = import.meta;

resetCssVrt(`notice-block-playground`, path.join(dirname, "playground.html"));

resetCssVrt(
  "notice-block-with-disclosure-and-chip-label-closed",
  path.join(dirname, "with-disclosure-and-chip-label.html"),
);
