import path from "node:path";
import { resetCssVrt } from "../../../tests/helpers/reset-css-vrt";

const { dirname } = import.meta;

resetCssVrt("input-text-playground", path.join(dirname, "playground.html"));

resetCssVrt(
  "input-text-with-form-control-label",
  path.join(dirname, "with-form-control-label.html"),
);
