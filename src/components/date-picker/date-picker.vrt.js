import path from "node:path";
import { resetCssVrt } from "../../../tests/helpers/reset-css-vrt";

const { dirname } = import.meta;

resetCssVrt(
  "date-picker-consolidated",
  path.join(dirname, "playground-consolidated.html"),
);
resetCssVrt(
  "date-picker-separated",
  path.join(dirname, "playground-separated.html"),
);
