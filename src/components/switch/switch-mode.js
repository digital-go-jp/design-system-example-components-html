export class SwitchMode extends HTMLElement {
  #abort = null;

  connectedCallback() {
    this.#abort = new AbortController();
    this.#setupEventListeners();
  }

  disconnectedCallback() {
    this.#abort.abort();
  }

  #setupEventListeners() {
    const signal = this.#abort.signal;

    this.addEventListener(
      "click",
      (e) => {
        const button = e.target.closest("[data-js-option]");
        if (!button || !this.contains(button)) return;
        this.#select(button);
      },
      { signal },
    );
  }

  #select(button) {
    if (this.#isDisabled(button)) return;

    const checked = button.getAttribute("aria-checked") !== "true";

    for (const option of this.#options) {
      option.setAttribute(
        "aria-checked",
        option === button ? String(checked) : String(!checked),
      );
    }

    button.dispatchEvent(new Event("input", { bubbles: true }));
    button.dispatchEvent(new Event("change", { bubbles: true }));
  }

  #isDisabled(button) {
    return button.disabled || button.getAttribute("aria-disabled") === "true";
  }

  get #options() {
    return this.querySelectorAll("[data-js-option]");
  }
}

customElements.define("dads-switch-mode", SwitchMode);
