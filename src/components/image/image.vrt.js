import path from "node:path";
import { resetCssVrt } from "../../../tests/helpers/reset-css-vrt";

const { dirname } = import.meta;

resetCssVrt("image-playground", path.join(dirname, "playground.html"));
resetCssVrt(
  "image-with-picture",
  path.join(dirname, "with-picture-element.html"),
);
