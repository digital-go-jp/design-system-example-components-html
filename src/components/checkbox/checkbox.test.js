import path from "node:path";
import { resetCssVrt } from "../../../tests/helpers/reset-css-vrt";

const { dirname } = import.meta;

resetCssVrt("all-checkboxes", path.join(dirname, "all-checkboxes.html"));

resetCssVrt("stacked", path.join(dirname, "stacked.html"));
