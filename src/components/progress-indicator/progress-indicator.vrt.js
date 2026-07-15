import path from "node:path";
import { resetCssVrt } from "../../../tests/helpers/reset-css-vrt";

const { dirname } = import.meta;

resetCssVrt("spinner-fill", path.join(dirname, "spinner-fill.html"));

resetCssVrt("linear-fill", path.join(dirname, "linear-fill.html"));

resetCssVrt("static", path.join(dirname, "static.html"));
