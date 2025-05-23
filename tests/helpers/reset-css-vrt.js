import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const NORMALIZE_CSS_PATH = fileURLToPath(import.meta.resolve("normalize.css"));
const PREFLIGHT_CSS_PATH = fileURLToPath(
  import.meta.resolve("tailwindcss/preflight.css"),
);
const REBOOT_CSS_PATH = fileURLToPath(
  import.meta.resolve("bootstrap/dist/css/bootstrap-reboot.css"),
);
const RESET_CSS_PATH = fileURLToPath(import.meta.resolve("reset-css"));

export const resetCssVrt = (name, filePath) => {
  test.describe(`[${name}]リセットCSS切り替えのVRTテスト`, () => {
    test("オリジナルのスクリーンショットを作成", async ({ page }, testInfo) => {
      await page.goto(`file://${filePath}`);
      await page.evaluate(() => {
        document.body.style.margin = "0";
      });
      const snapshotPath = testInfo.snapshotPath(`${name}.png`);
      await page.screenshot({ path: snapshotPath, fullPage: true });
    });

    test("Normalize.css適用時の表示に変化がないこと", async ({ page }) => {
      await page.goto(`file://${filePath}`);

      // Normalize.cssを動的に追加
      const css = await readFile(NORMALIZE_CSS_PATH, "utf-8");
      await page.evaluate((cssText) => {
        const style = document.createElement("style");
        style.textContent = cssText;
        document.head.insertBefore(style, document.head.firstChild);
      }, css);

      await expect(page).toHaveScreenshot(`${name}.png`, {
        maxDiffPixelRatio: 0,
        fullPage: true,
      });
    });

    test("Bootstrap Reboot適用時の表示に変化がないこと", async ({ page }) => {
      await page.goto(`file://${filePath}`);

      // Bootstrap Rebootを動的に追加
      const css = await readFile(REBOOT_CSS_PATH, "utf-8");
      await page.evaluate((cssText) => {
        const style = document.createElement("style");
        style.textContent = cssText;
        document.head.insertBefore(style, document.head.firstChild);
      }, css);

      await expect(page).toHaveScreenshot(`${name}.png`, {
        maxDiffPixelRatio: 0,
        fullPage: true,
      });
    });

    test("Tailwind Preflight適用時の表示に変化がないこと", async ({ page }) => {
      await page.goto(`file://${filePath}`);

      // Tailwind Preflightを動的に追加
      const css = await readFile(PREFLIGHT_CSS_PATH, "utf-8");
      await page.evaluate((cssText) => {
        const style = document.createElement("style");
        style.textContent = cssText;
        document.head.insertBefore(style, document.head.firstChild);
      }, css);

      await expect(page).toHaveScreenshot(`${name}.png`, {
        maxDiffPixelRatio: 0,
        fullPage: true,
      });
    });

    test("Eric Mayer's Reset CSS適用時の表示に変化がないこと", async ({
      page,
    }) => {
      await page.goto(`file://${filePath}`);

      // Eric Mayer's Reset CSSを動的に追加
      const css = await readFile(RESET_CSS_PATH, "utf-8");
      await page.evaluate((cssText) => {
        const style = document.createElement("style");
        style.textContent = cssText;
        document.head.insertBefore(style, document.head.firstChild);
      }, css);

      await expect(page).toHaveScreenshot(`${name}.png`, {
        maxDiffPixelRatio: 0,
        fullPage: true,
      });
    });
  });
};
