import { afterEach, describe, expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import "./switch-on-off.js";
import "./switch-mode.js";

afterEach(() => {
  document.body.innerHTML = "";
});

// ---------------------------------------------------------------------------
// SwitchOnOff（dads-switch-on-off）
// ---------------------------------------------------------------------------

const switchOnOffHTML = (extraAttrs = "") => `
<dads-switch-on-off class="dads-switch-on-off">
  <button id="switch" type="button" role="switch" aria-checked="false" data-js-toggle ${extraAttrs}>
    <span class="dads-switch-on-off__track" aria-hidden="true">
      <span class="dads-switch-on-off__thumb"></span>
    </span>
  </button>
</dads-switch-on-off>`;

const mountSwitchOnOff = (extraAttrs = "") => {
  document.body.innerHTML = switchOnOffHTML(extraAttrs);
  return document.querySelector("dads-switch-on-off");
};

const switchButton = () => document.querySelector("#switch");

describe("SwitchOnOff", () => {
  describe("初期化", () => {
    test("カスタム要素として登録されているべき", () => {
      mountSwitchOnOff();
      const el = document.querySelector("dads-switch-on-off");
      expect(el.constructor.name).toBe("SwitchOnOff");
    });

    test("初期状態ではaria-checkedがfalseであるべき", () => {
      mountSwitchOnOff();
      expect(switchButton().getAttribute("aria-checked")).toBe("false");
    });
  });

  describe("クリックによる切り替え", () => {
    test("クリックするとaria-checkedがtrueになるべき", async () => {
      mountSwitchOnOff();
      await userEvent.click(switchButton());
      expect(switchButton().getAttribute("aria-checked")).toBe("true");
    });

    test("2回クリックするとaria-checkedがfalseに戻るべき", async () => {
      mountSwitchOnOff();
      await userEvent.click(switchButton());
      await userEvent.click(switchButton());
      expect(switchButton().getAttribute("aria-checked")).toBe("false");
    });

    test("クリックするとchangeイベントが発火するべき", async () => {
      mountSwitchOnOff();
      const handler = vi.fn();
      document.addEventListener("change", handler);

      await userEvent.click(switchButton());

      expect(handler).toHaveBeenCalledOnce();
      expect(handler.mock.calls[0][0].target).toBe(switchButton());
    });

    test("クリックするとinputイベントが発火するべき", async () => {
      mountSwitchOnOff();
      const handler = vi.fn();
      document.addEventListener("input", handler);

      await userEvent.click(switchButton());

      expect(handler).toHaveBeenCalledOnce();
      expect(handler.mock.calls[0][0].target).toBe(switchButton());
    });
  });

  describe("スペースキーによる切り替え", () => {
    test("スペースキーでaria-checkedがtrueになるべき", async () => {
      mountSwitchOnOff();
      switchButton().focus();
      await userEvent.keyboard("{ }");
      expect(switchButton().getAttribute("aria-checked")).toBe("true");
    });
  });

  describe("disabled状態", () => {
    test("disabled属性が付いている場合はクリックで切り替わらないべき", () => {
      mountSwitchOnOff("disabled");
      switchButton().click();
      expect(switchButton().getAttribute("aria-checked")).toBe("false");
    });

    test("aria-disabled='true'が付いている場合はクリックで切り替わらないべき", () => {
      mountSwitchOnOff('aria-disabled="true"');
      switchButton().click();
      expect(switchButton().getAttribute("aria-checked")).toBe("false");
    });
  });
});

// ---------------------------------------------------------------------------
// SwitchMode（dads-switch-mode）
// ---------------------------------------------------------------------------

const switchModeHTML = (extraAttrs = "") => `
<dads-switch-mode class="dads-switch-mode" ${extraAttrs}>
  <button type="button" class="dads-switch-mode__option" role="switch" aria-checked="true" data-js-option>
    <span class="dads-switch-mode__label">ライト</span>
  </button>
  <span class="dads-switch-mode__control" aria-hidden="true">
    <span class="dads-switch-mode__rail">
      <span class="dads-switch-mode__thumb"></span>
    </span>
  </span>
  <button type="button" class="dads-switch-mode__option" role="switch" aria-checked="false" data-js-option>
    <span class="dads-switch-mode__label">ダーク</span>
  </button>
</dads-switch-mode>`;

const mountSwitchMode = (extraAttrs = "") => {
  document.body.innerHTML = switchModeHTML(extraAttrs);
  return document.querySelector("dads-switch-mode");
};

const options = () => [...document.querySelectorAll("[data-js-option]")];
const checkedOption = () => document.querySelector('[aria-checked="true"]');

describe("SwitchMode", () => {
  describe("初期化", () => {
    test("カスタム要素として登録されているべき", () => {
      mountSwitchMode();
      const el = document.querySelector("dads-switch-mode");
      expect(el.constructor.name).toBe("SwitchMode");
    });

    test("初期状態では左側（ライト）が選択されているべき", () => {
      mountSwitchMode();
      expect(checkedOption().textContent.trim()).toBe("ライト");
    });
  });

  describe("クリックによる切り替え", () => {
    test("反対側の選択肢をクリックすると切り替わるべき", async () => {
      mountSwitchMode();
      await userEvent.click(options()[1]);
      expect(checkedOption().textContent.trim()).toBe("ダーク");
    });

    test("選択中の選択肢をクリックしても切り替わるべき", async () => {
      mountSwitchMode();
      await userEvent.click(options()[0]);
      expect(checkedOption().textContent.trim()).toBe("ダーク");
    });

    test("クリック後は選択されていない側のaria-checkedがfalseになるべき", async () => {
      mountSwitchMode();
      await userEvent.click(options()[1]);
      expect(options()[0].getAttribute("aria-checked")).toBe("false");
      expect(options()[1].getAttribute("aria-checked")).toBe("true");
    });

    test("クリックするとchangeイベントが発火するべき", async () => {
      mountSwitchMode();
      const handler = vi.fn();
      document.addEventListener("change", handler);

      await userEvent.click(options()[1]);

      expect(handler).toHaveBeenCalledOnce();
    });

    test("クリックするとinputイベントが発火するべき", async () => {
      mountSwitchMode();
      const handler = vi.fn();
      document.addEventListener("input", handler);

      await userEvent.click(options()[1]);

      expect(handler).toHaveBeenCalledOnce();
    });
  });

  describe("スペースキーによる切り替え", () => {
    test("スペースキーで反対側の選択肢に切り替わるべき", async () => {
      mountSwitchMode();
      options()[1].focus();
      await userEvent.keyboard("{ }");
      expect(checkedOption().textContent.trim()).toBe("ダーク");
    });
  });

  describe("disabled状態", () => {
    const ariaDisabledHTML = `
<dads-switch-mode class="dads-switch-mode">
  <button type="button" class="dads-switch-mode__option" role="switch" aria-checked="true" aria-disabled="true" data-js-option>
    <span class="dads-switch-mode__label">ライト</span>
  </button>
  <span class="dads-switch-mode__control" aria-hidden="true">
    <span class="dads-switch-mode__rail">
      <span class="dads-switch-mode__thumb"></span>
    </span>
  </span>
  <button type="button" class="dads-switch-mode__option" role="switch" aria-checked="false" data-js-option>
    <span class="dads-switch-mode__label">ダーク</span>
  </button>
</dads-switch-mode>`;

    test("aria-disabled='true'が付いている選択肢はクリックしても切り替わらないべき", () => {
      document.body.innerHTML = ariaDisabledHTML;
      options()[0].click();
      expect(checkedOption().textContent.trim()).toBe("ライト");
    });

    test("aria-disabled='true'ではない選択肢は、反対側がaria-disabledでもクリックで切り替わるべき", () => {
      document.body.innerHTML = ariaDisabledHTML;
      options()[1].click();
      expect(checkedOption().textContent.trim()).toBe("ダーク");
    });
  });
});
