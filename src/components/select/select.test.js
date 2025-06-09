import path from "node:path";
import { resetCssVrt } from "../../../tests/helpers/reset-css-vrt";

const { dirname } = import.meta;

resetCssVrt("select-playground", path.join(dirname, "playground.html"));

resetCssVrt("select-with-label", path.join(dirname, "with-label.html"));
