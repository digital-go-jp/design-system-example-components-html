import path from "node:path";
import { resetCssVrt } from "../../../tests/helpers/reset-css-vrt";

const { dirname } = import.meta;

resetCssVrt("resource-list-playground", path.join(dirname, "playground.html"));
resetCssVrt(
  "resource-list-with-control",
  path.join(dirname, "with-control.html"),
);
