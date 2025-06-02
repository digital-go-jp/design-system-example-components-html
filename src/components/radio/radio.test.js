import path from "node:path";
import { resetCssVrt } from "../../../tests/helpers/reset-css-vrt";

const { dirname } = import.meta;

resetCssVrt("all-radios", path.join(dirname, "all-radios.html"));

resetCssVrt("stacked", path.join(dirname, "stacked.html"));
