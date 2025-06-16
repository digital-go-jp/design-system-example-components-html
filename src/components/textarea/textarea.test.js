import path from "node:path";
import { resetCssVrt } from "../../../tests/helpers/reset-css-vrt";

const { dirname } = import.meta;

resetCssVrt("textarea-playground", path.join(dirname, "playground.html"));

resetCssVrt(
  "textarea-with-form-control-label",
  path.join(dirname, "with-form-control-label.html"),
);
