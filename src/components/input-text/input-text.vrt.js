import path from "node:path";
import { resetCssVrt } from "../../../tests/helpers/reset-css-vrt";

const { dirname } = import.meta;

resetCssVrt("input-text-basic", path.join(dirname, "basic.html"));

resetCssVrt(
  "input-text-with-form-control-label",
  path.join(dirname, "with-form-control-label.html"),
);
