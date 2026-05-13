import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import "../calendar/calendar.js";
import "./date-picker.js";

// ---------------------------------------------------------------------------
// 「今日」を 2025-06-15（日曜日）に固定する。
// Calendar コンポーネントが内部で new Date() を使うため、
// DatePicker のテストでも時刻を固定して決定性を確保する。
// ---------------------------------------------------------------------------
const FAKE_NOW = new Date(2025, 5, 15, 12, 0, 0);

// ---------------------------------------------------------------------------
// カレンダー部分のHTML（consolidated / separated で共有）
// ---------------------------------------------------------------------------
const calendarInnerHTML = `
  <div class="dads-u-visually-hidden"><h2 data-js-calendar-heading aria-live="polite"></h2></div>
  <div class="dads-calendar__controls">
    <span class="dads-select">
      <span class="dads-select__control">
        <select class="dads-select__select" data-size="sm" aria-label="年" data-js-year-select></select>
      </span>
    </span>
    <div class="dads-calendar__navigation">
      <button class="dads-button" data-size="sm" data-type="outline" data-js-prev-month-button>
        <svg width="16" height="16" viewBox="0 0 16 16" role="img" aria-label="前の月"><path d="m5.27 8 5.33-5.33-.93-.94L3.4 8l6.27 6.27.93-.94L5.27 8Z" fill="currentcolor" /></svg>
      </button>
      <p class="dads-calendar__current-month" data-js-current-month></p>
      <button class="dads-button" data-size="sm" data-type="outline" data-js-next-month-button>
        <svg width="16" height="16" viewBox="0 0 16 16" role="img" aria-label="次の月"><path d="m6 1.73-.93.94L10.4 8l-5.33 5.33.93.94L12.27 8 6 1.73Z" fill="currentcolor" /></svg>
      </button>
    </div>
  </div>
  <table class="dads-calendar__table" role="grid" data-js-calendar-table>
    <thead>
      <tr>
        <th scope="col">日</th><th scope="col">月</th><th scope="col">火</th>
        <th scope="col">水</th><th scope="col">木</th><th scope="col">金</th><th scope="col">土</th>
      </tr>
    </thead>
    <tbody data-js-calendar-tbody>
      <template data-js-cell-template>
        <td class="dads-calendar__data-cell" role="gridcell">
          <button class="dads-calendar__date" data-js-date-button></button>
        </td>
      </template>
    </tbody>
  </table>
  <div class="dads-calendar__footer">
    <button class="dads-button" data-size="sm" data-type="text" data-js-delete-button>削除</button>
    <button class="dads-button" data-size="sm" data-type="outline" data-js-today-button>今日</button>
  </div>`;

const consolidatedHTML = (calendarAttrs = "") => `
<dads-date-picker class="dads-date-picker" data-type="consolidated">
  <div class="dads-date-picker__controls" data-size="md">
    <div class="dads-date-picker__inputs">
      <label class="dads-date-picker__year">
        <span class="dads-date-picker__label">年</span>
        <input class="dads-date-picker__input" type="text" inputmode="numeric" data-js-year-input>
      </label>
      <label class="dads-date-picker__month">
        <span class="dads-date-picker__label">月</span>
        <input class="dads-date-picker__input" type="text" inputmode="numeric" data-js-month-input>
      </label>
      <label class="dads-date-picker__day">
        <span class="dads-date-picker__label">日</span>
        <input class="dads-date-picker__input" type="text" inputmode="numeric" data-js-day-input>
      </label>
    </div>
    <button class="dads-date-picker__calendar-button" type="button" aria-haspopup="dialog" aria-expanded="false" data-js-calendar-button>
      <svg width="24" height="24" viewBox="0 0 24 24" role="img" aria-label="カレンダー">
        <path d="M5 22C3.9 22 3 21.09 3 20V6C3 4.91 3.91 4 5 4H6V2H8V4H16V2H18V4H19C20.09 4 21 4.91 21 6V20C21 21.09 20.09 22 19 22H5ZM5 20H19V10H5V20Z" fill="currentcolor"/>
      </svg>
    </button>
    <div class="dads-date-picker__calendar-popover" role="dialog" aria-label="カレンダー" aria-modal="true" data-js-calendar-popover style="display: none;">
      <div class="dads-date-picker__backdrop" data-js-backdrop></div>
      <dads-calendar class="dads-calendar" role="application" data-js-calendar ${calendarAttrs}>
        ${calendarInnerHTML}
      </dads-calendar>
    </div>
  </div>
</dads-date-picker>`;

const separatedHTML = (calendarAttrs = "") => `
<dads-date-picker class="dads-date-picker" data-type="separated">
  <div class="dads-date-picker__controls" data-size="md">
    <div class="dads-date-picker__separated-inputs">
      <label class="dads-date-picker__separated-year">
        <span class="dads-date-picker__separated-label">年</span>
        <input class="dads-date-picker__separated-input" type="text" inputmode="numeric" data-js-year-input>
      </label>
      <label class="dads-date-picker__separated-month">
        <span class="dads-date-picker__separated-label">月</span>
        <input class="dads-date-picker__separated-input" type="text" inputmode="numeric" data-js-month-input>
      </label>
      <label class="dads-date-picker__separated-day">
        <span class="dads-date-picker__separated-label">日</span>
        <input class="dads-date-picker__separated-input" type="text" inputmode="numeric" data-js-day-input>
      </label>
    </div>
    <button class="dads-date-picker__calendar-button" type="button" aria-haspopup="dialog" aria-expanded="false" data-js-calendar-button>
      <svg width="24" height="24" viewBox="0 0 24 24" role="img" aria-label="カレンダー">
        <path d="M5 22C3.9 22 3 21.09 3 20V6C3 4.91 3.91 4 5 4H6V2H8V4H16V2H18V4H19C20.09 4 21 4.91 21 6V20C21 21.09 20.09 22 19 22H5ZM5 20H19V10H5V20Z" fill="currentcolor"/>
      </svg>
    </button>
    <div class="dads-date-picker__calendar-popover" role="dialog" aria-label="カレンダー" aria-modal="true" data-js-calendar-popover style="display: none;">
      <div class="dads-date-picker__backdrop" data-js-backdrop></div>
      <dads-calendar class="dads-calendar" role="application" data-js-calendar ${calendarAttrs}>
        ${calendarInnerHTML}
      </dads-calendar>
    </div>
  </div>
</dads-date-picker>`;

// ---------------------------------------------------------------------------
// Setup / Teardown
// ---------------------------------------------------------------------------

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(FAKE_NOW);
});

afterEach(() => {
  vi.useRealTimers();
  document.body.innerHTML = "";
});

/**
 * Consolidated タイプの DatePicker をマウントして返す。
 */
const mountConsolidated = (options = {}) => {
  const calAttrs = [];
  if (options.minDate) calAttrs.push(`min-date="${options.minDate}"`);
  if (options.maxDate) calAttrs.push(`max-date="${options.maxDate}"`);
  document.body.innerHTML = consolidatedHTML(calAttrs.join(" "));
  return document.querySelector("dads-date-picker");
};

/**
 * Separated タイプの DatePicker をマウントして返す。
 */
const mountSeparated = (options = {}) => {
  const calAttrs = [];
  if (options.minDate) calAttrs.push(`min-date="${options.minDate}"`);
  if (options.maxDate) calAttrs.push(`max-date="${options.maxDate}"`);
  document.body.innerHTML = separatedHTML(calAttrs.join(" "));
  return document.querySelector("dads-date-picker");
};

// ---------------------------------------------------------------------------
// DOM helpers
// ---------------------------------------------------------------------------

const picker = () => document.querySelector("dads-date-picker");
const yearInput = () => document.querySelector("[data-js-year-input]");
const monthInput = () => document.querySelector("[data-js-month-input]");
const dayInput = () => document.querySelector("[data-js-day-input]");
const calendarButton = () =>
  document.querySelector("[data-js-calendar-button]");
const popover = () => document.querySelector("[data-js-calendar-popover]");
const backdrop = () => document.querySelector("[data-js-backdrop]");
const currentMonth = () =>
  document.querySelector("[data-js-current-month]").textContent;
const calendarYearSelect = () =>
  document.querySelector("[data-js-year-select]");

const isPopoverVisible = () => {
  const el = popover();
  return el && el.style.display !== "none";
};

/** 入力欄にプログラム的に値を設定し input + change イベントを発火する */
const fill = (el, value) => {
  el.value = value;
  el.dispatchEvent(new Event("input", { bubbles: true }));
  el.dispatchEvent(new Event("change", { bubbles: true }));
};

/** カレンダー内の enabled 日付ボタン */
const enabledDateButtons = () => [
  ...document.querySelectorAll("[data-js-date-button]:not(:disabled)"),
];

/** 指定日の enabled ボタン */
const dateButtonFor = (day) =>
  enabledDateButtons().find((b) => b.textContent === String(day));

/** 選択中のボタン */
const selectedButton = () => document.querySelector('[data-selected="true"]');

/** カレンダーを開く */
const openCalendar = async () => {
  await page.getByRole("button", { name: "カレンダー" }).click();
};

// ===========================================================================
// Tests
// ===========================================================================

describe("DatePicker", () => {
  // -------------------------------------------------------------------------
  // 初期化
  // -------------------------------------------------------------------------
  describe("初期化", () => {
    test("Consolidated タイプで年・月・日入力欄とカレンダーボタンが表示される", () => {
      mountConsolidated();

      expect(yearInput()).not.toBeNull();
      expect(monthInput()).not.toBeNull();
      expect(dayInput()).not.toBeNull();
      expect(calendarButton()).not.toBeNull();
      expect(calendarButton().getAttribute("aria-expanded")).toBe("false");
      expect(isPopoverVisible()).toBe(false);
    });

    test("Separated タイプでも年・月・日入力欄とカレンダーボタンが表示される", () => {
      mountSeparated();

      expect(yearInput()).not.toBeNull();
      expect(monthInput()).not.toBeNull();
      expect(dayInput()).not.toBeNull();
      expect(calendarButton()).not.toBeNull();
    });
  });

  // -------------------------------------------------------------------------
  // カレンダーの開閉
  // -------------------------------------------------------------------------
  describe("カレンダーの開閉", () => {
    test("カレンダーボタンクリックでポップオーバーが開く", async () => {
      mountConsolidated({ minDate: "2025-01-01", maxDate: "2025-12-31" });

      await openCalendar();
      expect(isPopoverVisible()).toBe(true);
      expect(calendarButton().getAttribute("aria-expanded")).toBe("true");
    });

    test("開いた状態でカレンダーボタンを再度クリックすると閉じる", async () => {
      mountConsolidated({ minDate: "2025-01-01", maxDate: "2025-12-31" });

      await openCalendar();
      expect(isPopoverVisible()).toBe(true);

      await page.getByRole("button", { name: "カレンダー" }).click();
      expect(isPopoverVisible()).toBe(false);
      expect(calendarButton().getAttribute("aria-expanded")).toBe("false");
    });

    test("背景（backdrop）クリックでカレンダーが閉じる", async () => {
      mountConsolidated({ minDate: "2025-01-01", maxDate: "2025-12-31" });

      await openCalendar();
      expect(isPopoverVisible()).toBe(true);

      backdrop().click();
      expect(isPopoverVisible()).toBe(false);
      expect(calendarButton().getAttribute("aria-expanded")).toBe("false");
    });

    test("Escape キーでカレンダーが閉じる", async () => {
      mountConsolidated({ minDate: "2025-01-01", maxDate: "2025-12-31" });

      await openCalendar();
      expect(isPopoverVisible()).toBe(true);

      await userEvent.keyboard("{Escape}");
      expect(isPopoverVisible()).toBe(false);
      expect(calendarButton().getAttribute("aria-expanded")).toBe("false");
    });

    test("カレンダーを閉じるとカレンダーボタンにフォーカスが戻る", async () => {
      mountConsolidated({ minDate: "2025-01-01", maxDate: "2025-12-31" });

      await openCalendar();
      await userEvent.keyboard("{Escape}");

      expect(document.activeElement).toBe(calendarButton());
    });

    test("backdrop クリックで閉じた後もカレンダーボタンにフォーカスが戻る", async () => {
      mountConsolidated({ minDate: "2025-01-01", maxDate: "2025-12-31" });

      await openCalendar();
      backdrop().click();

      expect(document.activeElement).toBe(calendarButton());
    });

    test("カレンダーを開くとカレンダー内の日付にフォーカスが移る", async () => {
      mountConsolidated({ minDate: "2025-01-01", maxDate: "2025-12-31" });

      await openCalendar();

      expect(document.activeElement.hasAttribute("data-js-date-button")).toBe(
        true,
      );
    });
  });

  // -------------------------------------------------------------------------
  // 日付選択 → 入力欄への同期
  // -------------------------------------------------------------------------
  describe("日付選択と入力同期", () => {
    test("カレンダーで日付を選択すると入力欄に値が反映される", async () => {
      mountConsolidated({ minDate: "2025-01-01", maxDate: "2025-12-31" });

      await openCalendar();
      await userEvent.click(dateButtonFor(20));

      expect(yearInput().value).toBe("2025");
      expect(monthInput().value).toBe("06");
      expect(dayInput().value).toBe("20");
    });

    test("日付選択後にカレンダーが自動で閉じる", async () => {
      mountConsolidated({ minDate: "2025-01-01", maxDate: "2025-12-31" });

      await openCalendar();
      await userEvent.click(dateButtonFor(20));

      expect(isPopoverVisible()).toBe(false);
      expect(calendarButton().getAttribute("aria-expanded")).toBe("false");
    });

    test("日付選択後にカレンダーボタンにフォーカスが戻る", async () => {
      mountConsolidated({ minDate: "2025-01-01", maxDate: "2025-12-31" });

      await openCalendar();
      await userEvent.click(dateButtonFor(20));

      expect(document.activeElement).toBe(calendarButton());
    });

    test("1桁の月・日は0埋め2桁で入力欄に反映される", async () => {
      mountConsolidated({ minDate: "2025-01-01", maxDate: "2025-12-31" });
      // January has single-digit month (1) and single-digit days
      // Open calendar and navigate to January
      await openCalendar();
      // Use the calendar's prev button to go to January
      const cal = document.querySelector("dads-calendar");
      cal.setDisplayMonth(2025, 0); // January

      await userEvent.click(dateButtonFor(5));

      expect(yearInput().value).toBe("2025");
      expect(monthInput().value).toBe("01");
      expect(dayInput().value).toBe("05");
    });

    test("削除ボタンで入力欄がクリアされる", async () => {
      mountConsolidated({ minDate: "2025-01-01", maxDate: "2025-12-31" });

      // まず日付を選択
      await openCalendar();
      await userEvent.click(dateButtonFor(20));
      expect(yearInput().value).toBe("2025");

      // 再度開いて削除
      await openCalendar();
      await page.getByRole("button", { name: "削除" }).click();

      expect(yearInput().value).toBe("");
      expect(monthInput().value).toBe("");
      expect(dayInput().value).toBe("");
    });

    test("今日ボタンで今日の日付が入力欄に反映される", async () => {
      mountConsolidated({ minDate: "2025-01-01", maxDate: "2025-12-31" });

      await openCalendar();
      await page.getByRole("button", { name: "今日" }).click();

      // today = 2025-06-15
      expect(yearInput().value).toBe("2025");
      expect(monthInput().value).toBe("06");
      expect(dayInput().value).toBe("15");
    });

    test("Separated タイプでも日付選択が入力欄に反映される", async () => {
      mountSeparated({ minDate: "2025-01-01", maxDate: "2025-12-31" });

      await openCalendar();
      await userEvent.click(dateButtonFor(10));

      expect(yearInput().value).toBe("2025");
      expect(monthInput().value).toBe("06");
      expect(dayInput().value).toBe("10");
    });
  });

  // -------------------------------------------------------------------------
  // 入力値 → カレンダーへの同期
  // -------------------------------------------------------------------------
  describe("入力値からカレンダーへの同期", () => {
    test("年と月が入力済みの状態でカレンダーを開くと入力した月が表示される", async () => {
      mountConsolidated({ minDate: "2025-01-01", maxDate: "2025-12-31" });

      fill(yearInput(), "2025");
      fill(monthInput(), "03");

      await openCalendar();

      expect(currentMonth()).toBe("3月");
      expect(calendarYearSelect().value).toBe("2025");
    });

    test("年月日すべて入力済みの状態でカレンダーを開くとその日付が選択状態になる", async () => {
      mountConsolidated({ minDate: "2025-01-01", maxDate: "2025-12-31" });

      fill(yearInput(), "2025");
      fill(monthInput(), "06");
      fill(dayInput(), "20");

      await openCalendar();

      expect(selectedButton()).not.toBeNull();
      expect(selectedButton().textContent).toBe("20");
    });

    test("範囲外の年月が入力された場合、最も近い有効な月が表示される", async () => {
      mountConsolidated({ minDate: "2025-01-01", maxDate: "2025-12-31" });

      fill(yearInput(), "2030");
      fill(monthInput(), "12");

      await openCalendar();

      expect(currentMonth()).toBe("12月");
      expect(calendarYearSelect().value).toBe("2025");
    });

    test("入力が空の状態でカレンダーを開くと今日の月が表示される", async () => {
      mountConsolidated({ minDate: "2025-01-01", maxDate: "2025-12-31" });

      await openCalendar();

      // today = 2025-06-15
      expect(currentMonth()).toBe("6月");
      expect(calendarYearSelect().value).toBe("2025");
    });

    test("年のみ入力された状態でカレンダーを開いても正常に動作する", async () => {
      mountConsolidated({ minDate: "2025-01-01", maxDate: "2025-12-31" });

      fill(yearInput(), "2025");
      // 月は空 → NaN → setDisplayMonth は呼ばれない

      await openCalendar();

      // カレンダーは正常に表示される（今日の月）
      expect(isPopoverVisible()).toBe(true);
      expect(currentMonth()).toBe("6月");
    });
  });

  // -------------------------------------------------------------------------
  // Consolidated タイプのキーボードナビゲーション
  // -------------------------------------------------------------------------
  describe("Consolidated: 入力欄間のキーボードナビゲーション", () => {
    test("年入力の末尾で ArrowRight を押すと月入力にフォーカスが移る", async () => {
      mountConsolidated();

      const yi = yearInput();
      yi.focus();
      fill(yi, "2025");

      await userEvent.keyboard("{ArrowRight}");
      expect(document.activeElement).toBe(monthInput());
    });

    test("月入力の末尾で ArrowRight を押すと日入力にフォーカスが移る", async () => {
      mountConsolidated();

      const mi = monthInput();
      mi.focus();
      fill(mi, "06");

      await userEvent.keyboard("{ArrowRight}");
      expect(document.activeElement).toBe(dayInput());
    });

    test("日入力の先頭で ArrowLeft を押すと月入力にフォーカスが移る", async () => {
      mountConsolidated();

      const di = dayInput();
      di.focus();
      fill(di, "15");
      await userEvent.keyboard("{Home}");

      await userEvent.keyboard("{ArrowLeft}");
      expect(document.activeElement).toBe(monthInput());
    });

    test("月入力の先頭で ArrowLeft を押すと年入力にフォーカスが移る", async () => {
      mountConsolidated();

      const mi = monthInput();
      mi.focus();
      fill(mi, "06");
      await userEvent.keyboard("{Home}");

      await userEvent.keyboard("{ArrowLeft}");
      expect(document.activeElement).toBe(yearInput());
    });

    test("カーソルが入力値の途中にある場合はフィールド間移動しない", async () => {
      mountConsolidated();

      const yi = yearInput();
      yi.focus();
      fill(yi, "2025");
      yi.setSelectionRange(2, 2);

      await userEvent.keyboard("{ArrowRight}");
      expect(document.activeElement).toBe(yi);
    });

    test("年入力の先頭で ArrowLeft を押してもフィールド移動しない", async () => {
      mountConsolidated();

      const yi = yearInput();
      yi.focus();
      fill(yi, "2025");
      await userEvent.keyboard("{Home}");

      await userEvent.keyboard("{ArrowLeft}");
      expect(document.activeElement).toBe(yi);
    });

    test("日入力の末尾で ArrowRight を押してもフィールド移動しない", async () => {
      mountConsolidated();

      const di = dayInput();
      di.focus();
      fill(di, "15");
      await userEvent.keyboard("{End}");

      await userEvent.keyboard("{ArrowRight}");
      expect(document.activeElement).toBe(di);
    });
  });

  // -------------------------------------------------------------------------
  // Separated タイプ
  // -------------------------------------------------------------------------
  describe("Separated: 入力欄間のキーボードナビゲーション", () => {
    test("Separated タイプでは ArrowRight でフィールド間移動しない", async () => {
      mountSeparated();

      const yi = yearInput();
      yi.focus();
      fill(yi, "2025");
      await userEvent.keyboard("{End}");

      await userEvent.keyboard("{ArrowRight}");
      expect(document.activeElement).toBe(yi);
    });

    test("Separated タイプでは ArrowLeft でフィールド間移動しない", async () => {
      mountSeparated();

      const di = dayInput();
      di.focus();
      fill(di, "15");
      await userEvent.keyboard("{Home}");

      await userEvent.keyboard("{ArrowLeft}");
      expect(document.activeElement).toBe(di);
    });
  });

  // -------------------------------------------------------------------------
  // フォーカストラップ
  // -------------------------------------------------------------------------
  describe("フォーカストラップ", () => {
    test("最後のフォーカス可能要素で Tab を押すと最初の要素に戻る", async () => {
      mountConsolidated({ minDate: "2025-01-01", maxDate: "2025-12-31" });

      await openCalendar();

      const focusableSelectors = [
        "button:not([disabled])",
        "select:not([disabled])",
        '[tabindex]:not([tabindex="-1"])',
      ].join(",");
      const focusableElements = [
        ...popover().querySelectorAll(focusableSelectors),
      ];
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      lastElement.focus();
      expect(document.activeElement).toBe(lastElement);

      await userEvent.tab();
      expect(document.activeElement).toBe(firstElement);
    });

    test("最初のフォーカス可能要素で Shift+Tab を押すと最後の要素に移る", async () => {
      mountConsolidated({ minDate: "2025-01-01", maxDate: "2025-12-31" });

      await openCalendar();

      const focusableSelectors = [
        "button:not([disabled])",
        "select:not([disabled])",
        '[tabindex]:not([tabindex="-1"])',
      ].join(",");
      const focusableElements = [
        ...popover().querySelectorAll(focusableSelectors),
      ];
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      firstElement.focus();
      expect(document.activeElement).toBe(firstElement);

      await userEvent.tab({ shift: true });
      expect(document.activeElement).toBe(lastElement);
    });
  });

  // -------------------------------------------------------------------------
  // アクセシビリティ
  // -------------------------------------------------------------------------
  describe("アクセシビリティ", () => {
    test("カレンダーボタンに aria-haspopup='dialog' が設定されている", () => {
      mountConsolidated();
      expect(calendarButton().getAttribute("aria-haspopup")).toBe("dialog");
    });

    test("ポップオーバーに role='dialog' と aria-modal='true' が設定されている", () => {
      mountConsolidated();
      expect(popover().getAttribute("role")).toBe("dialog");
      expect(popover().getAttribute("aria-modal")).toBe("true");
    });

    test("ポップオーバーに aria-label='カレンダー' が設定されている", () => {
      mountConsolidated();
      expect(popover().getAttribute("aria-label")).toBe("カレンダー");
    });

    test("カレンダーが閉じている時は aria-expanded='false'", () => {
      mountConsolidated();
      expect(calendarButton().getAttribute("aria-expanded")).toBe("false");
    });

    test("カレンダーが開いている時は aria-expanded='true'", async () => {
      mountConsolidated({ minDate: "2025-01-01", maxDate: "2025-12-31" });
      await openCalendar();
      expect(calendarButton().getAttribute("aria-expanded")).toBe("true");
    });
  });

  // -------------------------------------------------------------------------
  // ライフサイクル
  // -------------------------------------------------------------------------
  describe("ライフサイクル", () => {
    test("DOM から削除した後に再接続しても正常に動作する", async () => {
      mountConsolidated({ minDate: "2025-01-01", maxDate: "2025-12-31" });
      const pickerEl = picker();

      pickerEl.remove();
      document.body.appendChild(pickerEl);

      await openCalendar();
      expect(isPopoverVisible()).toBe(true);

      await userEvent.click(dateButtonFor(10));
      expect(yearInput().value).toBe("2025");
      expect(monthInput().value).toBe("06");
      expect(dayInput().value).toBe("10");
    });
  });
});
