import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import "./menu-list-box.js";

// ---------------------------------------------------------------------------
// HTML テンプレート
// ---------------------------------------------------------------------------
const MENU_HTML = `
<dads-menu-list-box class="dads-menu-list-box">
  <button id="opener-1" class="dads-menu-list-box__opener" type="button" data-js-opener aria-controls="menu-1" aria-haspopup="menu" aria-expanded="false">
    メニュー
  </button>
  <div class="dads-menu-list-box__popup" data-js-popup hidden>
    <ul id="menu-1" class="dads-menu-list" data-js-menu role="menu" aria-labelledby="opener-1">
      <li role="presentation"><button class="dads-menu-list__item" type="button" role="menuitem" data-js-menu-item tabindex="-1"><span class="dads-menu-list__label">メニュー項目1</span></button></li>
      <li role="presentation"><button class="dads-menu-list__item" type="button" role="menuitem" data-js-menu-item tabindex="-1"><span class="dads-menu-list__label">メニュー項目2</span></button></li>
      <li role="presentation"><button class="dads-menu-list__item" type="button" role="menuitem" data-js-menu-item tabindex="-1"><span class="dads-menu-list__label">メニュー項目3</span></button></li>
      <li role="presentation"><button class="dads-menu-list__item" type="button" role="menuitem" data-js-menu-item tabindex="-1"><span class="dads-menu-list__label">メニュー項目4</span></button></li>
      <li role="presentation"><button class="dads-menu-list__item" type="button" role="menuitem" data-js-menu-item tabindex="-1"><span class="dads-menu-list__label">メニュー項目5</span></button></li>
      <li role="presentation"><button class="dads-menu-list__item" type="button" role="menuitem" data-js-menu-item tabindex="-1"><span class="dads-menu-list__label">メニュー項目6</span></button></li>
      <li role="presentation"><button class="dads-menu-list__item" type="button" role="menuitem" data-js-menu-item tabindex="-1"><span class="dads-menu-list__label">メニュー項目7</span></button></li>
    </ul>
  </div>
</dads-menu-list-box>
<button id="outside-btn" type="button">外部ボタン</button>
`;

// ---------------------------------------------------------------------------
// ヘルパー
// ---------------------------------------------------------------------------
function mount() {
  document.body.innerHTML = MENU_HTML;
}

const openerEl = () => document.querySelector("[data-js-opener]");
const popupEl = () => document.querySelector("[data-js-popup]");
const menuItemEls = () =>
  Array.from(document.querySelectorAll("[data-js-menu-item]"));

// ---------------------------------------------------------------------------
// テスト
// ---------------------------------------------------------------------------
describe("MenuListBox", () => {
  beforeEach(() => {
    mount();
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  // =========================================================================
  // 初期状態
  // =========================================================================
  describe("初期状態", () => {
    test("メニューが閉じている", () => {
      expect(openerEl().getAttribute("aria-expanded")).toBe("false");
      expect(popupEl().hidden).toBe(true);
    });

    test("全メニュー項目の tabindex が -1", () => {
      for (const item of menuItemEls()) {
        expect(item.getAttribute("tabindex")).toBe("-1");
      }
    });
  });

  // =========================================================================
  // メニューの開閉
  // =========================================================================
  describe("メニューの開閉", () => {
    test("クリックでメニューを開閉する", async () => {
      const opener = page.getByRole("button", { name: "メニュー" });

      await opener.click();
      expect(openerEl().getAttribute("aria-expanded")).toBe("true");
      expect(popupEl().hidden).toBe(false);

      await opener.click();
      expect(openerEl().getAttribute("aria-expanded")).toBe("false");
      expect(popupEl().hidden).toBe(true);
    });

    test("外部クリックでメニューを閉じる", async () => {
      await page.getByRole("button", { name: "メニュー" }).click();
      expect(openerEl().getAttribute("aria-expanded")).toBe("true");

      await userEvent.click(document.getElementById("outside-btn"));
      expect(openerEl().getAttribute("aria-expanded")).toBe("false");
    });

    test("Escapeキーでメニューを閉じ、オープナーにフォーカスが戻る", async () => {
      await page.getByRole("button", { name: "メニュー" }).click();
      expect(openerEl().getAttribute("aria-expanded")).toBe("true");

      await userEvent.keyboard("{Escape}");
      expect(openerEl().getAttribute("aria-expanded")).toBe("false");
      expect(document.activeElement).toBe(openerEl());
    });

    test("Tab キーでフォーカスがメニュー外に移動するとメニューが閉じる", async () => {
      await page.getByRole("button", { name: "メニュー" }).click();
      expect(openerEl().getAttribute("aria-expanded")).toBe("true");

      await userEvent.tab();
      expect(openerEl().getAttribute("aria-expanded")).toBe("false");
    });
  });

  // =========================================================================
  // キーボードナビゲーション: オープナー
  // =========================================================================
  describe("キーボードナビゲーション: オープナー", () => {
    test("ArrowDown でメニューを開き最初の項目にフォーカス", async () => {
      openerEl().focus();
      await userEvent.keyboard("{ArrowDown}");

      expect(openerEl().getAttribute("aria-expanded")).toBe("true");
      const items = menuItemEls();
      expect(document.activeElement).toBe(items[0]);
      expect(items[0].getAttribute("tabindex")).toBe("0");
    });

    test("ArrowUp でメニューを開き最後の項目にフォーカス", async () => {
      openerEl().focus();
      await userEvent.keyboard("{ArrowUp}");

      expect(openerEl().getAttribute("aria-expanded")).toBe("true");
      const items = menuItemEls();
      expect(document.activeElement).toBe(items[6]);
      expect(items[6].getAttribute("tabindex")).toBe("0");
    });

    test("Enter でメニューを開き最初の項目にフォーカス", async () => {
      openerEl().focus();
      await userEvent.keyboard("{Enter}");

      expect(openerEl().getAttribute("aria-expanded")).toBe("true");
      expect(document.activeElement).toBe(menuItemEls()[0]);
    });

    test("Space でメニューを開き最初の項目にフォーカス", async () => {
      openerEl().focus();
      await userEvent.keyboard("{ }");

      expect(openerEl().getAttribute("aria-expanded")).toBe("true");
      expect(document.activeElement).toBe(menuItemEls()[0]);
    });
  });

  // =========================================================================
  // キーボードナビゲーション: メニュー内
  // =========================================================================
  describe("キーボードナビゲーション: メニュー内", () => {
    test("ArrowDown で次の項目にフォーカスし tabindex を更新", async () => {
      await page.getByRole("button", { name: "メニュー" }).click();
      const items = menuItemEls();
      expect(document.activeElement).toBe(items[0]);

      await userEvent.keyboard("{ArrowDown}");
      expect(document.activeElement).toBe(items[1]);
      expect(items[1].getAttribute("tabindex")).toBe("0");
      expect(items[0].getAttribute("tabindex")).toBe("-1");
    });

    test("ArrowUp で前の項目にフォーカスし tabindex を更新", async () => {
      await page.getByRole("button", { name: "メニュー" }).click();
      await userEvent.keyboard("{ArrowDown}"); // items[1]

      await userEvent.keyboard("{ArrowUp}");
      const items = menuItemEls();
      expect(document.activeElement).toBe(items[0]);
      expect(items[0].getAttribute("tabindex")).toBe("0");
      expect(items[1].getAttribute("tabindex")).toBe("-1");
    });

    test("最初の項目で ArrowUp を押すと最後の項目に循環する", async () => {
      await page.getByRole("button", { name: "メニュー" }).click();
      // フォーカスは items[0]
      await userEvent.keyboard("{ArrowUp}");
      expect(document.activeElement).toBe(menuItemEls()[6]);
    });

    test("最後の項目で ArrowDown を押すと最初の項目に循環する", async () => {
      openerEl().focus();
      await userEvent.keyboard("{ArrowUp}"); // open → items[6]
      expect(document.activeElement).toBe(menuItemEls()[6]);

      await userEvent.keyboard("{ArrowDown}");
      expect(document.activeElement).toBe(menuItemEls()[0]);
    });

    test("Home で最初の項目、End で最後の項目にフォーカス", async () => {
      await page.getByRole("button", { name: "メニュー" }).click();

      await userEvent.keyboard("{End}");
      expect(document.activeElement).toBe(menuItemEls()[6]);

      await userEvent.keyboard("{Home}");
      expect(document.activeElement).toBe(menuItemEls()[0]);
    });
  });

  // =========================================================================
  // メニューアイテム選択
  // =========================================================================
  describe("メニューアイテム選択", () => {
    test("クリックでアイテムを選択しメニューを閉じイベントを発火する", async () => {
      const handler = vi.fn();
      document.addEventListener("menuitemselect", handler);

      await page.getByRole("button", { name: "メニュー" }).click();
      await page.getByRole("menuitem", { name: "メニュー項目2" }).click();

      expect(openerEl().getAttribute("aria-expanded")).toBe("false");
      expect(document.activeElement).toBe(openerEl());

      expect(handler).toHaveBeenCalledOnce();
      const detail = handler.mock.calls[0][0].detail;
      expect(detail.selectedValue).toBe("メニュー項目2");
      expect(detail.selectedIndex).toBe(1);

      document.removeEventListener("menuitemselect", handler);
    });

    test("Enter でアイテムを選択しメニューを閉じイベントを発火する", async () => {
      const handler = vi.fn();
      document.addEventListener("menuitemselect", handler);

      await page.getByRole("button", { name: "メニュー" }).click();
      await userEvent.keyboard("{ArrowDown}"); // items[1]
      await userEvent.keyboard("{Enter}");

      expect(openerEl().getAttribute("aria-expanded")).toBe("false");
      expect(document.activeElement).toBe(openerEl());

      expect(handler).toHaveBeenCalledOnce();
      expect(handler.mock.calls[0][0].detail.selectedValue).toBe(
        "メニュー項目2",
      );
      expect(handler.mock.calls[0][0].detail.selectedIndex).toBe(1);

      document.removeEventListener("menuitemselect", handler);
    });

    test("Space でアイテムを選択しメニューを閉じる", async () => {
      const handler = vi.fn();
      document.addEventListener("menuitemselect", handler);

      await page.getByRole("button", { name: "メニュー" }).click();
      expect(document.activeElement).toBe(menuItemEls()[0]);
      await userEvent.keyboard("{ }");

      expect(openerEl().getAttribute("aria-expanded")).toBe("false");
      expect(document.activeElement).toBe(openerEl());

      expect(handler).toHaveBeenCalledOnce();
      expect(handler.mock.calls[0][0].detail.selectedValue).toBe(
        "メニュー項目1",
      );
      expect(handler.mock.calls[0][0].detail.selectedIndex).toBe(0);

      document.removeEventListener("menuitemselect", handler);
    });
  });
});
