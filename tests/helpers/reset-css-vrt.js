import { expect, test } from "@playwright/test";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

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
        textAutospace: "normal",
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

/**
 * ベースラインスクリーンショット（リセットCSS未適用）を取得し、
 * リセットCSS適用後のスクリーンショットと比較する。
 * 各テストが独立して実行できるよう、テスト内でベースラインも取得する。
 */
const compareWithBaseline = async (page, filePath, cssText, options) => {
  // 1. ページを読み込み、前処理のみ適用してベースラインスクリーンショットを取得
  await page.goto(`file://${filePath}`, { waitUntil: "networkidle" });
  await applyCssAndCleanup(page, null, options);
  const baselineBuffer = await page.screenshot({ fullPage: true });

  // 2. 同じセッションで、リセットCSSを<head>の先頭に注入し再スクリーンショット
  //    （ページの再読み込みを避け、レンダリングの非決定性を排除する）
  await page.evaluate((css) => {
    const style = document.createElement("style");
    style.textContent = css;
    document.head.insertBefore(style, document.head.firstChild);
  }, cssText);
  // CSSの適用を待つ
  await page.waitForTimeout(100);
  const comparisonBuffer = await page.screenshot({ fullPage: true });

  // 3. pixelmatchで比較
  const baselinePng = PNG.sync.read(baselineBuffer);
  const comparisonPng = PNG.sync.read(comparisonBuffer);

  expect(baselinePng.width).toBe(comparisonPng.width);
  expect(baselinePng.height).toBe(comparisonPng.height);

  const { width, height } = baselinePng;
  const diff = new PNG({ width, height });

  const numDiffPixels = pixelmatch(
    baselinePng.data,
    comparisonPng.data,
    diff.data,
    width,
    height,
    { threshold: 0.1, includeAA: false },
  );

  // テスト失敗時に画像を出力
  if (numDiffPixels > 0) {
    const testInfo = test.info();
    const outputDir = testInfo.outputDir;
    await mkdir(outputDir, { recursive: true });

    const sanitizedTitle = testInfo.title.replace(/[^a-zA-Z0-9_-]/g, "_");
    await writeFile(
      path.join(outputDir, `${sanitizedTitle}-baseline.png`),
      baselineBuffer,
    );
    await writeFile(
      path.join(outputDir, `${sanitizedTitle}-comparison.png`),
      comparisonBuffer,
    );
    await writeFile(
      path.join(outputDir, `${sanitizedTitle}-diff.png`),
      PNG.sync.write(diff),
    );

    testInfo.attachments.push(
      {
        name: "baseline",
        contentType: "image/png",
        path: path.join(outputDir, `${sanitizedTitle}-baseline.png`),
      },
      {
        name: "comparison",
        contentType: "image/png",
        path: path.join(outputDir, `${sanitizedTitle}-comparison.png`),
      },
      {
        name: "diff",
        contentType: "image/png",
        path: path.join(outputDir, `${sanitizedTitle}-diff.png`),
      },
    );
  }

  // maxDiffPixelRatio: 0 に相当（アンチエイリアシングの微差はthresholdで吸収）
  expect(numDiffPixels).toBe(0);
};

export const resetCssVrt = (name, filePath, options = {}) => {
  test.describe(`[${name}]リセットCSS切り替えのVRTテスト`, () => {
    test("Normalize.css適用時の表示に変化がないこと", async ({ page }) => {
      const css = await readFile(NORMALIZE_CSS_PATH, "utf-8");
      await compareWithBaseline(page, filePath, css, options);
    });

    test("Bootstrap Reboot適用時の表示に変化がないこと", async ({ page }) => {
      const css = await readFile(REBOOT_CSS_PATH, "utf-8");
      await compareWithBaseline(page, filePath, css, options);
    });

    test("Tailwind Preflight適用時の表示に変化がないこと", async ({ page }) => {
      const css = await readFile(PREFLIGHT_CSS_PATH, "utf-8");
      await compareWithBaseline(page, filePath, css, options);
    });

    test("Eric Mayer's Reset CSS適用時の表示に変化がないこと", async ({
      page,
    }) => {
      const css = await readFile(RESET_CSS_PATH, "utf-8");
      await compareWithBaseline(page, filePath, css, options);
    });

    test("kiso.css適用時の表示に変化がないこと", async ({ page }) => {
      const css = await readFile(KISO_CSS_PATH, "utf-8");
      await compareWithBaseline(page, filePath, css, options);
    });

    test("継承プロパティまたは要素へのスタイルが定義済みの時の表示に変化がないこと", async ({
      page,
    }) => {
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
      await compareWithBaseline(page, filePath, customCss, options);
    });
  });
};
