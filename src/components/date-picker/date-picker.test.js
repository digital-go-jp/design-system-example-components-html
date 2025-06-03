import path from "node:path";
import { test, expect } from "@playwright/test";
import { resetCssVrt } from "../../../tests/helpers/reset-css-vrt";

const { dirname } = import.meta;

resetCssVrt(
  "date-picker-consolidated",
  path.join(dirname, "playground-consolidated.html"),
);
resetCssVrt(
  "date-picker-separated",
  path.join(dirname, "playground-separated.html"),
);

// オプション付きでデートピッカーをセットアップするヘルパー関数
const setupDatePicker = async (page, type = "consolidated", options = {}) => {
  const { minDate, maxDate } = options;
  const fileName =
    type === "consolidated"
      ? "playground-consolidated.html"
      : "playground-separated.html";

  await page.goto(`file://${path.join(dirname, fileName)}`);

  // 提供されている場合はmin-dateとmax-date属性を設定
  if (minDate || maxDate) {
    await page.evaluate(
      (attrs) => {
        const calendar = document.querySelector("dads-calendar");
        if (attrs.minDate) calendar.setAttribute("min-date", attrs.minDate);
        if (attrs.maxDate) calendar.setAttribute("max-date", attrs.maxDate);
      },
      { minDate, maxDate },
    );
  }
};

// 機能テスト
test.describe("DatePicker 機能テスト", () => {
  test.describe("基本的な初期化とライフサイクル", () => {
    test("適切に初期化されるべき", async ({ page }) => {
      await setupDatePicker(page, "consolidated");

      const datePicker = page.locator("dads-date-picker");
      await expect(datePicker).toBeVisible();

      const yearInput = page.getByRole("textbox", { name: "年" });
      const monthInput = page.getByRole("textbox", { name: "月" });
      const dayInput = page.getByRole("textbox", { name: "日" });
      const calendarButton = page.getByRole("button", { name: /カレンダー/ });

      await expect(yearInput).toBeVisible();
      await expect(monthInput).toBeVisible();
      await expect(dayInput).toBeVisible();
      await expect(calendarButton).toBeVisible();
      await expect(calendarButton).toHaveAttribute("aria-expanded", "false");
    });
  });

  test.describe("Consolidatedタイプのキーボードナビゲーション", () => {
    test("右矢印キーで前方にナビゲートするべき", async ({ page }) => {
      await setupDatePicker(page, "consolidated");

      const yearInput = page.getByRole("textbox", { name: "年" });
      const monthInput = page.getByRole("textbox", { name: "月" });
      const dayInput = page.getByRole("textbox", { name: "日" });

      // 年入力にフォーカスして末尾に移動
      await yearInput.focus();
      await yearInput.fill("2024");
      await page.keyboard.press("End");

      // 右矢印で月入力に移動するべき
      await page.keyboard.press("ArrowRight");
      await expect(monthInput).toBeFocused();

      // 月を入力して末尾に移動
      await monthInput.fill("12");
      await page.keyboard.press("End");

      // 右矢印で日入力に移動するべき
      await page.keyboard.press("ArrowRight");
      await expect(dayInput).toBeFocused();
    });

    test("左矢印キーで後方にナビゲートするべき", async ({ page }) => {
      await setupDatePicker(page, "consolidated");

      const yearInput = page.getByRole("textbox", { name: "年" });
      const monthInput = page.getByRole("textbox", { name: "月" });
      const dayInput = page.getByRole("textbox", { name: "日" });

      // 日入力にフォーカスして先頭に移動
      await dayInput.focus();
      await dayInput.fill("15");
      await page.keyboard.press("Home");

      // 左矢印で月入力に移動するべき
      await page.keyboard.press("ArrowLeft");
      await expect(monthInput).toBeFocused();

      // 月を入力して先頭に移動
      await monthInput.fill("12");
      await page.keyboard.press("Home");

      // 左矢印で年入力に移動するべき
      await page.keyboard.press("ArrowLeft");
      await expect(yearInput).toBeFocused();
    });

    test("カーソルが入力の中央にある時はナビゲートしないべき", async ({
      page,
    }) => {
      await setupDatePicker(page, "consolidated");

      const yearInput = page.getByRole("textbox", { name: "年" });

      await yearInput.focus();
      await yearInput.fill("2024");

      // カーソルを中央に移動
      await page.keyboard.press("Home");
      await page.keyboard.press("ArrowRight");
      await page.keyboard.press("ArrowRight");

      // 右矢印はカーソルを移動するべきで、フォーカスは移動しない
      await page.keyboard.press("ArrowRight");
      await expect(yearInput).toBeFocused();
    });
  });

  test.describe("Separatedタイプの動作", () => {
    test("キーボードナビゲーションを持たないべき", async ({ page }) => {
      await setupDatePicker(page, "separated");

      const yearInput = page.getByRole("textbox", { name: "年" });
      const monthInput = page.getByRole("textbox", { name: "月" });

      await yearInput.focus();
      await yearInput.fill("2024");
      await page.keyboard.press("End");

      // separatedタイプでは右矢印で月入力に移動するべきではない
      await page.keyboard.press("ArrowRight");
      await expect(yearInput).toBeFocused();
    });
  });

  test.describe("カレンダーを開く", () => {
    test("ボタンクリックでカレンダーを切り替えるべき", async ({ page }) => {
      await setupDatePicker(page, "consolidated");

      const calendarButton = page.getByRole("button", { name: /カレンダー/ });
      const calendarDialog = page.getByRole("dialog", { name: "カレンダー" });

      // 初期状態では閉じている
      await expect(calendarButton).toHaveAttribute("aria-expanded", "false");
      await expect(calendarDialog).not.toBeVisible();

      // クリックして開く
      await calendarButton.click();
      await expect(calendarButton).toHaveAttribute("aria-expanded", "true");
      await expect(calendarDialog).toBeVisible();
    });

    test("背景クリックでカレンダーを閉じるべき", async ({ page }) => {
      await setupDatePicker(page, "consolidated");

      const calendarButton = page.getByRole("button", { name: /カレンダー/ });
      const calendarDialog = page.getByRole("dialog", { name: "カレンダー" });
      const backdrop = page.locator("[data-js-backdrop]");

      // カレンダーを開く
      await calendarButton.click();
      await expect(calendarDialog).toBeVisible();

      // 背景をクリックして閉じる
      await backdrop.click();
      await expect(calendarDialog).not.toBeVisible();
      await expect(calendarButton).toHaveAttribute("aria-expanded", "false");
      await expect(calendarButton).toBeFocused();
    });

    test("Escapeキーでカレンダーを閉じるべき", async ({ page }) => {
      await setupDatePicker(page, "consolidated");

      const calendarButton = page.getByRole("button", { name: /カレンダー/ });
      const calendarDialog = page.getByRole("dialog", { name: "カレンダー" });

      // カレンダーを開く
      await calendarButton.click();
      await expect(calendarDialog).toBeVisible();

      // Escapeキーを押して閉じる
      await page.keyboard.press("Escape");
      await expect(calendarDialog).not.toBeVisible();
      await expect(calendarButton).toHaveAttribute("aria-expanded", "false");
      await expect(calendarButton).toBeFocused();
    });
  });

  test.describe("日付選択シナリオ", () => {
    test("選択した日付を入力フィールドに同期するべき", async ({ page }) => {
      await setupDatePicker(page, "consolidated");

      const calendarButton = page.getByRole("button", { name: /カレンダー/ });
      const yearInput = page.getByRole("textbox", { name: "年" });
      const monthInput = page.getByRole("textbox", { name: "月" });
      const dayInput = page.getByRole("textbox", { name: "日" });

      // カレンダーを開く
      await calendarButton.click();

      // カレンダーの準備ができるまで待って日付をクリック
      const dateButton = page.getByRole("gridcell").getByRole("button").first();
      await dateButton.click();

      // 入力フィールドが適切な形式で埋められていることを確認
      const yearValue = await yearInput.inputValue();
      const monthValue = await monthInput.inputValue();
      const dayValue = await dayInput.inputValue();

      expect(yearValue).toMatch(/^\d{4}$/);
      expect(monthValue).toMatch(/^\d{2}$/);
      expect(dayValue).toMatch(/^\d{2}$/);

      // カレンダーが閉じられるべき
      const calendarDialog = page.getByRole("dialog", { name: "カレンダー" });
      await expect(calendarDialog).not.toBeVisible();
    });
  });

  test.describe("フォーカストラップ", () => {
    test("Tabキーでフォーカスをトラップするべき", async ({ page }) => {
      await setupDatePicker(page, "consolidated");

      const calendarButton = page.getByRole("button", { name: /カレンダー/ });

      // カレンダーを開く
      await calendarButton.click();

      // カレンダー内のフォーカス可能な要素を取得
      const yearSelect = page.getByRole("combobox", { name: "年" });
      const deleteButton = page.getByRole("button", { name: "削除" });
      const todayButton = page.getByRole("button", { name: "今日" });

      // Tabキーでフォーカス可能な要素を循環するべき
      await page.keyboard.press("Tab");
      await expect(deleteButton).toBeFocused();

      await page.keyboard.press("Tab");
      await expect(todayButton).toBeFocused();

      await page.keyboard.press("Tab");
      await expect(yearSelect).toBeFocused();
      // Tabキーで最後のフォーカス可能な要素に戻るべき
      await page.keyboard.press("Shift+Tab");
      await expect(todayButton).toBeFocused();
    });
  });

  test.describe("DatePickerとCalendarの統合", () => {
    test("年と月が入力された時に正しい月を表示するべき", async ({ page }) => {
      await setupDatePicker(page, "consolidated", {
        minDate: "2025-01-01",
        maxDate: "2025-12-31",
      });

      const yearInput = page.getByRole("textbox", { name: "年" });
      const monthInput = page.getByRole("textbox", { name: "月" });
      const calendarButton = page.getByRole("button", { name: /カレンダー/ });

      // 年と月を入力
      await yearInput.fill("2025");
      await monthInput.fill("03");

      // カレンダーを開く
      await calendarButton.click();

      // 2025年3月が表示されていることを確認
      const currentMonth = page.locator("[data-js-current-month]");
      await expect(currentMonth).toContainText("3月");

      const yearSelect = page.getByRole("combobox", { name: "年" });
      await expect(yearSelect).toHaveValue("2025");
    });

    test("範囲外の日付が入力された時に最も近い有効な月を表示するべき", async ({
      page,
    }) => {
      await setupDatePicker(page, "consolidated", {
        minDate: "2025-01-01",
        maxDate: "2025-12-31",
      });

      const yearInput = page.getByRole("textbox", { name: "年" });
      const monthInput = page.getByRole("textbox", { name: "月" });
      const calendarButton = page.getByRole("button", { name: /カレンダー/ });

      // 範囲外の日付を入力（遠い未来）
      await yearInput.fill("2030");
      await monthInput.fill("12");

      // カレンダーを開く
      await calendarButton.click();

      // 2025年12月が表示されていることを確認
      const currentMonth = page.locator("[data-js-current-month]");
      await expect(currentMonth).toContainText("12月");

      const yearSelect = page.getByRole("combobox", { name: "年" });
      const yearValue = await yearSelect.inputValue();
      expect(Number.parseInt(yearValue)).toBe(2025);
    });

    test("日付が入力されていない時に現在の月を表示するべき", async ({
      page,
    }) => {
      await setupDatePicker(page, "consolidated");

      const calendarButton = page.getByRole("button", { name: /カレンダー/ });

      // 日付を入力せずにカレンダーを開く
      await calendarButton.click();

      // 現在の月が表示されるべき
      const today = new Date();
      const currentMonth = page.locator("[data-js-current-month]");
      await expect(currentMonth).toContainText(`${today.getMonth() + 1}月`);

      const yearSelect = page.getByRole("combobox", { name: "年" });
      const yearValue = await yearSelect.inputValue();
      expect(Number.parseInt(yearValue)).toBe(today.getFullYear());
    });
  });
});
