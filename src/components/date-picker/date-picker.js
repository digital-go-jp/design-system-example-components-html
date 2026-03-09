export class DatePicker extends HTMLElement {
  #abort = null;

  connectedCallback() {
    this.#abort = new AbortController();
    this.#setupEventListeners();
  }

  disconnectedCallback() {
    this.#abort.abort();
  }

  #setupEventListeners() {
    const { signal } = this.#abort;
    if (this.#isConsolidated) {
      if (this.#yearInput) {
        this.#yearInput.addEventListener(
          "keydown",
          (e) => this.#handleInputKeydown(e, "year"),
          { signal },
        );
      }
      if (this.#monthInput) {
        this.#monthInput.addEventListener(
          "keydown",
          (e) => this.#handleInputKeydown(e, "month"),
          { signal },
        );
      }
      if (this.#dayInput) {
        this.#dayInput.addEventListener(
          "keydown",
          (e) => this.#handleInputKeydown(e, "day"),
          { signal },
        );
      }
    }

    if (this.#isCalendar) {
      this.addEventListener(
        "date-selected",
        (e) => this.#handleDateSelected(e),
        { signal },
      );
      this.#calendarButton.addEventListener(
        "click",
        () => this.#toggleCalendar(),
        { signal },
      );
      this.#calendarPopover.addEventListener(
        "keydown",
        (e) => this.#handlePopoverKeydown(e),
        { signal },
      );
      this.#backdrop.addEventListener("click", () => this.#closeCalendar(), {
        signal,
      });
    }
  }

  #handleDateSelected(e) {
    const { date } = e.detail;
    this.#syncToInputs(date);
    this.#closeCalendar();
  }

  #clearInputs() {
    if (this.#yearInput) this.#yearInput.value = "";
    if (this.#monthInput) this.#monthInput.value = "";
    if (this.#dayInput) this.#dayInput.value = "";
  }

  #syncToInputs(date) {
    if (!date) {
      this.#clearInputs();
      return;
    }
    if (this.#yearInput) {
      this.#yearInput.value = String(date.getFullYear()).padStart(4, "0");
    }
    if (this.#monthInput) {
      this.#monthInput.value = String(date.getMonth() + 1).padStart(2, "0");
    }
    if (this.#dayInput) {
      this.#dayInput.value = String(date.getDate()).padStart(2, "0");
    }
  }

  #toggleCalendar() {
    if (this.#isCalendarOpen) {
      this.#closeCalendar();
    } else {
      this.#openCalendar();
    }
  }

  #openCalendar() {
    const year = this.#yearInput
      ? Number.parseInt(this.#yearInput.value)
      : null;
    const month = this.#monthInput
      ? Number.parseInt(this.#monthInput.value)
      : null;
    const day = this.#dayInput ? Number.parseInt(this.#dayInput.value) : null;

    this.#calendar.setSelectedDate(new Date(year, month - 1, day));

    if (year && month && !Number.isNaN(year) && !Number.isNaN(month)) {
      this.#calendar.setDisplayMonth(year, month - 1);
    }

    this.#calendarPopover.style.display = "block";
    this.#calendarButton.setAttribute("aria-expanded", "true");
    this.#calendar.focus();
  }

  #closeCalendar() {
    this.#calendarPopover.style.display = "none";
    this.#calendarButton.setAttribute("aria-expanded", "false");
    this.#calendarButton.focus();
  }

  #handleInputKeydown(e, fieldType) {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      const input = e.target;
      const cursorPosition = input.selectionStart;
      const isAtStart = cursorPosition === 0;
      const isAtEnd = cursorPosition === input.value.length;

      if (e.key === "ArrowLeft" && isAtStart) {
        e.preventDefault();
        this.#focusPreviousField(fieldType);
      } else if (e.key === "ArrowRight" && isAtEnd) {
        e.preventDefault();
        this.#focusNextField(fieldType);
      }
    }
  }

  #focusPreviousField(currentField) {
    if (currentField === "month" && this.#yearInput) {
      this.#yearInput.focus();
    } else if (currentField === "day" && this.#monthInput) {
      this.#monthInput.focus();
    }
  }

  #focusNextField(currentField) {
    if (currentField === "year" && this.#monthInput) {
      this.#monthInput.focus();
    } else if (currentField === "month" && this.#dayInput) {
      this.#dayInput.focus();
    }
  }

  #handlePopoverKeydown(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      this.#closeCalendar();
      return;
    }

    if (e.key === "Tab") {
      const focusableElements = this.#getFocusableElements();
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  }

  #getFocusableElements() {
    const selectors = [
      "button:not([disabled])",
      "select:not([disabled])",
      '[tabindex]:not([tabindex="-1"])',
    ].join(",");

    return Array.from(this.#calendarPopover.querySelectorAll(selectors));
  }

  get #isCalendar() {
    return Boolean(this.#calendarButton);
  }

  get #isCalendarOpen() {
    return this.#calendarButton.getAttribute("aria-expanded") === "true";
  }

  get #isConsolidated() {
    return this.getAttribute("data-type") === "consolidated";
  }

  get #yearInput() {
    return this.querySelector("[data-js-year-input]");
  }

  get #monthInput() {
    return this.querySelector("[data-js-month-input]");
  }

  get #dayInput() {
    return this.querySelector("[data-js-day-input]");
  }

  get #calendarButton() {
    return this.querySelector("[data-js-calendar-button]");
  }

  get #calendarPopover() {
    return this.querySelector("[data-js-calendar-popover]");
  }

  get #calendar() {
    return this.querySelector("[data-js-calendar]");
  }

  get #backdrop() {
    return this.querySelector("[data-js-backdrop]");
  }
}

customElements.define("dads-date-picker", DatePicker);
