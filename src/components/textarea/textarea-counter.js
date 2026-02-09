export class TextareaCounter extends HTMLElement {
  #debounceTimer = 0;
  #announceTimer = 0;
  #abort = null;

  static defaultMessages = {
    error: {
      exceeded: "{count}文字超過しています",
    },
    announce: {
      exceeded: "{count}文字超過",
      remaining: "残り{count}文字",
    },
  };

  connectedCallback() {
    this.#render();
    this.#setupEventListeners();
    this.#update({ initial: true });
  }

  disconnectedCallback() {
    this.#abort?.abort();
    clearTimeout(this.#debounceTimer);
    clearTimeout(this.#announceTimer);
  }

  #render() {
    this.innerHTML = `
        <span class="dads-u-visually-hidden" aria-live="assertive" data-announcer="assertive"></span>
        <span class="dads-u-visually-hidden" aria-live="polite" data-announcer="polite"></span>
        <span data-count>${0} / ${this.#max}</span>
      `;
  }

  #setupEventListeners() {
    this.#abort = new AbortController();
    const signal = this.#abort.signal;

    this.#textarea?.addEventListener(
      "input",
      (e) => {
        if (!e.isComposing) {
          this.#update();
        }
      },
      { signal },
    );

    this.#textarea?.addEventListener("compositionend", () => this.#update(), {
      signal,
    });
  }

  #countTextLength(text) {
    return text.length;
  }

  #getMessage(category, key, variables = {}) {
    const datasetKey = `${category}${key.charAt(0).toUpperCase()}${key.slice(1)}`;
    let template = this.dataset[datasetKey];

    if (!template) {
      template = TextareaCounter.defaultMessages[category]?.[key] || "";
    }

    return template.replace(/\{(\w+)\}/g, (match, variable) => {
      return variables[variable] !== undefined ? variables[variable] : match;
    });
  }

  #update({ initial = false } = {}) {
    const textarea = this.#textarea;
    const countEl = this.#countEl;
    if (!textarea || !countEl) return;

    const current = this.#countTextLength(textarea.value);
    const remaining = this.#max - current;
    const exceeded = remaining < 0;

    countEl.textContent = `${current} / ${this.#max}`;
    this.toggleAttribute("data-exceeded", exceeded);

    if (exceeded) {
      textarea.setCustomValidity(
        this.#getMessage("error", "exceeded", { count: Math.abs(remaining) }),
      );
    } else {
      textarea.setCustomValidity("");
    }

    if (!initial) {
      if (exceeded) {
        clearTimeout(this.#debounceTimer);
        this.#announce(this.#getAnnounceMessage(remaining, exceeded), true);
      } else {
        this.#scheduleAnnounce(remaining, exceeded);
      }
    }
  }

  #calcDelay(remaining) {
    if (remaining <= 1) return 1000;
    return Math.max(1, Math.log10(remaining)) * 1000;
  }

  #getAnnounceMessage(remaining, exceeded) {
    const key = exceeded ? "exceeded" : "remaining";
    return this.#getMessage("announce", key, { count: Math.abs(remaining) });
  }

  #announce(text, assertive = false) {
    clearTimeout(this.#announceTimer);

    const active = assertive ? "assertive" : "polite";
    const inactive = assertive ? "polite" : "assertive";
    this.#getAnnouncer(inactive).textContent = "";
    this.#getAnnouncer(active).textContent = "";

    this.#announceTimer = window.setTimeout(() => {
      this.#getAnnouncer(active).textContent = text;
    }, 100);
  }

  #scheduleAnnounce(remaining, exceeded) {
    clearTimeout(this.#debounceTimer);

    const delay = this.#calcDelay(remaining);

    this.#debounceTimer = window.setTimeout(() => {
      this.#announce(this.#getAnnounceMessage(remaining, exceeded));
    }, delay);
  }

  #getAnnouncer(type) {
    return this.querySelector(`[data-announcer="${type}"]`);
  }

  get #textarea() {
    const forId = this.getAttribute("for");
    if (!forId) return null;
    return document.getElementById(forId);
  }

  get #max() {
    return parseInt(this.getAttribute("max") ?? "0", 10);
  }

  get #countEl() {
    return this.querySelector("[data-count]");
  }
}

customElements.define("dads-textarea-counter", TextareaCounter);
