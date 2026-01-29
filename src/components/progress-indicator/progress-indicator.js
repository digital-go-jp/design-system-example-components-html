class ProgressIndicator extends HTMLElement {
  static DEFAULT_ANNOUNCE_INTERVAL_MS = 5000;

  static get observedAttributes() {
    return ["value", "active"];
  }

  static get defaultMessages() {
    return {
      announce: {
        start: "読み込みを開始しました",
        end: "読み込みが完了しました",
        long: "読み込み中です",
        longWithValue: "{value}% 読み込みました。",
      },
    };
  }

  #announcerEl = null;
  #longTimer = 0;
  #repeatTimer = 0;
  #announceTimer = 0;

  connectedCallback() {
    this.#validateIntent();
    this.#setupAnnouncer();
    this.#setup();
    this.#updateValue();

    if (this.active) {
      this.#handleStart();
    }
  }

  disconnectedCallback() {
    this.#clearTimers();
    this.#announcerEl?.remove();
    this.#announcerEl = null;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    if (name === "value") {
      this.#updateValue();
    }

    if (name === "active") {
      if (newValue !== null) {
        this.#handleStart();
      } else {
        this.#handleStop();
      }
    }
  }

  // --- Public properties ---

  get value() {
    const value = this.getAttribute("value");
    if (value === null || value === "") {
      return null;
    }
    const numValue = Number(value);
    return Number.isNaN(numValue) ? null : Math.min(100, Math.max(0, numValue));
  }

  set value(val) {
    if (val === null || val === undefined) {
      this.removeAttribute("value");
      return;
    }
    const numValue = Math.min(100, Math.max(0, Number(val) || 0));
    this.setAttribute("value", String(numValue));
  }

  get active() {
    return this.hasAttribute("active");
  }

  set active(val) {
    if (val) {
      this.setAttribute("active", "");
    } else {
      this.removeAttribute("active");
    }
  }

  start() {
    this.setAttribute("active", "");
  }

  stop() {
    this.removeAttribute("active");
  }

  get intent() {
    const val = this.getAttribute("intent");
    if (val === "explicit" || val === "passive") return val;
    return null;
  }

  get announceInterval() {
    const val = this.getAttribute("announce-interval");
    if (val === null || val === "") {
      return ProgressIndicator.DEFAULT_ANNOUNCE_INTERVAL_MS;
    }
    const num = Number(val);
    if (!Number.isFinite(num) || num <= 0) {
      return ProgressIndicator.DEFAULT_ANNOUNCE_INTERVAL_MS;
    }
    return num * 1000;
  }

  // --- Private methods ---

  #validateIntent() {
    const val = this.getAttribute("intent");
    if (val !== "explicit" && val !== "passive") {
      throw new Error(
        `[dads-progress-indicator] "intent" 属性は必須です。"explicit" または "passive" を指定してください。`,
      );
    }
  }

  #setupAnnouncer() {
    if (this.#announcerEl) return;

    const el = document.createElement("span");
    el.setAttribute("role", "status");

    // Visually hidden
    el.style.cssText =
      "clip:rect(0 0 0 0);clip-path:inset(50%);height:1px;overflow:hidden;position:absolute;white-space:nowrap;width:1px;";

    this.after(el);
    this.#announcerEl = el;
  }

  #setup() {
    this.setAttribute("role", "progressbar");
    this.setAttribute("aria-valuemin", "0");
    this.setAttribute("aria-valuemax", "100");

    const label = this.label;
    if (label) {
      const labelId = `dads-pi-${crypto.randomUUID()}`;
      label.id = labelId;
      this.setAttribute("aria-labelledby", labelId);
    }
  }

  #updateValue() {
    const value = this.value;

    if (value !== null) {
      this.indicator?.removeAttribute("data-indeterminate");
      this.setAttribute("aria-valuenow", String(value));
      this.style.setProperty("--value", String(value));

      if (this.percentage) {
        const intValue = Math.round(value);
        this.percentage.innerHTML = ` (<span>${intValue}</span>%)`;
      }
    } else {
      this.indicator?.setAttribute("data-indeterminate", "");
      this.removeAttribute("aria-valuenow");
      this.style.removeProperty("--value");

      if (this.percentage) {
        this.percentage.textContent = "";
      }
    }
  }

  #shouldAnnounce() {
    return this.intent === "explicit";
  }

  #getMessage(key, variables = {}) {
    const datasetKey = `announce${key.charAt(0).toUpperCase()}${key.slice(1)}`;
    let template = this.dataset[datasetKey];

    if (!template) {
      template = ProgressIndicator.defaultMessages.announce[key] || "";
    }

    return template.replace(/\{(\w+)\}/g, (match, variable) => {
      return variables[variable] !== undefined ? variables[variable] : match;
    });
  }

  #handleStart() {
    if (this.#shouldAnnounce()) {
      this.#announce(this.#getMessage("start"));
      this.#scheduleLongAndRepeats();
    }
  }

  #handleStop() {
    this.#clearTimers();

    if (this.#shouldAnnounce()) {
      this.#announce(this.#getMessage("end"));
    }
  }

  #announce(text) {
    if (!this.#announcerEl) return;

    this.#announceTimer = setTimeout(() => {
      this.#announcerEl.textContent = text;
      this.#announceTimer = setTimeout(() => {
        this.#announcerEl.textContent = "";
      }, 1000);
    }, 100);
  }

  #announceLong() {
    const value = this.value;
    if (value !== null) {
      this.#announce(
        this.#getMessage("longWithValue", { value: Math.round(value) }),
      );
    } else {
      this.#announce(this.#getMessage("long"));
    }
  }

  #scheduleLongAndRepeats() {
    if (!this.#shouldAnnounce()) return;
    this.#clearLongTimers();

    const interval = this.announceInterval;

    this.#longTimer = setTimeout(() => {
      if (!this.active || !this.#shouldAnnounce()) return;

      this.#announceLong();

      this.#repeatTimer = setInterval(() => {
        if (!this.active || !this.#shouldAnnounce()) return;
        this.#announceLong();
      }, interval);
    }, interval);
  }

  #clearLongTimers() {
    clearTimeout(this.#longTimer);
    clearInterval(this.#repeatTimer);
  }

  #clearTimers() {
    this.#clearLongTimers();
    clearTimeout(this.#announceTimer);
  }

  // --- DOM references ---

  get label() {
    return this.querySelector("[data-js-label]");
  }

  get indicator() {
    return this.querySelector("[data-js-indicator]");
  }

  get percentage() {
    return this.querySelector("[data-js-percentage]");
  }
}

customElements.define("dads-progress-indicator", ProgressIndicator);
