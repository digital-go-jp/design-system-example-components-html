import path from "node:path";
import { resetCssVrt } from "../../../tests/helpers/reset-css-vrt";

const { dirname } = import.meta;

resetCssVrt("tab-playground-aria", path.join(dirname, "playground-aria.html"), {
  ignoreElements: [".prose"],
});
resetCssVrt("tab-playground", path.join(dirname, "playground.html"));
resetCssVrt(
  "tab-playground-static",
  path.join(dirname, "playground-static.html"),
);
