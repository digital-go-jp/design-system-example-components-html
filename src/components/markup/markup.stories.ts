import type { Meta } from "@storybook/html-vite";
import { HtmlFragment } from "../../helpers/html-fragment";

import "./markup.css";
import kitchensink from "./kitchensink.html?raw";

const meta = {
  title: "Components/マークアップ",
} satisfies Meta;

export default meta;

export const KitchenSink = () =>
  new HtmlFragment(kitchensink, ".dads-markup").toString();
