import path from "node:path";
import { expect, test } from "@playwright/test";
import { resetCssVrt } from "../../../tests/helpers/reset-css-vrt";

const { dirname } = import.meta;

resetCssVrt("textarea-playground", path.join(dirname, "playground.html"));

resetCssVrt(
  "textarea-with-form-control-label",
  path.join(dirname, "with-form-control-label.html"),
);

resetCssVrt("textarea-with-counter", path.join(dirname, "with-counter.html"));

// -------------------------------------------------------------------
// TextareaCounter 機能テスト
// -------------------------------------------------------------------

const setupCounter = async (page, options = {}) => {
  const { textareaId = "test-textarea", max = 20, initialValue = "" } = options;

  await page.goto(`file://${path.join(dirname, "with-counter.html")}`);

  await page.evaluate(
    ({ textareaId, max, initialValue }) => {
      document.body.innerHTML = `
        <textarea id="${textareaId}">${initialValue}</textarea>
        <dads-textarea-counter for="${textareaId}" max="${max}"></dads-textarea-counter>
      `;
      customElements.upgrade(document.body);
    },
    { textareaId, max, initialValue },
  );
};

test.describe("TextareaCounter 機能テスト", () => {
  test.describe("初期表示", () => {
    test("初期値なしのときカウント・exceeded 属性が正しいこと", async ({
      page,
    }) => {
      await setupCounter(page, { max: 20 });

      await expect(page.locator("[data-count]")).toHaveText("0 / 20");
      await expect(page.locator("dads-textarea-counter")).not.toHaveAttribute(
        "data-exceeded",
      );
    });

    test("初期値が上限を超えているとき exceeded・validity・エラーメッセージが正しいこと", async ({
      page,
    }) => {
      await setupCounter(page, { max: 20, initialValue: "a".repeat(23) });

      await expect(page.locator("[data-count]")).toHaveText("23 / 20");
      await expect(page.locator("dads-textarea-counter")).toHaveAttribute(
        "data-exceeded",
      );

      const { valid, message } = await page.evaluate(() => {
        const ta = document.getElementById("test-textarea");
        return { valid: ta.validity.valid, message: ta.validationMessage };
      });
      expect(valid).toBe(false);
      expect(message).toBe("3文字超過しています");
    });
  });

  test("入力・削除でカウントが更新されること", async ({ page }) => {
    await setupCounter(page, { max: 20 });
    const textarea = page.locator("#test-textarea");
    const countEl = page.locator("[data-count]");

    await textarea.fill("こんにちは");
    await expect(countEl).toHaveText("5 / 20");

    await textarea.fill("Hi");
    await expect(countEl).toHaveText("2 / 20");

    await textarea.fill("");
    await expect(countEl).toHaveText("0 / 20");
  });

  test("上限超過で data-exceeded と validity が切り替わること", async ({
    page,
  }) => {
    await setupCounter(page, { max: 5 });
    const textarea = page.locator("#test-textarea");
    const counter = page.locator("dads-textarea-counter");

    // 上限以下
    await textarea.fill("abc");
    await expect(counter).not.toHaveAttribute("data-exceeded");

    // ちょうど上限
    await textarea.fill("abcde");
    await expect(counter).not.toHaveAttribute("data-exceeded");

    // 超過 → data-exceeded + invalid + メッセージ
    await textarea.fill("abcdefgh");
    await expect(counter).toHaveAttribute("data-exceeded");
    const { valid, message } = await page.evaluate(() => {
      const ta = document.getElementById("test-textarea");
      return { valid: ta.validity.valid, message: ta.validationMessage };
    });
    expect(valid).toBe(false);
    expect(message).toBe("3文字超過しています");

    // 上限内に戻す → data-exceeded 除去 + valid
    await textarea.fill("abc");
    await expect(counter).not.toHaveAttribute("data-exceeded");
    const validAfter = await page.evaluate(() => {
      return document.getElementById("test-textarea").validity.valid;
    });
    expect(validAfter).toBe(true);
  });

  test("IME: compositionend で更新され isComposing 中は無視されること", async ({
    page,
  }) => {
    await setupCounter(page, { max: 20 });
    const countEl = page.locator("[data-count]");

    // isComposing=true の input → カウント更新されない
    await page.evaluate(() => {
      const ta = document.getElementById("test-textarea");
      ta.value = "に";
      ta.dispatchEvent(new InputEvent("input", { isComposing: true }));
    });
    await expect(countEl).toHaveText("0 / 20");

    // compositionend → カウント更新される
    await page.evaluate(() => {
      const ta = document.getElementById("test-textarea");
      ta.value = "日本語";
      ta.dispatchEvent(new CompositionEvent("compositionend"));
    });
    await expect(countEl).toHaveText("3 / 20");
  });

  test.describe("ディレイ計算", () => {
    test("残り文字数が少ないとき（≤10）ディレイが 1 秒であること", async ({
      page,
    }) => {
      await page.clock.install();
      await setupCounter(page, { max: 20 });

      await page.locator("#test-textarea").fill("a".repeat(15));
      const announcer = page.locator("[data-announcer='polite']");

      // 900ms ではまだ読み上げされない
      await page.clock.fastForward(900);
      await expect(announcer).toHaveText("");

      // 1000ms + 100ms = 1100ms で読み上げされる
      await page.clock.fastForward(300);
      await expect(announcer).toHaveText("残り5文字");
    });

    test("残り文字数が多いときディレイが log10(remaining) 秒に伸びること", async ({
      page,
    }) => {
      await page.clock.install();
      await setupCounter(page, { max: 1000 });

      // 残り49（log10(49)≈1.690→1690ms）
      await page.locator("#test-textarea").fill("a".repeat(951));
      const announcer = page.locator("[data-announcer='polite']");

      await page.clock.fastForward(1500);
      await expect(announcer).toHaveText("");

      await page.clock.fastForward(400);
      await expect(announcer).toHaveText("残り49文字");
    });
  });

  test.describe("超過時の assertive 通知", () => {
    test("超過時は assertive で即時通知されること", async ({ page }) => {
      await page.clock.install();
      await setupCounter(page, { max: 5 });

      await page.locator("#test-textarea").fill("a".repeat(8));
      const announcer = page.locator("[data-announcer='assertive']");

      await page.clock.fastForward(150);
      await expect(announcer).toHaveText("3文字超過");
    });

    test("超過状態が続く場合も入力ごとに assertive で即時通知されること", async ({
      page,
    }) => {
      await page.clock.install();
      await setupCounter(page, { max: 5 });
      const announcer = page.locator("[data-announcer='assertive']");

      // 8文字入力 → 3文字超過
      await page.locator("#test-textarea").fill("a".repeat(8));
      await page.clock.fastForward(150);
      await expect(announcer).toHaveText("3文字超過");

      // 10文字に変更 → 5文字超過
      await page.locator("#test-textarea").fill("a".repeat(10));
      await page.clock.fastForward(150);
      await expect(announcer).toHaveText("5文字超過");
    });
  });
});
