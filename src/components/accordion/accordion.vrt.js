import path from "node:path";
import { resetCssVrt } from "../../../tests/helpers/reset-css-vrt";

const { dirname } = import.meta;

resetCssVrt("accordion-stacked", path.join(dirname, "stacked.html"), {
  ignoreElements: [".dads-accordion__content"],
});
