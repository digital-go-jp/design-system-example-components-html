import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import "./textarea-counter.js";

const setupCounter = (options = {}) => {
  const { textareaId = "test-textarea", max = 20, initialValue = "" } = options;
  document.body.innerHTML = `
    <textarea id="${textareaId}">${initialValue}</textarea>
    <dads-textarea-counter for="${textareaId}" max="${max}"></dads-textarea-counter>
  `;
};

const fill = (textarea, value) => {
  textarea.value = value;
  textarea.dispatchEvent(new InputEvent("input", { bubbles: true }));
};

const counterEl = () => document.querySelector("dads-textarea-counter");
const countDisplayEl = () => document.querySelector("[data-count]");
const politeAnnouncerEl = () =>
  document.querySelector("[data-announcer='polite']");
const assertiveAnnouncerEl = () =>
  document.querySelector("[data-announcer='assertive']");
const textareaEl = () => document.getElementById("test-textarea");

describe("TextareaCounter 機能テスト", () => {
  describe("初期表示", () => {
    test("初期値なしのときカウント・exceeded 属性が正しいこと", () => {
      setupCounter({ max: 20 });
      expect(countDisplayEl().textContent).toBe("0 / 20");
      expect(counterEl().hasAttribute("data-exceeded")).toBe(false);
    });

    test("初期値が上限を超えているとき exceeded・validity・エラーメッセージが正しいこと", () => {
      setupCounter({ max: 20, initialValue: "a".repeat(23) });
      expect(countDisplayEl().textContent).toBe("23 / 20");
      expect(counterEl().hasAttribute("data-exceeded")).toBe(true);
      const ta = textareaEl();
      expect(ta.validity.valid).toBe(false);
      expect(ta.validationMessage).toBe("3文字超過しています");
    });
  });

  test("入力・削除でカウントが更新されること", () => {
    setupCounter({ max: 20 });
    const ta = textareaEl();
    fill(ta, "こんにちは");
    expect(countDisplayEl().textContent).toBe("5 / 20");
    fill(ta, "Hi");
    expect(countDisplayEl().textContent).toBe("2 / 20");
    fill(ta, "");
    expect(countDisplayEl().textContent).toBe("0 / 20");
  });

  test("上限超過で data-exceeded と validity が切り替わること", () => {
    setupCounter({ max: 5 });
    const ta = textareaEl();
    fill(ta, "abc");
    expect(counterEl().hasAttribute("data-exceeded")).toBe(false);
    fill(ta, "abcde");
    expect(counterEl().hasAttribute("data-exceeded")).toBe(false);
    fill(ta, "abcdefgh");
    expect(counterEl().hasAttribute("data-exceeded")).toBe(true);
    expect(ta.validity.valid).toBe(false);
    expect(ta.validationMessage).toBe("3文字超過しています");
    fill(ta, "abc");
    expect(counterEl().hasAttribute("data-exceeded")).toBe(false);
    expect(ta.validity.valid).toBe(true);
  });

  test("IME: compositionend で更新され isComposing 中は無視されること", () => {
    setupCounter({ max: 20 });
    const ta = textareaEl();
    ta.value = "に";
    ta.dispatchEvent(
      new InputEvent("input", { isComposing: true, bubbles: true }),
    );
    expect(countDisplayEl().textContent).toBe("0 / 20");
    ta.value = "日本語";
    ta.dispatchEvent(new CompositionEvent("compositionend", { bubbles: true }));
    expect(countDisplayEl().textContent).toBe("3 / 20");
  });

  describe("ディレイ計算", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    test("残り文字数が少ないとき（≤10）ディレイが 1 秒であること", () => {
      setupCounter({ max: 20 });
      fill(textareaEl(), "a".repeat(15));
      vi.advanceTimersByTime(900);
      expect(politeAnnouncerEl().textContent).toBe("");
      vi.advanceTimersByTime(300);
      expect(politeAnnouncerEl().textContent).toBe("残り5文字");
    });

    test("残り文字数が多いときディレイが log10(remaining) 秒に伸びること", () => {
      setupCounter({ max: 1000 });
      fill(textareaEl(), "a".repeat(951));
      vi.advanceTimersByTime(1500);
      expect(politeAnnouncerEl().textContent).toBe("");
      vi.advanceTimersByTime(400);
      expect(politeAnnouncerEl().textContent).toBe("残り49文字");
    });
  });

  describe("超過時の assertive 通知", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    test("超過時は assertive で即時通知されること", () => {
      setupCounter({ max: 5 });
      fill(textareaEl(), "a".repeat(8));
      vi.advanceTimersByTime(150);
      expect(assertiveAnnouncerEl().textContent).toBe("3文字超過");
    });

    test("超過状態が続く場合も入力ごとに assertive で即時通知されること", () => {
      setupCounter({ max: 5 });
      fill(textareaEl(), "a".repeat(8));
      vi.advanceTimersByTime(150);
      expect(assertiveAnnouncerEl().textContent).toBe("3文字超過");
      fill(textareaEl(), "a".repeat(10));
      vi.advanceTimersByTime(150);
      expect(assertiveAnnouncerEl().textContent).toBe("5文字超過");
    });
  });
});
