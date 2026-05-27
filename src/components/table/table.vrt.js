import path from "node:path";
import { resetCssVrt } from "../../../tests/helpers/reset-css-vrt";

const { dirname } = import.meta;

resetCssVrt("table-playground", path.join(dirname, "playground.html"));

resetCssVrt("table-condensed", path.join(dirname, "condensed-table.html"));

resetCssVrt(
  "table-sortable-header",
  path.join(dirname, "sortable-header.html"),
);

resetCssVrt("table-scrollable", path.join(dirname, "overflow-on-mobile.html"));
