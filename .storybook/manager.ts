import { addons } from "storybook/manager-api";
import dadsTheme from "./dadsTheme";

import "../src/global.css";

addons.setConfig({
  theme: dadsTheme,
});
