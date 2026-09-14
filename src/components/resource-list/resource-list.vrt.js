import path from "node:path";
import { resetCssVrt } from "../../../tests/helpers/reset-css-vrt";

const { dirname } = import.meta;

resetCssVrt("resource-list-plain", path.join(dirname, "plain.html"));
resetCssVrt(
  "resource-list-selectable-with-inline-interaction",
  path.join(dirname, "selectable-with-inline-interaction.html"),
);
