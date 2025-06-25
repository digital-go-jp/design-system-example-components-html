import path from "node:path";
import { test, expect } from "@playwright/test";
import { resetCssVrt } from "../../../tests/helpers/reset-css-vrt";

const { dirname } = import.meta;

resetCssVrt("menu-list-box", path.join(dirname, "playground.html"));

// メニューリストボックスをセットアップするヘルパー関数
const setupMenuListBox = async (page) => {
  await page.goto(`file://${path.join(dirname, "./playground.html")}`);
  return page.locator("dads-menu-list-box");
};

test.describe("メニューリストボックス機能テスト", () => {
  test.describe("メニューの開閉動作", () => {
    test("クリックでメニューを開閉するべき", async ({ page }) => {
      const menuListBox = await setupMenuListBox(page);
      const opener = menuListBox.locator(".dads-menu-list-box__opener");
      const popup = menuListBox.locator(".dads-menu-list-box__popup");

      // 初期状態ではメニューが閉じている
      await expect(opener).toHaveAttribute("aria-expanded", "false");
      await expect(popup).toBeHidden();

      // クリックでメニューを開く
      await opener.click();
      await expect(opener).toHaveAttribute("aria-expanded", "true");
      await expect(popup).toBeVisible();

      // 再度クリックでメニューを閉じる
      await opener.click();
      await expect(opener).toHaveAttribute("aria-expanded", "false");
      await expect(popup).toBeHidden();
    });

    test("外部クリックでメニューを閉じるべき", async ({ page }) => {
      const menuListBox = await setupMenuListBox(page);
      const opener = menuListBox.locator(".dads-menu-list-box__opener");
      const popup = menuListBox.locator(".dads-menu-list-box__popup");

      // メニューを開く
      await opener.click();
      await expect(popup).toBeVisible();

      // 外部をクリック
      await page.locator("body").click({ force: true });
      await expect(popup).toBeHidden();
      await expect(opener).toHaveAttribute("aria-expanded", "false");
    });

    test("Escapeキーでメニューを閉じるべき", async ({ page }) => {
      const menuListBox = await setupMenuListBox(page);
      const opener = menuListBox.locator(".dads-menu-list-box__opener");
      const popup = menuListBox.locator(".dads-menu-list-box__popup");

      // メニューを開く
      await opener.click();
      await expect(popup).toBeVisible();

      // Escapeキーを押す
      await page.keyboard.press("Escape");
      await expect(popup).toBeHidden();
      await expect(opener).toHaveAttribute("aria-expanded", "false");
      await expect(opener).toBeFocused();
    });
  });

  test.describe("キーボードナビゲーション - オープナー", () => {
    test("下矢印キーでメニューを開いて最初の項目にフォーカスするべき", async ({
      page,
    }) => {
      const menuListBox = await setupMenuListBox(page);
      const opener = menuListBox.locator(".dads-menu-list-box__opener");
      const popup = menuListBox.locator(".dads-menu-list-box__popup");
      const firstMenuItem = menuListBox.locator('[role="menuitem"]').first();

      await opener.focus();
      await page.keyboard.press("ArrowDown");

      await expect(popup).toBeVisible();
      await expect(opener).toHaveAttribute("aria-expanded", "true");
      await expect(firstMenuItem).toBeFocused();
      await expect(firstMenuItem).toHaveAttribute("tabindex", "0");
    });

    test("上矢印キーでメニューを開いて最後の項目にフォーカスするべき", async ({
      page,
    }) => {
      const menuListBox = await setupMenuListBox(page);
      const opener = menuListBox.locator(".dads-menu-list-box__opener");
      const popup = menuListBox.locator(".dads-menu-list-box__popup");
      const lastMenuItem = menuListBox.locator('[role="menuitem"]').last();

      await opener.focus();
      await page.keyboard.press("ArrowUp");

      await expect(popup).toBeVisible();
      await expect(opener).toHaveAttribute("aria-expanded", "true");
      await expect(lastMenuItem).toBeFocused();
      await expect(lastMenuItem).toHaveAttribute("tabindex", "0");
    });

    test("Enterキーでメニューを開いて最初の項目にフォーカスするべき", async ({
      page,
    }) => {
      const menuListBox = await setupMenuListBox(page);
      const opener = menuListBox.locator(".dads-menu-list-box__opener");
      const popup = menuListBox.locator(".dads-menu-list-box__popup");
      const firstMenuItem = menuListBox.locator('[role="menuitem"]').first();

      await opener.focus();
      await page.keyboard.press("Enter");

      await expect(popup).toBeVisible();
      await expect(opener).toHaveAttribute("aria-expanded", "true");
      await expect(firstMenuItem).toBeFocused();
    });

    test("Spaceキーでメニューを開いて最初の項目にフォーカスするべき", async ({
      page,
    }) => {
      const menuListBox = await setupMenuListBox(page);
      const opener = menuListBox.locator(".dads-menu-list-box__opener");
      const popup = menuListBox.locator(".dads-menu-list-box__popup");
      const firstMenuItem = menuListBox.locator('[role="menuitem"]').first();

      await opener.focus();
      await page.keyboard.press("Space");

      await expect(popup).toBeVisible();
      await expect(opener).toHaveAttribute("aria-expanded", "true");
      await expect(firstMenuItem).toBeFocused();
    });
  });

  test.describe("キーボードナビゲーション - メニュー内", () => {
    test("下矢印キーで次の項目にフォーカスするべき", async ({ page }) => {
      const menuListBox = await setupMenuListBox(page);
      const opener = menuListBox.locator(".dads-menu-list-box__opener");
      const menuItems = menuListBox.locator('[role="menuitem"]');
      const firstMenuItem = menuItems.first();
      const secondMenuItem = menuItems.nth(1);

      // メニューを開いて最初の項目にフォーカス
      await opener.click();
      await expect(firstMenuItem).toBeFocused();

      // 下矢印で次の項目へ
      await page.keyboard.press("ArrowDown");
      await expect(secondMenuItem).toBeFocused();
      await expect(secondMenuItem).toHaveAttribute("tabindex", "0");
      await expect(firstMenuItem).toHaveAttribute("tabindex", "-1");
    });

    test("上矢印キーで前の項目にフォーカスするべき", async ({ page }) => {
      const menuListBox = await setupMenuListBox(page);
      const opener = menuListBox.locator(".dads-menu-list-box__opener");
      const menuItems = menuListBox.locator('[role="menuitem"]');
      const firstMenuItem = menuItems.first();
      const secondMenuItem = menuItems.nth(1);

      // メニューを開いて最初の項目にフォーカス
      await opener.click();
      await page.keyboard.press("ArrowDown"); // 2番目の項目へ
      await expect(secondMenuItem).toBeFocused();

      // 上矢印で前の項目へ
      await page.keyboard.press("ArrowUp");
      await expect(firstMenuItem).toBeFocused();
      await expect(firstMenuItem).toHaveAttribute("tabindex", "0");
      await expect(secondMenuItem).toHaveAttribute("tabindex", "-1");
    });

    test("矢印キーでメニュー項目を循環するべき", async ({ page }) => {
      const menuListBox = await setupMenuListBox(page);
      const opener = menuListBox.locator(".dads-menu-list-box__opener");
      const menuItems = menuListBox.locator('[role="menuitem"]');
      const firstMenuItem = menuItems.first();
      const lastMenuItem = menuItems.last();

      // メニューを開く
      await opener.click();

      // 最初の項目から上矢印で最後の項目へ循環
      await page.keyboard.press("ArrowUp");
      await expect(lastMenuItem).toBeFocused();

      // 最後の項目から下矢印で最初の項目へ循環
      await page.keyboard.press("ArrowDown");
      await expect(firstMenuItem).toBeFocused();
    });

    test("Home/Endキーで最初/最後の項目にフォーカスするべき", async ({
      page,
    }) => {
      const menuListBox = await setupMenuListBox(page);
      const opener = menuListBox.locator(".dads-menu-list-box__opener");
      const menuItems = menuListBox.locator('[role="menuitem"]');
      const firstMenuItem = menuItems.first();
      const lastMenuItem = menuItems.last();

      // メニューを開く
      await opener.click();

      // Endキーで最後の項目へ
      await page.keyboard.press("End");
      await expect(lastMenuItem).toBeFocused();

      // Homeキーで最初の項目へ
      await page.keyboard.press("Home");
      await expect(firstMenuItem).toBeFocused();
    });

    test("Tabキーでメニュー外にフォーカスが移動するとメニューを閉じるべき", async ({
      page,
    }) => {
      const menuListBox = await setupMenuListBox(page);
      const opener = menuListBox.locator(".dads-menu-list-box__opener");
      const popup = menuListBox.locator(".dads-menu-list-box__popup");

      // メニューを開く
      await opener.click();
      await expect(popup).toBeVisible();

      // Tabキーを押してメニュー外にフォーカスを移動
      await page.keyboard.press("Tab");
      await expect(popup).toBeHidden();
      await expect(opener).toHaveAttribute("aria-expanded", "false");
    });
  });

  test.describe("メニューアイテムの操作", () => {
    test("クリックでメニューアイテムを選択してメニューを閉じるべき", async ({
      page,
    }) => {
      const menuListBox = await setupMenuListBox(page);
      const opener = menuListBox.locator(".dads-menu-list-box__opener");
      const popup = menuListBox.locator(".dads-menu-list-box__popup");
      const secondMenuItem = menuListBox.locator('[role="menuitem"]').nth(1);

      // カスタムイベントをリッスン
      await page.evaluate(() => {
        window.selectedEventData = null;
        document.addEventListener("menuitemselect", (e) => {
          window.selectedEventData = e.detail;
        });
      });

      // メニューを開いてアイテムをクリック
      await opener.click();
      await secondMenuItem.click();

      // メニューが閉じられ、イベントが発火されることを確認
      await expect(popup).toBeHidden();
      await expect(opener).toHaveAttribute("aria-expanded", "false");
      await expect(opener).toBeFocused();

      const eventData = await page.evaluate(() => window.selectedEventData);
      expect(eventData).toBeTruthy();
      expect(eventData.selectedValue).toBe("メニュー項目2");
      expect(eventData.selectedIndex).toBe(1);
    });

    test("Enterキーでメニューアイテムを選択するべき", async ({ page }) => {
      const menuListBox = await setupMenuListBox(page);
      const opener = menuListBox.locator(".dads-menu-list-box__opener");
      const popup = menuListBox.locator(".dads-menu-list-box__popup");

      // カスタムイベントをリッスン
      await page.evaluate(() => {
        window.selectedEventData = null;
        document.addEventListener("menuitemselect", (e) => {
          window.selectedEventData = e.detail;
        });
      });

      // メニューを開いて2番目の項目にフォーカスしてEnterキー
      await opener.click();
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("Enter");

      // メニューが閉じられ、イベントが発火されることを確認
      await expect(popup).toBeHidden();
      await expect(opener).toHaveAttribute("aria-expanded", "false");
      await expect(opener).toBeFocused();

      const eventData = await page.evaluate(() => window.selectedEventData);
      expect(eventData).toBeTruthy();
      expect(eventData.selectedValue).toBe("メニュー項目2");
    });

    test("Spaceキーでメニューアイテムを選択するべき", async ({ page }) => {
      const menuListBox = await setupMenuListBox(page);
      const opener = menuListBox.locator(".dads-menu-list-box__opener");
      const popup = menuListBox.locator(".dads-menu-list-box__popup");

      // メニューを開いて最初の項目でSpaceキー
      await opener.click();
      await page.keyboard.press("Space");

      // メニューが閉じられることを確認
      await expect(popup).toBeHidden();
      await expect(opener).toHaveAttribute("aria-expanded", "false");
      await expect(opener).toBeFocused();
    });
  });
});
