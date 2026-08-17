import type { StorybookConfig } from "@storybook/html-vite";
import remarkGfm from "remark-gfm";
import { dadsMarkdownPlugin } from "./dads-md/index.mjs";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    {
      name: "@storybook/addon-docs",
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
    "@storybook/addon-a11y",
    import.meta.resolve("./addons/html-validator"),
    "@storybook/addon-vitest",
  ],
  framework: {
    name: "@storybook/html-vite",
    options: {},
  },
  viteFinal: async (config) => {
    // Storybook の mdx プラグインより前に走らせる必要がある
    config.plugins = [dadsMarkdownPlugin(), ...(config.plugins ?? [])];
    return config;
  },
};
export default config;
