import path from "node:path";
import { resetCssVrt } from "../../../tests/helpers/reset-css-vrt";

const { dirname } = import.meta;

resetCssVrt("card-example-1", path.join(dirname, "example-1.html"));
resetCssVrt("card-example-2", path.join(dirname, "example-2.html"));
resetCssVrt("card-example-3", path.join(dirname, "example-3.html"));
resetCssVrt("card-example-4", path.join(dirname, "example-4.html"));
resetCssVrt("card-example-5", path.join(dirname, "example-5.html"));
resetCssVrt("card-example-6", path.join(dirname, "example-6.html"));
