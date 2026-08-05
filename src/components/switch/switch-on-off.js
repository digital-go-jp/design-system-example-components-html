export class SwitchOnOff extends HTMLElement {
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
        const button = e.target.closest("[data-js-toggle]");
        if (!button || !this.contains(button)) return;
        this.#toggle(button);
      },
      { signal },
    );
  }

  #toggle(button) {
    if (this.#isDisabled(button)) return;

    const checked = button.getAttribute("aria-checked") !== "true";
    button.setAttribute("aria-checked", String(checked));

    button.dispatchEvent(new Event("input", { bubbles: true }));
    button.dispatchEvent(new Event("change", { bubbles: true }));
  }

  #isDisabled(button) {
    return button.disabled || button.getAttribute("aria-disabled") === "true";
  }
}

customElements.define("dads-switch-on-off", SwitchOnOff);
