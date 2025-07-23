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
const KISO_CSS_PATH = fileURLToPath(import.meta.resolve("kiso.css"));

/**
 * ページにCSSを動的に挿入し、オプションで指定された要素を削除する共通関数
 * @param {Object} page - Playwrightのpageオブジェクト
 * @param {string|null} cssText - 挿入するCSSテキスト（nullの場合は挿入しない）
 * @param {Object} options - オプション設定
 */
const applyCssAndCleanup = async (page, cssText, options) => {
  await page.evaluate(
    ([cssText, options]) => {
      // 本質的な差異ではない部分（コンポーネントで吸収するのが望ましくない部分）のリセット
      Object.assign(document.body.style, {
        margin: "0",
        textSpacingTrim: "normal",
        lineBreak: "auto",
        overflowWrap: "normal",
      });

      // CSSを挿入
      if (cssText) {
        const style = document.createElement("style");
        style.textContent = cssText;
        document.head.insertBefore(style, document.head.firstChild);
      }

      // 指定された要素を削除
      if ("ignoreElements" in options) {
        options.ignoreElements.forEach((selector) => {
          document.querySelectorAll(selector).forEach((el) => el.remove());
        });
      }
    },
    [cssText, options],
  );
};

export const resetCssVrt = (name, filePath, options = {}) => {
  test.describe(`[${name}]リセットCSS切り替えのVRTテスト`, () => {
    test("オリジナルのスクリーンショットを作成", async ({ page }, testInfo) => {
      await page.goto(`file://${filePath}`);
      await applyCssAndCleanup(page, null, options);
      const snapshotPath = testInfo.snapshotPath(`${name}.png`);
      await page.screenshot({ path: snapshotPath, fullPage: true });
    });

    test("Normalize.css適用時の表示に変化がないこと", async ({ page }) => {
      await page.goto(`file://${filePath}`);

      // Normalize.cssを動的に追加
      const css = await readFile(NORMALIZE_CSS_PATH, "utf-8");
      await applyCssAndCleanup(page, css, options);

      await expect(page).toHaveScreenshot(`${name}.png`, {
        maxDiffPixelRatio: 0,
        fullPage: true,
      });
    });

    test("Bootstrap Reboot適用時の表示に変化がないこと", async ({ page }) => {
      await page.goto(`file://${filePath}`);

      // Bootstrap Rebootを動的に追加
      const css = await readFile(REBOOT_CSS_PATH, "utf-8");
      await applyCssAndCleanup(page, css, options);

      await expect(page).toHaveScreenshot(`${name}.png`, {
        maxDiffPixelRatio: 0,
        fullPage: true,
      });
    });

    test("Tailwind Preflight適用時の表示に変化がないこと", async ({ page }) => {
      await page.goto(`file://${filePath}`);

      // Tailwind Preflightを動的に追加
      const css = await readFile(PREFLIGHT_CSS_PATH, "utf-8");
      await applyCssAndCleanup(page, css, options);

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
      await applyCssAndCleanup(page, css, options);

      await expect(page).toHaveScreenshot(`${name}.png`, {
        maxDiffPixelRatio: 0,
        fullPage: true,
      });
    });

    test("kiso.css適用時の表示に変化がないこと", async ({ page }) => {
      await page.goto(`file://${filePath}`);

      // kiso.cssを動的に追加
      const css = await readFile(KISO_CSS_PATH, "utf-8");
      await applyCssAndCleanup(page, css, options);

      await expect(page).toHaveScreenshot(`${name}.png`, {
        maxDiffPixelRatio: 0,
        fullPage: true,
      });
    });

    test("継承プロパティまたは要素へのスタイルが定義済みの時の表示に変化がないこと", async ({
      page,
    }) => {
      await page.goto(`file://${filePath}`);

      // カスタムCSSを適用
      const customCss = `
body {
  margin: 0;
  color: red;
  font: bold 18px / 2 fantasy;
  letter-spacing: 0.1em;
}
a:any-link {
  color: blue;
  text-decoration: none;
}
img, svg {
  display: block;
  max-width: 100%;
  height: auto;
  vertical-align: top;
}
`;
      await applyCssAndCleanup(page, customCss, options);

      await expect(page).toHaveScreenshot(`${name}.png`, {
        maxDiffPixelRatio: 0,
        fullPage: true,
      });
    });
  });
};
