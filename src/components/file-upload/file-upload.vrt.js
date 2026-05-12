import path from "node:path";
import { resetCssVrt } from "../../../tests/helpers/reset-css-vrt";

const { dirname } = import.meta;

resetCssVrt("file-upload-playground", path.join(dirname, "playground.html"));
resetCssVrt(
  "file-upload-with-existing-files",
  path.join(dirname, "with-existing-files.html"),
);
