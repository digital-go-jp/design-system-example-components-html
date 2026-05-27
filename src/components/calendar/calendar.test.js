import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import "./calendar.js";

// ---------------------------------------------------------------------------
// テスト全体を通して「今日」を 2025-06-15（日曜日）に固定する。
// これにより、テスト結果が実行日に依存しなくなる。
//
// 2025年6月のカレンダー:
//   日  月  火  水  木  金  土
//    1   2   3   4   5   6   7
//    8   9  10  11  12  13  14
//   15  16  17  18  19  20  21
//   22  23  24  25  26  27  28
//   29  30
// ---------------------------------------------------------------------------
const FAKE_NOW = new Date(2025, 5, 15, 12, 0, 0);

// カレンダーの最小限のHTML。playground.html から独立させることで
// デモ用の変更がテストに影響しなくなる。
const calendarHTML = (extraAttrs = "") => `
<dads-calendar class="dads-calendar" role="application" ${extraAttrs}>
  <div class="dads-u-visually-hidden"><h2 data-js-calendar-heading aria-live="polite"></h2></div>
  <div class="dads-calendar__controls">
    <span class="dads-select">
      <span class="dads-select__control">
        <select class="dads-select__select" data-size="sm" aria-label="年" data-js-year-select></select>
      </span>
    </span>
    <div class="dads-calendar__navigation">
      <button class="dads-button" data-size="sm" data-type="outline" data-js-prev-month-button>
        <svg width="16" height="16" viewBox="0 0 16 16" role="img" aria-label="前の月">
          <path d="m5.27 8 5.33-5.33-.93-.94L3.4 8l6.27 6.27.93-.94L5.27 8Z" fill="currentcolor" />
        </svg>
      </button>
      <p class="dads-calendar__current-month" data-js-current-month></p>
      <button class="dads-button" data-size="sm" data-type="outline" data-js-next-month-button>
        <svg width="16" height="16" viewBox="0 0 16 16" role="img" aria-label="次の月">
          <path d="m6 1.73-.93.94L10.4 8l-5.33 5.33.93.94L12.27 8 6 1.73Z" fill="currentcolor" />
        </svg>
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
  </div>
</dads-calendar>`;

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
 * カレンダーをDOMにマウントして返す。
 * @param {{ minDate?: string, maxDate?: string }} options
 */
const mountCalendar = (options = {}) => {
  const attrs = [];
  if (options.minDate) attrs.push(`min-date="${options.minDate}"`);
  if (options.maxDate) attrs.push(`max-date="${options.maxDate}"`);
  document.body.innerHTML = calendarHTML(attrs.join(" "));
  return document.querySelector("dads-calendar");
};

// ---------------------------------------------------------------------------
// DOM helpers
// ---------------------------------------------------------------------------

const enabledButtons = () => [
  ...document.querySelectorAll("[data-js-date-button]:not(:disabled)"),
];

const allButtons = () => [
  ...document.querySelectorAll("[data-js-date-button]"),
];

/** 当月の enabled ボタンから指定日のものを返す */
const buttonFor = (day) =>
  enabledButtons().find((b) => b.textContent === String(day));

const selectedButton = () => document.querySelector('[data-selected="true"]');

const currentMonth = () =>
  document.querySelector("[data-js-current-month]").textContent;

const yearSelect = () => document.querySelector("[data-js-year-select]");

const cal = () => document.querySelector("dads-calendar");

const liveHeading = () => document.querySelector("[data-js-calendar-heading]");

/** tabindex="0" の日付ボタン一覧 */
const focusableButtons = () => [
  ...document.querySelectorAll('[data-js-date-button][tabindex="0"]'),
];

const changeYear = (year) => {
  const select = yearSelect();
  select.value = String(year);
  select.dispatchEvent(new Event("change", { bubbles: true }));
};

const gridRows = () => [
  ...document.querySelectorAll("[data-js-calendar-tbody] tr"),
];

// ===========================================================================
// Tests
// ===========================================================================

describe("Calendar", () => {
  // -------------------------------------------------------------------------
  // 初期表示
  // -------------------------------------------------------------------------
  describe("初期表示", () => {
    test("今日を含む月が表示される", async () => {
      mountCalendar({ minDate: "2025-01-01", maxDate: "2025-12-31" });
      expect(currentMonth()).toBe("6月");
      expect(yearSelect().value).toBe("2025");
    });

    test("min-date/max-date 未指定時、前後1年が範囲になる", async () => {
      mountCalendar();
      const options = [...yearSelect().querySelectorAll("option")];
      // today=2025-06-15 → min=2024-06-15, max=2026-06-15
      expect(options[0].value).toBe("2024");
      expect(options[options.length - 1].value).toBe("2026");
    });

    test("今日が範囲より前の場合、範囲の最初の月が表示される", async () => {
      // today=2025-06-15, range starts 2025-09
      mountCalendar({ minDate: "2025-09-01", maxDate: "2026-03-31" });
      expect(currentMonth()).toBe("9月");
      expect(yearSelect().value).toBe("2025");
    });

    test("今日が範囲より後の場合、範囲の最後の月が表示される", async () => {
      mountCalendar({ minDate: "2024-01-01", maxDate: "2025-03-31" });
      expect(currentMonth()).toBe("3月");
      expect(yearSelect().value).toBe("2025");
    });
  });

  // -------------------------------------------------------------------------
  // カレンダーグリッドの描画
  // -------------------------------------------------------------------------
  describe("カレンダーグリッドの描画", () => {
    test("当月の日数分の enabled ボタンが表示される（6月=30日）", async () => {
      mountCalendar({ minDate: "2025-01-01", maxDate: "2025-12-31" });
      expect(enabledButtons()).toHaveLength(30);
    });

    test("当月以外の日付は disabled になる", async () => {
      mountCalendar({ minDate: "2025-01-01", maxDate: "2025-12-31" });
      // June 1 is Sunday → no padding at start
      // June 30 is Monday → 5 days of padding (Jul 1-5)
      const disabled = allButtons().filter((b) => b.disabled);
      expect(disabled).toHaveLength(5);
    });

    test("範囲外の当月日付は disabled になる", async () => {
      mountCalendar({ minDate: "2025-06-10", maxDate: "2025-06-20" });
      const enabled = enabledButtons();
      expect(enabled).toHaveLength(11); // 10〜20
      expect(enabled[0].textContent).toBe("10");
      expect(enabled[enabled.length - 1].textContent).toBe("20");
    });

    test("週は日曜始まりで表示される", async () => {
      mountCalendar({ minDate: "2025-01-01", maxDate: "2025-12-31" });
      const headers = [...document.querySelectorAll("th")];
      expect(headers.map((h) => h.textContent)).toEqual([
        "日",
        "月",
        "火",
        "水",
        "木",
        "金",
        "土",
      ]);
    });

    test("月の最終日を含む週で描画が終了する（6月=5週）", async () => {
      mountCalendar({ minDate: "2025-01-01", maxDate: "2025-12-31" });
      expect(gridRows()).toHaveLength(5);
    });

    test("6週間必要な月は6行表示される（3月: 1日が土曜）", async () => {
      mountCalendar({ minDate: "2025-01-01", maxDate: "2025-12-31" });
      cal().setDisplayMonth(2025, 2); // March
      expect(gridRows()).toHaveLength(6);
    });

    test("うるう年の2月は29日表示される", async () => {
      mountCalendar({ minDate: "2024-01-01", maxDate: "2024-12-31" });
      cal().setDisplayMonth(2024, 1); // Feb 2024
      expect(enabledButtons()).toHaveLength(29);
    });
  });

  // -------------------------------------------------------------------------
  // 日付選択
  // -------------------------------------------------------------------------
  describe("日付選択", () => {
    test("クリックで日付が選択される", async () => {
      mountCalendar({ minDate: "2025-01-01", maxDate: "2025-12-31" });
      await userEvent.click(buttonFor(15));

      expect(selectedButton()).not.toBeNull();
      expect(selectedButton().textContent).toBe("15");
    });

    test("選択した日付のセルに aria-selected='true' が設定される", async () => {
      mountCalendar({ minDate: "2025-01-01", maxDate: "2025-12-31" });
      await userEvent.click(buttonFor(15));

      const cell = selectedButton().closest("td");
      expect(cell.getAttribute("aria-selected")).toBe("true");
    });

    test("選択した日付の aria-label に「選択中」が含まれる", async () => {
      mountCalendar({ minDate: "2025-01-01", maxDate: "2025-12-31" });
      await userEvent.click(buttonFor(15));

      expect(selectedButton().getAttribute("aria-label")).toMatch(/^選択中/);
    });

    test("date-selected イベントが正しい日付を detail に含む", async () => {
      mountCalendar({ minDate: "2025-01-01", maxDate: "2025-12-31" });
      const handler = vi.fn();
      cal().addEventListener("date-selected", handler);

      await userEvent.click(buttonFor(20));

      expect(handler).toHaveBeenCalledOnce();
      const date = handler.mock.calls[0][0].detail.date;
      expect(date.getFullYear()).toBe(2025);
      expect(date.getMonth()).toBe(5);
      expect(date.getDate()).toBe(20);
    });

    test("date-selected イベントが bubbles する", async () => {
      mountCalendar({ minDate: "2025-01-01", maxDate: "2025-12-31" });
      const handler = vi.fn();
      document.addEventListener("date-selected", handler);

      await userEvent.click(buttonFor(20));
      expect(handler).toHaveBeenCalledOnce();

      document.removeEventListener("date-selected", handler);
    });

    test("disabled 日付をクリックしても選択されない", async () => {
      mountCalendar({ minDate: "2025-06-10", maxDate: "2025-06-20" });
      const disabledBtn = allButtons().find(
        (b) => b.disabled && b.textContent === "5",
      );
      disabledBtn.click();
      expect(selectedButton()).toBeNull();
    });

    test("別の日付を選択すると前の選択が解除される", async () => {
      mountCalendar({ minDate: "2025-01-01", maxDate: "2025-12-31" });
      await userEvent.click(buttonFor(10));
      expect(selectedButton().textContent).toBe("10");

      await userEvent.click(buttonFor(25));
      expect(selectedButton().textContent).toBe("25");
      expect(document.querySelectorAll('[data-selected="true"]')).toHaveLength(
        1,
      );
    });
  });

  // -------------------------------------------------------------------------
  // 月ナビゲーション
  // -------------------------------------------------------------------------
  describe("月ナビゲーション", () => {
    test("前月ボタンで前月に移動する", async () => {
      mountCalendar({ minDate: "2025-01-01", maxDate: "2025-12-31" });
      await page.getByRole("button", { name: "前の月" }).click();
      expect(currentMonth()).toBe("5月");
    });

    test("次月ボタンで次月に移動する", async () => {
      mountCalendar({ minDate: "2025-01-01", maxDate: "2025-12-31" });
      await page.getByRole("button", { name: "次の月" }).click();
      expect(currentMonth()).toBe("7月");
    });

    test("範囲の最初の月で前月ボタンが aria-disabled='true' になる", async () => {
      mountCalendar({ minDate: "2025-06-01", maxDate: "2025-12-31" });
      await expect
        .element(page.getByRole("button", { name: "前の月" }))
        .toHaveAttribute("aria-disabled", "true");
    });

    test("範囲の最後の月で次月ボタンが aria-disabled='true' になる", async () => {
      mountCalendar({ minDate: "2025-01-01", maxDate: "2025-06-30" });
      await expect
        .element(page.getByRole("button", { name: "次の月" }))
        .toHaveAttribute("aria-disabled", "true");
    });

    test("aria-disabled 時に前月ボタンを押しても月が変わらない", async () => {
      mountCalendar({ minDate: "2025-06-01", maxDate: "2025-12-31" });
      // Playwright の click() は disabled 要素を待機するので直接 DOM click を使用
      document.querySelector("[data-js-prev-month-button]").click();
      expect(currentMonth()).toBe("6月");
    });

    test("aria-disabled 時に次月ボタンを押しても月が変わらない", async () => {
      mountCalendar({ minDate: "2025-01-01", maxDate: "2025-06-30" });
      document.querySelector("[data-js-next-month-button]").click();
      expect(currentMonth()).toBe("6月");
    });

    test("12月→1月のナビゲーションで年が変わる", async () => {
      mountCalendar({ minDate: "2025-01-01", maxDate: "2026-12-31" });
      cal().setDisplayMonth(2025, 11); // December
      await page.getByRole("button", { name: "次の月" }).click();
      expect(currentMonth()).toBe("1月");
      expect(yearSelect().value).toBe("2026");
    });

    test("1月→12月のナビゲーションで年が変わる", async () => {
      mountCalendar({ minDate: "2025-01-01", maxDate: "2026-12-31" });
      cal().setDisplayMonth(2026, 0); // January 2026
      await page.getByRole("button", { name: "前の月" }).click();
      expect(currentMonth()).toBe("12月");
      expect(yearSelect().value).toBe("2025");
    });
  });

  // -------------------------------------------------------------------------
  // 年選択
  // -------------------------------------------------------------------------
  describe("年選択", () => {
    test("範囲内の年がオプションとして表示される", async () => {
      mountCalendar({ minDate: "2023-04-01", maxDate: "2026-08-31" });
      const options = [...yearSelect().querySelectorAll("option")];
      expect(options.map((o) => o.value)).toEqual([
        "2023",
        "2024",
        "2025",
        "2026",
      ]);
    });

    test("各年オプションに和暦が表示される", async () => {
      mountCalendar({ minDate: "2025-01-01", maxDate: "2025-12-31" });
      const option = yearSelect().querySelector("option");
      expect(option.textContent).toBe("2025年(令和7年)");
    });

    test("年を変更すると表示が更新される", async () => {
      mountCalendar({ minDate: "2023-01-01", maxDate: "2025-12-31" });
      changeYear(2023);
      expect(yearSelect().value).toBe("2023");
      expect(enabledButtons()[0].dataset.year).toBe("2023");
    });

    test("min-date と max-date が同じ年の場合、1つだけ表示される", async () => {
      mountCalendar({ minDate: "2025-03-01", maxDate: "2025-09-30" });
      const options = [...yearSelect().querySelectorAll("option")];
      expect(options).toHaveLength(1);
      expect(options[0].value).toBe("2025");
    });
  });

  // -------------------------------------------------------------------------
  // キーボードナビゲーション
  // -------------------------------------------------------------------------
  describe("キーボードナビゲーション", () => {
    test("ArrowRight で翌日にフォーカスが移動する", async () => {
      mountCalendar({ minDate: "2025-01-01", maxDate: "2025-12-31" });
      await userEvent.click(buttonFor(15));
      selectedButton().focus();
      await userEvent.keyboard("{ArrowRight}");
      expect(document.activeElement.textContent).toBe("16");
    });

    test("ArrowLeft で前日にフォーカスが移動する", async () => {
      mountCalendar({ minDate: "2025-01-01", maxDate: "2025-12-31" });
      await userEvent.click(buttonFor(15));
      selectedButton().focus();
      await userEvent.keyboard("{ArrowLeft}");
      expect(document.activeElement.textContent).toBe("14");
    });

    test("ArrowDown で翌週（+7日）にフォーカスが移動する", async () => {
      mountCalendar({ minDate: "2025-01-01", maxDate: "2025-12-31" });
      await userEvent.click(buttonFor(15));
      selectedButton().focus();
      await userEvent.keyboard("{ArrowDown}");
      expect(document.activeElement.textContent).toBe("22");
    });

    test("ArrowUp で前週（-7日）にフォーカスが移動する", async () => {
      mountCalendar({ minDate: "2025-01-01", maxDate: "2025-12-31" });
      await userEvent.click(buttonFor(15));
      selectedButton().focus();
      await userEvent.keyboard("{ArrowUp}");
      expect(document.activeElement.textContent).toBe("8");
    });

    test("月末で ArrowRight を押すと翌月1日に移動する", async () => {
      mountCalendar({ minDate: "2025-01-01", maxDate: "2025-12-31" });
      await userEvent.click(buttonFor(30)); // June 30
      selectedButton().focus();
      await userEvent.keyboard("{ArrowRight}");
      expect(currentMonth()).toBe("7月");
      expect(document.activeElement.textContent).toBe("1");
    });

    test("月初で ArrowLeft を押すと前月末日に移動する", async () => {
      mountCalendar({ minDate: "2025-01-01", maxDate: "2025-12-31" });
      await userEvent.click(buttonFor(1)); // June 1
      selectedButton().focus();
      await userEvent.keyboard("{ArrowLeft}");
      expect(currentMonth()).toBe("5月");
      expect(document.activeElement.textContent).toBe("31");
    });

    test("範囲の最終日を超えるナビゲーションは無視される", async () => {
      mountCalendar({ minDate: "2025-06-01", maxDate: "2025-06-20" });
      await userEvent.click(buttonFor(20));
      selectedButton().focus();
      await userEvent.keyboard("{ArrowRight}");
      expect(document.activeElement.textContent).toBe("20");
    });

    test("範囲の最初日を超えるナビゲーションは無視される", async () => {
      mountCalendar({ minDate: "2025-06-10", maxDate: "2025-06-30" });
      await userEvent.click(buttonFor(10));
      selectedButton().focus();
      await userEvent.keyboard("{ArrowLeft}");
      expect(document.activeElement.textContent).toBe("10");
    });

    test("矢印キーで移動先に tabindex='0' が設定され他は '-1' になる", async () => {
      mountCalendar({ minDate: "2025-01-01", maxDate: "2025-12-31" });
      await userEvent.click(buttonFor(15));
      selectedButton().focus();
      await userEvent.keyboard("{ArrowRight}");

      expect(document.activeElement.getAttribute("tabindex")).toBe("0");
      const otherEnabled = enabledButtons().filter(
        (b) => b !== document.activeElement,
      );
      for (const b of otherEnabled) {
        expect(b.getAttribute("tabindex")).toBe("-1");
      }
    });
  });

  // -------------------------------------------------------------------------
  // 今日ボタン
  // -------------------------------------------------------------------------
  describe("今日ボタン", () => {
    test("今日の日付が選択され、今日の月に移動する", async () => {
      mountCalendar({ minDate: "2025-01-01", maxDate: "2025-12-31" });
      cal().setDisplayMonth(2025, 0); // January から開始
      await page.getByRole("button", { name: "今日" }).click();

      expect(selectedButton().textContent).toBe("15");
      expect(currentMonth()).toBe("6月");
    });

    test("今日が範囲外の場合は選択されない", async () => {
      // today=2025-06-15, range=2024
      mountCalendar({ minDate: "2024-01-01", maxDate: "2024-12-31" });
      await page.getByRole("button", { name: "今日" }).click();

      expect(selectedButton()).toBeNull();
    });

    test("date-selected イベントが今日の日付で発火する", async () => {
      mountCalendar({ minDate: "2025-01-01", maxDate: "2025-12-31" });
      const handler = vi.fn();
      cal().addEventListener("date-selected", handler);

      await page.getByRole("button", { name: "今日" }).click();

      expect(handler).toHaveBeenCalledOnce();
      const date = handler.mock.calls[0][0].detail.date;
      expect(date.getFullYear()).toBe(2025);
      expect(date.getMonth()).toBe(5);
      expect(date.getDate()).toBe(15);
    });
  });

  // -------------------------------------------------------------------------
  // 削除ボタン
  // -------------------------------------------------------------------------
  describe("削除ボタン", () => {
    test("選択日付がクリアされる", async () => {
      mountCalendar({ minDate: "2025-01-01", maxDate: "2025-12-31" });
      await userEvent.click(buttonFor(15));
      expect(selectedButton()).not.toBeNull();

      await page.getByRole("button", { name: "削除" }).click();
      expect(selectedButton()).toBeNull();
    });

    test("date-selected イベントが date: null で発火する", async () => {
      mountCalendar({ minDate: "2025-01-01", maxDate: "2025-12-31" });
      await userEvent.click(buttonFor(15));

      const handler = vi.fn();
      cal().addEventListener("date-selected", handler);
      await page.getByRole("button", { name: "削除" }).click();

      expect(handler).toHaveBeenCalledOnce();
      expect(handler.mock.calls[0][0].detail.date).toBeNull();
    });
  });

  // -------------------------------------------------------------------------
  // 外部 API
  // -------------------------------------------------------------------------
  describe("外部 API", () => {
    test("setSelectedDate で日付を選択できる", async () => {
      mountCalendar({ minDate: "2025-01-01", maxDate: "2025-12-31" });
      cal().setSelectedDate(new Date(2025, 5, 20));
      expect(selectedButton().textContent).toBe("20");
    });

    test("setSelectedDate で範囲外の日付を指定すると選択がクリアされる", async () => {
      mountCalendar({ minDate: "2025-06-01", maxDate: "2025-06-30" });
      cal().setSelectedDate(new Date(2025, 11, 25));
      expect(selectedButton()).toBeNull();
    });

    test("setSelectedDate(null) で選択をクリアできる", async () => {
      mountCalendar({ minDate: "2025-01-01", maxDate: "2025-12-31" });
      cal().setSelectedDate(new Date(2025, 5, 20));
      expect(selectedButton()).not.toBeNull();

      cal().setSelectedDate(null);
      expect(selectedButton()).toBeNull();
    });

    test("setDisplayMonth で表示月を変更できる", async () => {
      mountCalendar({ minDate: "2025-01-01", maxDate: "2025-12-31" });
      cal().setDisplayMonth(2025, 2); // March
      expect(currentMonth()).toBe("3月");
      expect(yearSelect().value).toBe("2025");
    });

    test("setDisplayMonth で範囲外を指定すると最寄りの月にクランプされる", async () => {
      mountCalendar({ minDate: "2025-03-01", maxDate: "2025-09-30" });
      cal().setDisplayMonth(2025, 0); // January → clamp to March
      expect(currentMonth()).toBe("3月");
    });

    test("setDisplayMonth で同じ月を指定しても再描画しない", async () => {
      mountCalendar({ minDate: "2025-01-01", maxDate: "2025-12-31" });
      // Already June. Setting June again should not re-render.
      // Verify by checking that selected state is preserved.
      cal().setSelectedDate(new Date(2025, 5, 20));
      cal().setDisplayMonth(2025, 5);
      expect(selectedButton().textContent).toBe("20");
    });

    test("focus でカレンダー内のフォーカス可能な日付にフォーカスする", async () => {
      mountCalendar({ minDate: "2025-01-01", maxDate: "2025-12-31" });
      cal().focus();

      expect(document.activeElement.hasAttribute("data-js-date-button")).toBe(
        true,
      );
      expect(document.activeElement.getAttribute("tabindex")).toBe("0");
    });
  });

  // -------------------------------------------------------------------------
  // 属性の動的変更
  // -------------------------------------------------------------------------
  describe("属性の動的変更", () => {
    test("min-date を動的に変更するとカレンダーが再描画される", async () => {
      mountCalendar({ minDate: "2025-01-01", maxDate: "2025-12-31" });
      expect(buttonFor(5)).not.toBeUndefined();

      cal().setAttribute("min-date", "2025-06-10");
      // June 5 is now out of range
      expect(buttonFor(5)).toBeUndefined();
      expect(buttonFor(10)).not.toBeUndefined();
    });

    test("max-date を動的に変更するとカレンダーが再描画される", async () => {
      mountCalendar({ minDate: "2025-01-01", maxDate: "2025-12-31" });
      expect(buttonFor(25)).not.toBeUndefined();

      cal().setAttribute("max-date", "2025-06-20");
      expect(buttonFor(25)).toBeUndefined();
      expect(buttonFor(20)).not.toBeUndefined();
    });
  });

  // -------------------------------------------------------------------------
  // アクセシビリティ
  // -------------------------------------------------------------------------
  describe("アクセシビリティ", () => {
    test("カレンダー要素に aria-label として年月が設定される", async () => {
      mountCalendar({ minDate: "2025-01-01", maxDate: "2025-12-31" });
      expect(cal().getAttribute("aria-label")).toBe("2025年6月");
    });

    test("grid に aria-label として年月が設定される", async () => {
      mountCalendar({ minDate: "2025-01-01", maxDate: "2025-12-31" });
      const grid = document.querySelector('[role="grid"]');
      expect(grid.getAttribute("aria-label")).toBe("2025年6月");
    });

    test("ライブリージョンに見出しが設定される", async () => {
      mountCalendar({ minDate: "2025-01-01", maxDate: "2025-12-31" });
      expect(liveHeading().textContent).toBe("2025年6月");
      expect(
        liveHeading().closest("[aria-live]").getAttribute("aria-live"),
      ).toBe("polite");
    });

    test("月が変わるとライブリージョンが更新される", async () => {
      mountCalendar({ minDate: "2025-01-01", maxDate: "2025-12-31" });
      await page.getByRole("button", { name: "次の月" }).click();
      expect(liveHeading().textContent).toBe("2025年7月");
    });

    test("各日付ボタンに日本語の aria-label が設定される", async () => {
      mountCalendar({ minDate: "2025-01-01", maxDate: "2025-12-31" });
      const btn = buttonFor(15);
      // "2025年6月15日日曜日" のようなフォーマット
      expect(btn.getAttribute("aria-label")).toMatch(/2025年6月15日.*曜日/);
    });

    test("tabindex='0' の日付ボタンが常に1つだけ存在する", async () => {
      mountCalendar({ minDate: "2025-01-01", maxDate: "2025-12-31" });
      expect(focusableButtons()).toHaveLength(1);
    });

    test("日付を選択すると選択日付に tabindex='0' が移動する", async () => {
      mountCalendar({ minDate: "2025-01-01", maxDate: "2025-12-31" });
      await userEvent.click(buttonFor(20));

      expect(focusableButtons()).toHaveLength(1);
      expect(focusableButtons()[0].textContent).toBe("20");
    });

    test("今日が表示月にあり未選択の場合、今日に tabindex='0' が設定される", async () => {
      mountCalendar({ minDate: "2025-01-01", maxDate: "2025-12-31" });
      // June displays, today=15 is present, no selection
      expect(focusableButtons()).toHaveLength(1);
      expect(focusableButtons()[0].textContent).toBe("15");
    });

    test("選択も今日もない月では最初の enabled 日付に tabindex='0' が設定される", async () => {
      mountCalendar({ minDate: "2025-01-01", maxDate: "2025-12-31" });
      cal().setDisplayMonth(2025, 0); // January (no today, no selection)

      expect(focusableButtons()).toHaveLength(1);
      expect(focusableButtons()[0].textContent).toBe("1");
    });
  });

  // -------------------------------------------------------------------------
  // エッジケース
  // -------------------------------------------------------------------------
  describe("エッジケース", () => {
    test("正規表現にマッチしない min-date はデフォルト値にフォールバックする", async () => {
      mountCalendar({ minDate: "abc" });
      const options = [...yearSelect().querySelectorAll("option")];
      expect(options[0].value).toBe("2024"); // default: 1 year before
    });

    test("正規表現にマッチしない max-date はデフォルト値にフォールバックする", async () => {
      mountCalendar({ maxDate: "xyz" });
      const options = [...yearSelect().querySelectorAll("option")];
      expect(options[options.length - 1].value).toBe("2026"); // default: 1 year after
    });

    test("min-date > max-date の場合は両方デフォルト値にフォールバックする", async () => {
      mountCalendar({
        minDate: "2025-12-31",
        maxDate: "2025-01-01",
      });
      const options = [...yearSelect().querySelectorAll("option")];
      expect(options[0].value).toBe("2024");
      expect(options[options.length - 1].value).toBe("2026");
    });

    test("DOM から削除した後に再接続しても正常に動作する", async () => {
      mountCalendar({ minDate: "2025-01-01", maxDate: "2025-12-31" });
      const calEl = cal();

      // 削除（disconnectedCallback で abort）
      calEl.remove();

      // 再接続（connectedCallback で再初期化）
      document.body.appendChild(calEl);

      await userEvent.click(buttonFor(15));
      expect(selectedButton().textContent).toBe("15");
    });

    test("DOM から削除するとイベントリスナーがクリーンアップされる", async () => {
      mountCalendar({ minDate: "2025-01-01", maxDate: "2025-12-31" });
      const calEl = cal();
      const table = document.querySelector("[data-js-calendar-table]");
      const dispatchSpy = vi.spyOn(calEl, "dispatchEvent");

      calEl.remove();

      // テーブルのクリックリスナーは abort されているので、
      // ボタンをクリックしても date-selected は発火しない
      const btn = table.querySelector("[data-js-date-button]:not(:disabled)");
      btn.click();

      expect(dispatchSpy).not.toHaveBeenCalled();
    });
  });
});
