import path from "node:path";
import { resetCssVrt } from "../../../tests/helpers/reset-css-vrt";

const { dirname } = import.meta;

resetCssVrt("menu-list-playground", path.join(dirname, "playground.html"));

resetCssVrt("menu-list-has-children", path.join(dirname, "has-children.html"));
