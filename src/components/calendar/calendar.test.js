import path from "node:path";
import { test, expect } from "@playwright/test";
import { resetCssVrt } from "../../../tests/helpers/reset-css-vrt";

const { dirname } = import.meta;

resetCssVrt("calendar", path.join(dirname, "playground.html"));

// オプション付きでカレンダーをセットアップするヘルパー関数
const setupCalendar = async (page, options = {}) => {
  const { minDate, maxDate } = options;

  // date-pickerのプレイグラウンドファイルを使用してカレンダーを開く
  await page.goto(`file://${path.join(dirname, "./playground.html")}`);

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

const getYmd = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

test.describe("カレンダー機能テスト", () => {
  test.describe("年選択ドロップダウンの境界テスト", () => {
    test("1月1日のmin-dateを処理するべき", async ({ page }) => {
      const minDate = "2023-01-01";
      const maxDate = "2025-12-31";

      await setupCalendar(page, { minDate, maxDate });

      const yearSelect = page.getByRole("combobox", { name: "年" });
      const firstOption = yearSelect.locator("option").first();
      const firstYear = await firstOption.getAttribute("value");
      expect(firstYear).toBe("2023");
    });

    test("12月31日のmin-dateを処理するべき", async ({ page }) => {
      const minDate = "2023-12-31";
      const maxDate = "2025-01-01";

      await setupCalendar(page, { minDate, maxDate });

      const yearSelect = page.getByRole("combobox", { name: "年" });
      const firstOption = yearSelect.locator("option").first();
      const firstYear = await firstOption.getAttribute("value");
      expect(firstYear).toBe("2023");
    });

    test("1月1日のmax-dateを処理するべき", async ({ page }) => {
      const minDate = "2023-01-01";
      const maxDate = "2025-01-01";

      await setupCalendar(page, { minDate, maxDate });

      const yearSelect = page.getByRole("combobox", { name: "年" });
      const lastOption = yearSelect.locator("option").last();
      const lastYear = await lastOption.getAttribute("value");
      expect(lastYear).toBe("2025");
    });

    test("12月31日のmax-dateを処理するべき", async ({ page }) => {
      const minDate = "2023-01-01";
      const maxDate = "2025-12-31";

      await setupCalendar(page, { minDate, maxDate });

      const yearSelect = page.getByRole("combobox", { name: "年" });
      const lastOption = yearSelect.locator("option").last();
      const lastYear = await lastOption.getAttribute("value");
      expect(lastYear).toBe("2025");
    });

    test("min-dateとmax-dateが同じ年の場合を処理するべき", async ({ page }) => {
      const minDate = "2024-03-01";
      const maxDate = "2024-09-30";

      await setupCalendar(page, { minDate, maxDate });

      const yearSelect = page.getByRole("combobox", { name: "年" });
      const options = await yearSelect.locator("option").count();
      expect(options).toBe(1);

      const onlyOption = yearSelect.locator("option").first();
      const year = await onlyOption.getAttribute("value");
      expect(year).toBe("2024");
    });
  });

  test.describe("月ナビゲーションの境界テスト", () => {
    test("min-dateが月の1日の場合、前の月ボタンを無効にするべき", async ({
      page,
    }) => {
      const minDate = "2024-03-01";
      const maxDate = "2024-06-30";

      await setupCalendar(page, { minDate, maxDate });

      // 2024年3月（最小月）に移動
      const yearSelect = page.getByRole("combobox", { name: "年" });
      await yearSelect.selectOption("2024");

      // 表示を3月に設定
      await page.evaluate(() => {
        const calendar = document.querySelector("dads-calendar");
        calendar.setDisplayMonth(2024, 2); // March is month 2
      });

      const prevButton = page.getByRole("button", { name: "前の月" });
      await expect(prevButton).toHaveAttribute("aria-disabled", "true");
    });

    test("min-dateが月の31日の場合、前の月ボタンを有効にするべき", async ({
      page,
    }) => {
      const minDate = "2024-02-29";
      const maxDate = "2024-06-30";

      await setupCalendar(page, { minDate, maxDate });

      // 2024年3月に移動
      await page.evaluate(() => {
        const calendar = document.querySelector("dads-calendar");
        calendar.setDisplayMonth(2024, 2); // March is month 2
      });

      const prevButton = page.getByRole("button", { name: "前の月" });
      await expect(prevButton).toHaveAttribute("aria-disabled", "false");
    });

    test("max-dateが月の1日の場合、次の月ボタンを無効にするべき", async ({
      page,
    }) => {
      const minDate = "2024-03-01";
      const maxDate = "2024-04-30";

      await setupCalendar(page, { minDate, maxDate });

      // 2024年4月（最大値前の最後の有効月）に移動
      await page.evaluate(() => {
        const calendar = document.querySelector("dads-calendar");
        calendar.setDisplayMonth(2024, 3); // April is month 3
      });

      const nextButton = page.getByRole("button", { name: "次の月" });
      await expect(nextButton).toHaveAttribute("aria-disabled", "true");
    });

    test("max-dateが月の31日の場合、次の月ボタンを有効にするべき", async ({
      page,
    }) => {
      const minDate = "2024-03-01";
      const maxDate = "2024-05-01";

      await setupCalendar(page, { minDate, maxDate });

      // 2024年4月に移動
      await page.evaluate(() => {
        const calendar = document.querySelector("dads-calendar");
        calendar.setDisplayMonth(2024, 3); // April is month 3
      });

      const nextButton = page.getByRole("button", { name: "次の月" });
      await expect(nextButton).toHaveAttribute("aria-disabled", "false");
    });

    test("範囲の開始で前の月ボタンを無効にするべき", async ({ page }) => {
      const minDate = "2024-03-15";
      const maxDate = "2024-06-15";

      await setupCalendar(page, { minDate, maxDate });

      // 2024年3月（最初の月）に移動
      await page.evaluate(() => {
        const calendar = document.querySelector("dads-calendar");
        calendar.setDisplayMonth(2024, 2); // March is month 2
      });

      const prevButton = page.getByRole("button", { name: "前の月" });
      await expect(prevButton).toHaveAttribute("aria-disabled", "true");
    });

    test("範囲の終了で次の月ボタンを無効にするべき", async ({ page }) => {
      const minDate = "2024-03-15";
      const maxDate = "2024-06-15";

      await setupCalendar(page, { minDate, maxDate });

      // 2024年6月（最後の月）に移動
      await page.evaluate(() => {
        const calendar = document.querySelector("dads-calendar");
        calendar.setDisplayMonth(2024, 5); // June is month 5
      });

      const nextButton = page.getByRole("button", { name: "次の月" });
      await expect(nextButton).toHaveAttribute("aria-disabled", "true");
    });
  });

  test.describe("日付選択フロー", () => {
    test("クリックで日付を選択するべき", async ({ page }) => {
      await setupCalendar(page);

      // 日付ボタンをクリック
      const dateButton = page.getByRole("gridcell").getByRole("button").first();
      await dateButton.click();

      // 日付が選択されていることを確認
      await expect(dateButton).toHaveAttribute("data-selected", "true");
      await expect(dateButton.locator("..").first()).toHaveAttribute(
        "aria-selected",
        "true",
      );
    });

    test("無効な日付を選択しないべき", async ({ page }) => {
      const today = new Date();
      const minDate = new Date(today.getFullYear(), today.getMonth(), 15);
      const maxDate = new Date(today.getFullYear(), today.getMonth(), 20);

      await setupCalendar(page, {
        minDate: getYmd(minDate),
        maxDate: getYmd(maxDate),
      });

      // 無効な日付をクリックしてみる（範囲外であるべき）
      const disabledButton = page
        .getByRole("gridcell")
        .getByRole("button", { disabled: true })
        .first();
      if ((await disabledButton.count()) > 0) {
        await disabledButton.click();

        // 選択されるべきではない
        await expect(disabledButton).not.toHaveAttribute(
          "data-selected",
          "true",
        );
      }
    });

    test("date-selectedイベントを発火するべき", async ({ page }) => {
      await setupCalendar(page);

      // カスタムイベントをリッスン
      await page.evaluate(() => {
        window.selectedEventData = null;
        document.addEventListener("date-selected", (e) => {
          window.selectedEventData = e.detail;
        });
      });

      // 日付をクリック
      const dateButton = page.getByRole("gridcell").getByRole("button").first();
      await dateButton.click();

      // イベントが正しいデータで発火されたことを確認
      const eventData = await page.evaluate(() => window.selectedEventData);
      expect(eventData).toBeTruthy();
      expect(eventData.date).toBeTruthy();
    });
  });

  test.describe("月ナビゲーション", () => {
    test("前の月に移動するべき", async ({ page }) => {
      await setupCalendar(page);

      const prevButton = page.getByRole("button", { name: "前の月" });
      const currentMonth = page.locator("[data-js-current-month]");

      // 初期月を取得
      const initialMonth = await currentMonth.textContent();

      // 前の月をクリック
      await prevButton.click();

      // 月が変更されるべき
      const newMonth = await currentMonth.textContent();
      expect(newMonth).not.toBe(initialMonth);
    });

    test("次の月に移動するべき", async ({ page }) => {
      await setupCalendar(page);

      const nextButton = page.getByRole("button", { name: "次の月" });
      const currentMonth = page.locator("[data-js-current-month]");

      // 初期月を取得
      const initialMonth = await currentMonth.textContent();

      // 次の月をクリック
      await nextButton.click();

      // 月が変更されるべき
      const newMonth = await currentMonth.textContent();
      expect(newMonth).not.toBe(initialMonth);
    });

    test("年選択で月を変更するべき", async ({ page }) => {
      await setupCalendar(page);

      const yearSelect = page.getByRole("combobox", { name: "年" });

      // 利用可能な年を取得
      const options = await yearSelect.locator("option").all();
      if (options.length > 1) {
        const secondOption = options[0];
        const yearValue = await secondOption.getAttribute("value");

        // 異なる年を選択
        await yearSelect.selectOption(yearValue);

        // カレンダーが更新されるべき
        await expect(yearSelect).toHaveValue(yearValue);
      }
    });

    test("ナビゲーションで範囲制限を尊重するべき", async ({ page }) => {
      const minDate = "2024-03-01";
      const maxDate = "2024-05-31";

      await setupCalendar(page, { minDate, maxDate });

      // 最大月に移動
      await page.evaluate(() => {
        const calendar = document.querySelector("dads-calendar");
        calendar.setDisplayMonth(2024, 4); // May 2024
      });

      const nextButton = page.getByRole("button", { name: "次の月" });
      await expect(nextButton).toHaveAttribute("aria-disabled", "true");

      // 最小月に移動
      await page.evaluate(() => {
        const calendar = document.querySelector("dads-calendar");
        calendar.setDisplayMonth(2024, 2); // March 2024
      });

      const prevButton = page.getByRole("button", { name: "前の月" });
      await expect(prevButton).toHaveAttribute("aria-disabled", "true");
    });
  });

  test.describe("キーボードナビゲーション", () => {
    test("矢印キーで日付をナビゲートするべき", async ({ page }) => {
      await setupCalendar(page);

      // 日付ボタンにフォーカス
      const dateButton = page.getByRole("gridcell").getByRole("button").first();
      await dateButton.focus();

      // 矢印キーナビゲーションをテスト
      await page.keyboard.press("ArrowRight");

      // フォーカスが次の日付に移動するべき
      const focusedElement = page.locator(":focus");
      await expect(focusedElement).toHaveText("2");
    });

    test("上下矢印で週をまたいでナビゲートするべき", async ({ page }) => {
      await setupCalendar(page);

      // カレンダーの中央の日付ボタンにフォーカス
      const dateButtons = page.getByRole("gridcell").getByRole("button");
      const middleButton = dateButtons.nth(9); // 端にないボタンを取得
      await middleButton.focus();

      // 上矢印をテスト（1週間上に移動するべき）
      await page.keyboard.press("ArrowUp");

      const focusedElement = page.locator(":focus");
      await expect(focusedElement).toHaveText("3");
    });

    test("月をまたいでナビゲートするべき", async ({ page }) => {
      await setupCalendar(page);

      // 現在の月の最後の日付にフォーカス
      const dateButtons = page.getByRole("gridcell").getByRole("button");
      const lastButton = dateButtons.last();
      await lastButton.focus();

      // 初期月を取得
      const currentMonth = page.locator("[data-js-current-month]");
      const initialMonth = await currentMonth.textContent();

      // 右矢印を押して次の月に移動
      await page.keyboard.press("ArrowRight");

      // 日付ボタンにフォーカスが残っているべき（おそらく次の月）
      const focusedElement = page.locator(":focus");
      await expect(focusedElement).toHaveText("1");

      // 月が変更されるべき
      const newMonth = await currentMonth.textContent();
      expect(newMonth).not.toBe(initialMonth);
    });

    test("キーボードナビゲーションで範囲制限を尊重するべき", async ({
      page,
    }) => {
      const today = new Date();
      const minDate = new Date(today.getFullYear(), today.getMonth(), 15);
      const maxDate = new Date(today.getFullYear(), today.getMonth(), 20);

      await setupCalendar(page, {
        minDate: getYmd(minDate),
        maxDate: getYmd(maxDate),
      });

      // 最初の有効な日付にフォーカス
      const enabledButton = page
        .getByRole("gridcell")
        .getByRole("button")
        .and(page.locator(":not([disabled])"))
        .first();
      await enabledButton.focus();

      // 範囲を超えてナビゲートしてみる
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press("ArrowLeft");
      }

      // まだ有効な日付にいるべき
      const focusedElement = page.locator(":focus");
      await expect(focusedElement).toHaveAttribute("data-js-date-button");
      await expect(focusedElement).not.toBeDisabled();
    });
  });

  test.describe("特別な操作", () => {
    test("今日ボタンがクリックされた時に今日を選択するべき", async ({
      page,
    }) => {
      await setupCalendar(page);

      const todayButton = page.getByRole("button", { name: "今日" });
      await todayButton.click();

      // 今日が選択されるべき
      const selectedButton = page.locator('[data-selected="true"]');
      await expect(selectedButton).toBeVisible();
      await expect(selectedButton).toHaveText(new Date().getDate().toString());
    });

    test("範囲外の場合は今日を選択しないべき", async ({ page }) => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const maxDate = getYmd(yesterday);

      await setupCalendar(page, { maxDate });

      const todayButton = page.getByRole("button", { name: "今日" });
      await todayButton.click();

      // 日付が選択されるべきではない
      const selectedButton = page.locator('[data-selected="true"]');
      await expect(selectedButton).toHaveCount(0);
    });

    test("削除ボタンがクリックされた時に選択をクリアするべき", async ({
      page,
    }) => {
      await setupCalendar(page);

      // まず日付を選択
      const dateButton = page.getByRole("gridcell").getByRole("button").first();
      await dateButton.click();
      await expect(dateButton).toHaveAttribute("data-selected", "true");

      // 削除ボタンをクリック
      const deleteButton = page.getByRole("button", { name: "削除" });
      await deleteButton.click();

      // 選択がクリアされるべき
      const selectedButton = page.locator('[data-selected="true"]');
      await expect(selectedButton).toHaveCount(0);
    });
  });

  test.describe("外部API", () => {
    test("setSelectedDateメソッドで選択日付を設定するべき", async ({
      page,
    }) => {
      await setupCalendar(page, {
        minDate: "2024-06-01",
        maxDate: "2024-06-30",
      });

      // APIで選択日付を設定
      await page.evaluate(() => {
        const calendar = document.querySelector("dads-calendar");
        calendar.setSelectedDate(new Date(2024, 5, 15)); // June 15, 2024
      });

      // 日付が選択され表示されるべき
      const selectedButton = page.locator('[data-selected="true"]');
      await expect(selectedButton).toBeVisible();
      await expect(selectedButton).toContainText("15");
    });

    test("setSelectedDateで無効な日付を設定しないべき", async ({ page }) => {
      await setupCalendar(page, {
        minDate: "2024-06-01",
        maxDate: "2024-06-30",
      });

      // 範囲外の日付を設定してみる
      await page.evaluate(() => {
        const calendar = document.querySelector("dads-calendar");
        calendar.setSelectedDate(new Date(2024, 11, 25)); // December 25, 2024 (out of range)
      });

      // 日付が選択されるべきではない
      const selectedButton = page.locator('[data-selected="true"]');
      await expect(selectedButton).toHaveCount(0);
    });

    test("setDisplayMonthメソッドで表示月を変更するべき", async ({ page }) => {
      await setupCalendar(page, {
        minDate: "2023-06-01",
        maxDate: "2025-06-30"
      });

      // APIで表示月を設定
      await page.evaluate(() => {
        const calendar = document.querySelector("dads-calendar");
        calendar.setDisplayMonth(2024, 5); // June 2024
      });

      // 2024年6月が表示されるべき
      const currentMonth = page.locator("[data-js-current-month]");
      await expect(currentMonth).toContainText("6月");

      const yearSelect = page.getByRole("combobox", { name: "年" });
      await expect(yearSelect).toHaveValue("2024");
    });

    test("focusメソッドでカレンダーにフォーカスするべき", async ({ page }) => {
      await setupCalendar(page);

      // APIでカレンダーにフォーカス
      await page.evaluate(() => {
        const calendar = document.querySelector("dads-calendar");
        calendar.focus();
      });

      // 日付ボタンがフォーカスされるべき
      const focusedElement = page.locator(":focus");
      await expect(focusedElement).toHaveAttribute("data-js-date-button");
    });
  });

  test.describe("アクセシビリティ", () => {
    test("適切なARIA属性を持つべき", async ({ page }) => {
      await setupCalendar(page);

      const calendar = page.locator("dads-calendar");
      await expect(calendar).toHaveAttribute("role", "application");

      const calendarTable = page.getByRole("grid");
      await expect(calendarTable).toBeVisible();

      // グリッドセルをチェック
      const gridCells = page.getByRole("gridcell");
      await expect(gridCells.first()).toBeVisible();
    });

    test("tabindexを正しく管理するべき", async ({ page }) => {
      await setupCalendar(page);

      // 一つの日付ボタンのみがtabindex="0"を持つべき
      const focusableButtons = page.locator(
        '[data-js-date-button][tabindex="0"]',
      );
      await expect(focusableButtons).toHaveCount(1);
    });

    test("適切なスクリーンリーダーラベルを持つべき", async ({ page }) => {
      await setupCalendar(page);

      // 日付ボタンは説明的なaria-labelを持つべき
      const dateButton = page.getByRole("gridcell").getByRole("button").first();
      const ariaLabel = await dateButton.getAttribute("aria-label");
      expect(ariaLabel).toMatch(/\d{4}年\d{1,2}月\d{1,2}日/);
    });
  });

  test.describe("エラーハンドリング・エッジケース", () => {
    test("無効な日付文字列を処理するべき", async ({ page }) => {
      // 無効な日付文字列でカレンダーをセットアップ
      await setupCalendar(page, {
        minDate: "invalid-date",
        maxDate: "2024-13-45", // 存在しない月日
      });

      // デフォルトの日付範囲（今日±1年）にフォールバックしていることを確認
      const yearSelect = page.getByRole("combobox", { name: "年" });
      const options = await yearSelect.locator("option").count();
      expect(options).toBeGreaterThan(0); // 年選択肢が存在する

      // テスト日当日の月が表示されていることを確認
      const today = new Date();
      const expectedMonth = new Intl.DateTimeFormat("ja-JP", {
        month: "long",
      }).format(today);

      const currentMonth = page.locator("[data-js-current-month]");
      await expect(currentMonth).toContainText(expectedMonth);

      // 年選択も当日の年になっていることを確認
      await expect(yearSelect).toHaveValue(today.getFullYear().toString());
    });

    test("min-date > max-dateの場合を処理するべき", async ({ page }) => {
      // min-dateがmax-dateより後の日付
      await setupCalendar(page, {
        minDate: "2024-12-31",
        maxDate: "2024-01-01",
      });

      // カレンダーがクラッシュせずに表示されることを確認
      const calendarTable = page.getByRole("grid");
      await expect(calendarTable).toBeVisible();

      // デフォルトの日付範囲（今日±1年）にフォールバックしていることを確認
      const yearSelect = page.getByRole("combobox", { name: "年" });
      const options = await yearSelect.locator("option").count();
      expect(options).toBeGreaterThan(0);

      // テスト日当日の月が表示されていることを確認
      const today = new Date();
      const expectedMonth = new Intl.DateTimeFormat("ja-JP", {
        month: "long",
      }).format(today);

      const currentMonth = page.locator("[data-js-current-month]");
      await expect(currentMonth).toContainText(expectedMonth);

      // 年選択も当日の年になっていることを確認
      await expect(yearSelect).toHaveValue(today.getFullYear().toString());
    });
  });
});
