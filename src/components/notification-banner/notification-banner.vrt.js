import path from "node:path";
import { resetCssVrt } from "../../../tests/helpers/reset-css-vrt";

const { dirname } = import.meta;

resetCssVrt("notification-banner-success", path.join(dirname, "success.html"));

resetCssVrt(
  "notification-banner-mobile-compact",
  path.join(dirname, "mobile-compact.html"),
);
