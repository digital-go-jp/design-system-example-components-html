import { afterEach, describe, expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import "./tab-aria.js";
import "./tab.js";

afterEach(() => {
  document.body.innerHTML = "";
});

// ---------------------------------------------------------------------------
// Tab（dads-tab）
// ---------------------------------------------------------------------------

const plainHTML = () => `
<h2 id="heading">商品データ</h2>
<dads-tab class="dads-tab">
  <ul class="dads-tab__list" data-js-tab-list aria-labelledby="heading">
    <li><a class="dads-tab__tab" href="#sp-a" data-js-tab aria-current="true"><span>タブA</span></a></li>
    <li><a class="dads-tab__tab" href="#sp-b" data-js-tab><span>タブB</span></a></li>
    <li><a class="dads-tab__tab" href="#sp-c" data-js-tab><span>タブC</span></a></li>
  </ul>
  <div class="dads-tab__panels">
    <div id="sp-a" class="dads-tab__panel" data-testid="パネルA"><p>パネルA</p></div>
    <div id="sp-b" class="dads-tab__panel" data-testid="パネルB"><p>パネルB</p></div>
    <div id="sp-c" class="dads-tab__panel" data-testid="パネルC"><p>パネルC</p></div>
  </div>
</dads-tab>`;

const mountPlain = () => {
  document.body.innerHTML = plainHTML();
  return document.querySelector("dads-tab");
};

const getSimplePanel = (tabLabel) =>
  page.getByTestId(`パネル${tabLabel.slice(-1)}`);

describe("Tab", () => {
  describe("初期化", () => {
    test("カスタム要素として登録されているべき", () => {
      mountPlain();
      const el = document.querySelector("dads-tab");
      expect(el.constructor.name).toBe("Tab");
    });

    test("最初のリンクがaria-current='true'になるべき", async () => {
      mountPlain();
      const linkA = page.getByRole("link", { name: "タブA" });
      const linkB = page.getByRole("link", { name: "タブB" });
      const linkC = page.getByRole("link", { name: "タブC" });
      await expect.element(linkA).toHaveAttribute("aria-current", "true");
      await expect.element(linkB).not.toHaveAttribute("aria-current");
      await expect.element(linkC).not.toHaveAttribute("aria-current");
    });

    test("最初のパネルのみ表示されるべき", async () => {
      mountPlain();
      await expect.element(getSimplePanel("タブA")).toBeVisible();
      await expect.element(getSimplePanel("タブB")).not.toBeVisible();
      await expect.element(getSimplePanel("タブC")).not.toBeVisible();
    });

    test("各パネルの先頭にvisually-hiddenな見出しが挿入されるべき", () => {
      mountPlain();
      for (const label of ["タブA", "タブB", "タブC"]) {
        const panel = getSimplePanel(label).element();
        const heading = panel.querySelector("h3");
        expect(heading).not.toBeNull();
        expect(heading.textContent).toBe(label);
        expect(heading.getAttribute("tabindex")).toBe("-1");
        expect(heading.style.position).toBe("absolute");
        // ブラウザはclipをpxで正規化するため正規化後の値で検証
        expect(heading.style.clip).toBe("rect(0px, 0px, 0px, 0px)");
      }
    });

    test("見出し要素（h2）の1レベル下の見出し（h3）が挿入されるべき", async () => {
      mountPlain();
      const heading = page.getByRole("heading", { name: "タブA", level: 3 });
      await expect.element(heading).toBeInTheDocument();
    });

    test("aria-labelledby が正しく設定されているとき正常に初期化されるべき", async () => {
      mountPlain();
      // aria-labelledbyが正しく設定されているとき、見出しが挿入されパネルが制御される
      expect(
        getSimplePanel("タブA").element().querySelector("h3"),
      ).not.toBeNull();
      await expect.element(getSimplePanel("タブA")).toBeVisible();
      await expect.element(getSimplePanel("タブB")).not.toBeVisible();
    });
  });

  describe("タブ選択", () => {
    test("リンクをクリックすると対応するパネルが表示されるべき", async () => {
      mountPlain();
      await page.getByRole("link", { name: "タブB" }).click();
      await expect.element(getSimplePanel("タブB")).toBeVisible();
      await expect.element(getSimplePanel("タブA")).not.toBeVisible();
      await expect.element(getSimplePanel("タブC")).not.toBeVisible();
    });

    test("リンクをクリックするとaria-currentが更新されるべき", async () => {
      mountPlain();
      await page.getByRole("link", { name: "タブB" }).click();
      await expect
        .element(page.getByRole("link", { name: "タブB" }))
        .toHaveAttribute("aria-current", "true");
      await expect
        .element(page.getByRole("link", { name: "タブA" }))
        .not.toHaveAttribute("aria-current");
      await expect
        .element(page.getByRole("link", { name: "タブC" }))
        .not.toHaveAttribute("aria-current");
    });

    test("リンクをクリックすると対応パネルの見出しにフォーカスが当たるべき", async () => {
      mountPlain();
      await page.getByRole("link", { name: "タブC" }).click();
      await expect
        .element(page.getByRole("heading", { name: "タブC" }))
        .toHaveFocus();
    });

    test("クリックでデフォルトのページ内リンク動作が抑制されるべき", async () => {
      mountPlain();
      const initialScrollY = window.scrollY;
      await page.getByRole("link", { name: "タブB" }).click();
      expect(window.scrollY).toBe(initialScrollY);
    });

    test("タブ選択時にtab-changeイベントが発火し、detailに正しい値が含まれるべき", async () => {
      mountPlain();
      const el = document.querySelector("dads-tab");
      const handler = vi.fn();
      el.addEventListener("tab-change", handler);

      await page.getByRole("link", { name: "タブC" }).click();

      expect(handler).toHaveBeenCalledOnce();
      const detail = handler.mock.calls[0][0].detail;
      expect(detail.selectedIndex).toBe(2);
      expect(detail.selectedTabLabel).toBe("タブC");
      expect(detail.selectedPanel).toBe(getSimplePanel("タブC").element());
    });

    test("初期化時にtab-changeイベントは発火しないべき", () => {
      const handler = vi.fn();
      document.addEventListener("tab-change", handler);
      mountPlain();
      document.removeEventListener("tab-change", handler);
      expect(handler).not.toHaveBeenCalled();
    });
  });
});

// ---------------------------------------------------------------------------
// TabAria（dads-tab-aria）
// ---------------------------------------------------------------------------

const ariaHTML = (extraAttrs = "") => `
<dads-tab-aria class="dads-tab" ${extraAttrs}>
  <div class="dads-tab__list" role="tablist">
    <a class="dads-tab__tab" href="#ep-1" role="tab" aria-selected="true"><span>タブ1</span></a>
    <a class="dads-tab__tab" href="#ep-2" role="tab" aria-selected="false"><span>タブ2</span></a>
    <a class="dads-tab__tab" href="#ep-3" role="tab" aria-selected="false"><span>タブ3</span></a>
  </div>
  <div class="dads-tab__panels">
    <div id="ep-1" class="dads-tab__panel" role="tabpanel" tabindex="0">パネル1</div>
    <div id="ep-2" class="dads-tab__panel" role="tabpanel" tabindex="0">パネル2</div>
    <div id="ep-3" class="dads-tab__panel" role="tabpanel" tabindex="0">パネル3</div>
  </div>
</dads-tab-aria>`;

const mountAria = (extraAttrs = "") => {
  document.body.innerHTML = ariaHTML(extraAttrs);
  return document.querySelector("dads-tab-aria");
};

/** ARIA版のタブをラベルで取得（DOM要素） */
const getTab = (name) => page.getByRole("tab", { name });

/** ARIA版のパネルをラベル（タブ名）で取得する。 */
const getPanel = (name) =>
  page.getByRole("tabpanel", { name, includeHidden: true });

describe("TabAria", () => {
  describe("初期化", () => {
    test("カスタム要素として登録されているべき", () => {
      mountAria();
      const el = document.querySelector("dads-tab-aria");
      expect(el.constructor.name).toBe("TabAria");
    });

    test("最初のタブがaria-selected='true'になるべき", async () => {
      mountAria();
      await expect
        .element(getTab("タブ1"))
        .toHaveAttribute("aria-selected", "true");
      await expect
        .element(getTab("タブ2"))
        .toHaveAttribute("aria-selected", "false");
      await expect
        .element(getTab("タブ3"))
        .toHaveAttribute("aria-selected", "false");
    });

    test("最初のタブのtabindexが0、他は-1になるべき", async () => {
      mountAria();
      await expect.element(getTab("タブ1")).toHaveAttribute("tabindex", "0");
      await expect.element(getTab("タブ2")).toHaveAttribute("tabindex", "-1");
      await expect.element(getTab("タブ3")).toHaveAttribute("tabindex", "-1");
    });

    test("最初のパネルのみ表示されるべき", async () => {
      mountAria();
      await expect.element(getPanel("タブ1")).toBeVisible();
      await expect.element(getPanel("タブ2")).not.toBeVisible();
      await expect.element(getPanel("タブ3")).not.toBeVisible();
    });

    test("タブとパネルにaria-controls/aria-labelledbyが設定されるべき", () => {
      mountAria();
      const tab1 = getTab("タブ1").element();
      const panel1 = getPanel("タブ1").element();
      expect(tab1.getAttribute("aria-controls")).toBe(panel1.id);
      expect(panel1.getAttribute("aria-labelledby")).toBe(tab1.id);
    });
  });

  describe("タブ選択", () => {
    test("タブをクリックすると対応するパネルが表示されるべき", async () => {
      mountAria();
      await getTab("タブ2").click();
      await expect.element(getPanel("タブ2")).toBeVisible();
      await expect.element(getPanel("タブ1")).not.toBeVisible();
    });

    test("タブをクリックするとaria-selectedが更新されるべき", async () => {
      mountAria();
      await getTab("タブ2").click();
      await expect
        .element(getTab("タブ2"))
        .toHaveAttribute("aria-selected", "true");
      await expect
        .element(getTab("タブ1"))
        .toHaveAttribute("aria-selected", "false");
    });

    test("タブをクリックするとtabindexが更新されるべき", async () => {
      mountAria();
      await getTab("タブ2").click();
      await expect.element(getTab("タブ2")).toHaveAttribute("tabindex", "0");
      await expect.element(getTab("タブ1")).toHaveAttribute("tabindex", "-1");
    });

    test("タブ選択時にtab-changeイベントが発火し、detailに正しい値が含まれるべき", async () => {
      mountAria();
      const el = document.querySelector("dads-tab-aria");
      const handler = vi.fn();
      el.addEventListener("tab-change", handler);

      await getTab("タブ3").click();

      expect(handler).toHaveBeenCalledOnce();
      const detail = handler.mock.calls[0][0].detail;
      expect(detail.selectedIndex).toBe(2);
      expect(detail.selectedTabLabel).toBe("タブ3");
      expect(detail.selectedPanel).toBe(getPanel("タブ3").element());
    });
  });

  describe("キーボードナビゲーション（auto activation）", () => {
    test("右矢印キーで次のタブが選択されるべき", async () => {
      mountAria();
      getTab("タブ1").element().focus();
      await userEvent.keyboard("{ArrowRight}");
      await expect
        .element(getTab("タブ2"))
        .toHaveAttribute("aria-selected", "true");
      await expect.element(getPanel("タブ2")).toBeVisible();
    });

    test("左矢印キーで前のタブが選択されるべき", async () => {
      mountAria();
      await getTab("タブ3").click();
      await userEvent.keyboard("{ArrowLeft}");
      await expect
        .element(getTab("タブ2"))
        .toHaveAttribute("aria-selected", "true");
      await expect.element(getPanel("タブ2")).toBeVisible();
    });

    test("最後のタブで右矢印キーを押すと最初のタブに戻るべき", async () => {
      mountAria();
      await getTab("タブ3").click();
      await userEvent.keyboard("{ArrowRight}");
      await expect
        .element(getTab("タブ1"))
        .toHaveAttribute("aria-selected", "true");
    });

    test("最初のタブで左矢印キーを押すと最後のタブに移動するべき", async () => {
      mountAria();
      getTab("タブ1").element().focus();
      await userEvent.keyboard("{ArrowLeft}");
      await expect
        .element(getTab("タブ3"))
        .toHaveAttribute("aria-selected", "true");
    });

    test("Homeキーで最初のタブが選択されるべき", async () => {
      mountAria();
      await getTab("タブ3").click();
      await userEvent.keyboard("{Home}");
      await expect
        .element(getTab("タブ1"))
        .toHaveAttribute("aria-selected", "true");
    });

    test("Endキーで最後のタブが選択されるべき", async () => {
      mountAria();
      getTab("タブ1").element().focus();
      await userEvent.keyboard("{End}");
      await expect
        .element(getTab("タブ3"))
        .toHaveAttribute("aria-selected", "true");
    });
  });

  describe("キーボードナビゲーション（manual activation）", () => {
    test("矢印キーでフォーカスのみ移動し、aria-selectedは変わらないべき", async () => {
      mountAria('data-activation="manual"');
      getTab("タブ1").element().focus();
      await userEvent.keyboard("{ArrowRight}");
      await expect.element(getTab("タブ2")).toHaveFocus();
      await expect
        .element(getTab("タブ1"))
        .toHaveAttribute("aria-selected", "true");
      await expect
        .element(getTab("タブ2"))
        .toHaveAttribute("aria-selected", "false");
      await expect.element(getPanel("タブ1")).toBeVisible();
      await expect.element(getPanel("タブ2")).not.toBeVisible();
    });

    test("Spaceキーでフォーカス中のタブが選択されるべき", async () => {
      mountAria('data-activation="manual"');
      getTab("タブ1").element().focus();
      await userEvent.keyboard("{ArrowRight}");
      await userEvent.keyboard("{ }");
      await expect
        .element(getTab("タブ2"))
        .toHaveAttribute("aria-selected", "true");
      await expect.element(getPanel("タブ2")).toBeVisible();
    });

    test("Enterキーでフォーカス中のタブが選択されるべき", async () => {
      mountAria('data-activation="manual"');
      getTab("タブ1").element().focus();
      await userEvent.keyboard("{ArrowRight}");
      await userEvent.keyboard("{Enter}");
      await expect
        .element(getTab("タブ2"))
        .toHaveAttribute("aria-selected", "true");
      await expect.element(getPanel("タブ2")).toBeVisible();
    });

    test("Home/Endキーでフォーカスのみ移動し、選択状態は変わらないべき", async () => {
      mountAria('data-activation="manual"');
      getTab("タブ1").element().focus();
      await userEvent.keyboard("{End}");
      await expect.element(getTab("タブ3")).toHaveFocus();
      await expect
        .element(getTab("タブ1"))
        .toHaveAttribute("aria-selected", "true");
      await userEvent.keyboard("{Home}");
      await expect.element(getTab("タブ1")).toHaveFocus();
      await expect
        .element(getTab("タブ1"))
        .toHaveAttribute("aria-selected", "true");
    });
  });
});
