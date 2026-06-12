import path from "node:path";
import { resetCssVrt } from "../../../tests/helpers/reset-css-vrt";

const { dirname } = import.meta;

resetCssVrt("search-box-playground", path.join(dirname, "playground.html"));
resetCssVrt("search-with-detail", path.join(dirname, "with-detail.html"));
