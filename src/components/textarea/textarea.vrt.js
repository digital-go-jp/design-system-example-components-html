import path from "node:path";
import { resetCssVrt } from "../../../tests/helpers/reset-css-vrt";

const { dirname } = import.meta;

resetCssVrt("textarea-basic", path.join(dirname, "basic.html"));

resetCssVrt(
  "textarea-with-form-control-label",
  path.join(dirname, "with-form-control-label.html"),
);

resetCssVrt("textarea-with-counter", path.join(dirname, "with-counter.html"));
