import path from "node:path";
import { resetCssVrt } from "../../../tests/helpers/reset-css-vrt";

const { dirname } = import.meta;

resetCssVrt("stacked", path.join(dirname, "stacked.html"), {
  ignoreElements: [".dads-accordion__content"],
});
