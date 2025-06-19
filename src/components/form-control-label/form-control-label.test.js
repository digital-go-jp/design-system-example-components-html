import path from "node:path";
import { resetCssVrt } from "../../../tests/helpers/reset-css-vrt";

const { dirname } = import.meta;

resetCssVrt("form-control-label-single", path.join(dirname, "single.html"));

resetCssVrt("form-control-label-multiple", path.join(dirname, "multiple.html"));
