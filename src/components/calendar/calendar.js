export class Calendar extends HTMLElement {
  constructor() {
    super();
    this.subscriptions = [];
    this.displayYear = new Date().getFullYear();
    this.displayMonth = new Date().getMonth();
    this.selectedDate = null;
    this.minDate = null;
    this.maxDate = null;
  }

  connectedCallback() {
    this.initializeCalendar();
    this.setupEventListeners();
  }

  disconnectedCallback() {
    for (const subscription of this.subscriptions) subscription.remove();
    this.subscriptions = [];
  }

  static observedAttributes = ["min-date", "max-date"];
  attributeChangedCallback(name) {
    if (name === "min-date" || name === "max-date") {
      this.initializeDateRange();
      this.populateYearSelect();
      this.renderCalendar();
    }
  }

  initializeCalendar() {
    this.initializeDateRange();
    this.populateYearSelect();
    this.renderCalendar();
  }

  setupEventListeners() {
    this.subscriptions.push(
      subscribe(this.calendarTable, "click", (e) => this.handleDateClick(e)),
      subscribe(this.calendarTable, "keydown", (e) => this.handleKeydown(e)),
      subscribe(this.prevMonthButton, "click", () => this.navigateMonth(-1)),
      subscribe(this.nextMonthButton, "click", () => this.navigateMonth(1)),
      subscribe(this.yearSelect, "change", (e) => this.handleYearChange(e)),
      subscribe(this.deleteButton, "click", () => this.deleteSelectedDate()),
      subscribe(this.todayButton, "click", () => this.selectToday()),
    );
  }

  initializeDateRange() {
    const now = new Date();
    const nowYear = now.getFullYear();
    const nowMonth = now.getMonth();
    const nowDate = now.getDate();

    let minDateAttr = this.getAttribute("min-date");
    let maxDateAttr = this.getAttribute("max-date");

    if (minDateAttr > maxDateAttr) {
      minDateAttr = null;
      maxDateAttr = null;
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(minDateAttr)) {
      const [year, month, date] = minDateAttr.split("-");
      this.minDate = new Date(year, month - 1, date);
    } else {
      this.minDate = new Date(nowYear - 1, nowMonth, nowDate);
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(maxDateAttr)) {
      const [year, month, date] = maxDateAttr.split("-");
      this.maxDate = new Date(year, month - 1, Number(date) + 1);
    } else {
      this.maxDate = new Date(nowYear + 1, nowMonth, nowDate);
    }

    const closestDate = this.getClosestDateInRange(now);
    this.displayYear = closestDate.getFullYear();
    this.displayMonth = closestDate.getMonth();
  }

  populateYearSelect() {
    const startYear = this.minDate.getFullYear();
    const endYear = this.previousMaxDate.getFullYear();

    this.yearSelect.innerHTML = "";

    for (let year = startYear; year <= endYear; year++) {
      const option = document.createElement("option");
      option.value = year;
      option.textContent = this.formatJapaneseYear(year);
      this.yearSelect.appendChild(option);
    }

    this.yearSelect.value = this.displayYear;
  }

  // 和暦付きの年表示
  formatJapaneseYear(year) {
    const date = new Date(year, 0, 1);
    const parts = new Intl.DateTimeFormat("ja-JP-u-ca-japanese", {
      era: "long",
      year: "numeric",
    }).formatToParts(date);

    const era = parts.find((part) => part.type === "era")?.value || "";
    const yearValue = parts.find((part) => part.type === "year")?.value || "";

    return `${year}年(${era}${yearValue}年)`;
  }

  isDateInRange(date) {
    // Invalid Date
    if (Number.isNaN(date.getTime())) {
      return false;
    }

    // 時刻部分を無視して日付のみで比較
    const dateOnly = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );
    return dateOnly >= this.minDate && dateOnly < this.maxDate;
  }

  getClosestDateInRange(date) {
    if (date < this.minDate) {
      return new Date(this.minDate);
    }
    if (date >= this.maxDate) {
      return new Date(this.previousMaxDate);
    }
    return new Date(date);
  }

  renderCalendar() {
    const {
      displayYear,
      displayMonth,
      yearSelect,
      prevMonthButton,
      isPreviousMonthAvailable,
      currentMonth,
      nextMonthButton,
      isNextMonthAvailable,
      calendarHeadingForAnnouncement,
      calendarTable,
      selectedDate,
      tbody,
      calendarHasSelectedDate,
      calendarHasToday,
    } = this;

    /* コントロール要素の更新 */

    yearSelect.value = displayYear;

    prevMonthButton.setAttribute("aria-disabled", !isPreviousMonthAvailable);
    nextMonthButton.setAttribute("aria-disabled", !isNextMonthAvailable);

    /* カレンダーテーブルの描画 */

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    for (const row of tbody.querySelectorAll("tr")) row.remove();

    const firstDay = new Date(displayYear, displayMonth, 1);
    const lastDay = new Date(displayYear, displayMonth + 1, 0);
    const startDate = new Date(firstDay);

    // 日曜日から開始
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const currentDate = new Date(startDate);
    let weekCount = 0;
    const maxWeeks = 6;

    while (weekCount++ < maxWeeks) {
      const row = document.createElement("tr");
      let weekContainsLastDay = false;

      for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        const date = new Date(currentDate);
        const isCurrentMonth = date.getMonth() === displayMonth;
        const isInRange = this.isDateInRange(date);
        const isToday = date.getTime() === today.getTime();

        const isDisabled = !isCurrentMonth || !isInRange;
        const isSelected =
          selectedDate && date.getTime() === selectedDate.getTime();
        const isFocusable =
          isSelected || (!calendarHasSelectedDate && isToday && !isDisabled);

        const cell = this.createDateCell(date, {
          isDisabled,
          isSelected,
          isFocusable,
        });
        row.appendChild(cell);

        weekContainsLastDay ||= lastDay.getTime() === date.getTime();

        currentDate.setDate(currentDate.getDate() + 1);
      }

      tbody.appendChild(row);

      if (weekContainsLastDay) {
        break;
      }
    }

    // 選択済み日付も今日も表示されていない場合、どのセルにもtabindex=0がついていないため、
    // 最初のenabledな日付にtabindex=0を設定
    if (!calendarHasSelectedDate && !calendarHasToday) {
      const buttons = tbody.querySelectorAll(
        "[data-js-date-button]:not(:disabled)",
      );
      buttons[0]?.setAttribute("tabindex", "0");
    }

    /* 見出しとラベルの更新 */

    const formatter = new Intl.DateTimeFormat("ja-JP", {
      year: "numeric",
      month: "long",
    });
    const heading = formatter.format(firstDay);

    this.setAttribute("aria-label", heading);
    calendarHeadingForAnnouncement.textContent = heading;
    calendarTable.setAttribute("aria-label", heading);

    currentMonth.textContent = new Intl.DateTimeFormat("ja-JP", {
      month: "long",
    }).format(firstDay);
  }

  createDateCell(date, { isDisabled, isSelected, isFocusable }) {
    const cell = this.cellTemplate.content.cloneNode(true).firstElementChild;
    const button = cell.querySelector("button");

    button.textContent = date.getDate();

    const formatter = new Intl.DateTimeFormat("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
    const ariaLabel = formatter.format(date);

    if (isDisabled) {
      cell.setAttribute("aria-disabled", "true");
      button.disabled = true;
    }
    if (isSelected) {
      cell.setAttribute("aria-selected", "true");
      button.setAttribute("aria-label", `選択中 ${ariaLabel}`);
      button.setAttribute("data-selected", "true");
    } else {
      button.setAttribute("aria-label", ariaLabel);
    }
    button.tabIndex = isFocusable ? 0 : -1;

    button.dataset.year = date.getFullYear();
    button.dataset.month = date.getMonth();
    button.dataset.date = date.getDate();

    return cell;
  }

  handleDateClick(e) {
    const button = e.target.matches("[data-js-date-button]") ? e.target : null;
    if (!button || button.disabled) return;

    const year = Number.parseInt(button.dataset.year);
    const month = Number.parseInt(button.dataset.month);
    const date = Number.parseInt(button.dataset.date);

    this.selectDate(new Date(year, month, date));
  }

  handleKeydown(e) {
    const button = e.target.matches("[data-js-date-button]") ? e.target : null;
    if (!button) return;

    const year = Number.parseInt(button.dataset.year);
    const month = Number.parseInt(button.dataset.month);
    const date = Number.parseInt(button.dataset.date);
    const currentDate = new Date(year, month, date);

    const targetDate = new Date(currentDate);

    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        targetDate.setDate(targetDate.getDate() - 7);
        this.navigateToDate(targetDate);
        break;
      case "ArrowDown":
        e.preventDefault();
        targetDate.setDate(targetDate.getDate() + 7);
        this.navigateToDate(targetDate);
        break;
      case "ArrowLeft":
        e.preventDefault();
        targetDate.setDate(targetDate.getDate() - 1);
        this.navigateToDate(targetDate);
        break;
      case "ArrowRight":
        e.preventDefault();
        targetDate.setDate(targetDate.getDate() + 1);
        this.navigateToDate(targetDate);
        break;
    }
  }

  navigateToDate(targetDate) {
    if (!this.isDateInRange(targetDate)) {
      return;
    }

    this.setDisplayMonth(targetDate.getFullYear(), targetDate.getMonth());

    const targetButton = this.calendarTable.querySelector(
      `[data-year="${targetDate.getFullYear()}"][data-month="${targetDate.getMonth()}"][data-date="${targetDate.getDate()}"]`,
    );
    if (targetButton) {
      for (const el of this.calendarTable.querySelectorAll('[tabindex="0"]')) {
        el.setAttribute("tabindex", "-1");
      }
      targetButton.setAttribute("tabindex", "0");
      targetButton.focus();
    }
  }

  selectDate(date) {
    this.selectedDate = date;
    this.renderCalendar();

    this.dispatchEvent(
      new CustomEvent("date-selected", {
        detail: { date },
        bubbles: true,
      }),
    );
  }

  navigateMonth(direction) {
    if (direction === -1 && !this.isPreviousMonthAvailable) return;
    if (direction === 1 && !this.isNextMonthAvailable) return;
    this.setDisplayMonth(this.displayYear, this.displayMonth + direction);
  }

  handleYearChange(e) {
    this.setDisplayMonth(Number.parseInt(e.target.value), this.displayMonth);
  }

  deleteSelectedDate() {
    this.selectDate(null);
  }

  selectToday() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (this.isDateInRange(today)) {
      this.selectDate(today);
    }
  }

  setSelectedDate(date) {
    if (date && this.isDateInRange(date)) {
      this.selectedDate = date;
    } else {
      this.selectedDate = null;
    }
    this.renderCalendar();
  }

  setDisplayMonth(y, m) {
    const monthToDisplay = this.getClosestDateInRange(new Date(y, m, 1));
    const year = monthToDisplay.getFullYear();
    const month = monthToDisplay.getMonth();
    const changed = this.displayYear !== year || this.displayMonth !== month;
    this.displayYear = year;
    this.displayMonth = month;
    if (changed) this.renderCalendar();
  }

  focus() {
    const focusableElement = this.calendarTable.querySelector('[tabindex="0"]');
    if (focusableElement) {
      focusableElement.focus();
    }
  }

  get previousMaxDate() {
    return new Date(
      this.maxDate.getFullYear(),
      this.maxDate.getMonth(),
      this.maxDate.getDate() - 1,
    );
  }

  get isPreviousMonthAvailable() {
    const prevMonthLastDay = new Date(this.displayYear, this.displayMonth, 0);
    return this.isDateInRange(prevMonthLastDay);
  }

  get isNextMonthAvailable() {
    const nextMonthFirstDay = new Date(
      this.displayYear,
      this.displayMonth + 1,
      1,
    );
    return this.isDateInRange(nextMonthFirstDay);
  }

  get calendarHasSelectedDate() {
    return (
      this.selectedDate &&
      this.displayYear === this.selectedDate.getFullYear() &&
      this.displayMonth === this.selectedDate.getMonth()
    );
  }

  get calendarHasToday() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return (
      this.displayYear === today.getFullYear() &&
      this.displayMonth === today.getMonth() &&
      this.isDateInRange(today)
    );
  }

  get calendarHeadingForAnnouncement() {
    return this.querySelector("[data-js-calendar-heading]");
  }

  get yearSelect() {
    return this.querySelector("[data-js-year-select]");
  }

  get prevMonthButton() {
    return this.querySelector("[data-js-prev-month-button]");
  }

  get nextMonthButton() {
    return this.querySelector("[data-js-next-month-button]");
  }

  get currentMonth() {
    return this.querySelector("[data-js-current-month]");
  }

  get calendarTable() {
    return this.querySelector("[data-js-calendar-table]");
  }

  get tbody() {
    return this.calendarTable.querySelector("tbody");
  }

  _cellTemplate = null;
  get cellTemplate() {
    if (!this._cellTemplate) {
      this._cellTemplate = this.querySelector("[data-js-cell-template]");
    }
    return this._cellTemplate;
  }

  get deleteButton() {
    return this.querySelector("[data-js-delete-button]");
  }

  get todayButton() {
    return this.querySelector("[data-js-today-button]");
  }
}

function subscribe(el, ...args) {
  el.addEventListener(...args);
  return { remove: () => el.removeEventListener(...args) };
}

customElements.define("dads-calendar", Calendar);
