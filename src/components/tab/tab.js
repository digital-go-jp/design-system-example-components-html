export class Tab extends HTMLElement {
  #abort = null;
  #insertedHeadings = [];

  connectedCallback() {
    this.#abort = new AbortController();

    const labelledby = this.#list?.getAttribute("aria-labelledby");
    if (!labelledby) {
      throw new Error(
        "[dads-tab] [data-js-tab-list] に aria-labelledby 属性が必要です。タブ全体の見出し要素のIDを指定してください。",
      );
    }

    const headingEl = document.getElementById(labelledby);
    if (!headingEl) {
      throw new Error(
        `[dads-tab] aria-labelledby="${labelledby}" に対応する要素が見つかりません。`,
      );
    }

    this.#insertPanelHeadings(headingEl);
    this.#selectTab(this.#findActiveIndex());
    this.#setupEventListeners();
  }

  disconnectedCallback() {
    this.#abort.abort();
    for (const heading of this.#insertedHeadings) {
      heading.remove();
    }
    this.#insertedHeadings = [];
  }

  #insertPanelHeadings(headingEl) {
    const match = headingEl.tagName.match(/^H([1-6])$/i);
    const headingLevel = match ? Number.parseInt(match[1], 10) : 2;
    const level = Math.min(headingLevel + 1, 6);

    const tabs = this.#tabs;
    const panels = this.#panels;

    panels.forEach((panel, index) => {
      const tab = tabs[index];
      if (!tab) return;

      const label = tab.textContent.trim();
      const heading = document.createElement(`h${level}`);
      heading.textContent = label;
      heading.setAttribute("tabindex", "-1");

      Object.assign(heading.style, {
        clip: "rect(0 0 0 0)",
        clipPath: "inset(50%)",
        height: "1px",
        overflow: "hidden",
        position: "absolute",
        whiteSpace: "nowrap",
        width: "1px",
      });

      panel.insertBefore(heading, panel.firstChild);
      this.#insertedHeadings.push(heading);
    });
  }

  #findActiveIndex() {
    return Math.max(
      this.#tabs.findIndex(
        (tab) => tab.getAttribute("aria-current") === "true",
      ),
      0,
    );
  }

  #selectTab(index, moveFocus = false) {
    const tabs = this.#tabs;
    const panels = this.#panels;

    tabs.forEach((tab, i) => {
      if (i === index) {
        tab.setAttribute("aria-current", "true");
      } else {
        tab.removeAttribute("aria-current");
      }
    });

    panels.forEach((panel, i) => {
      panel.hidden = i !== index;
    });

    if (moveFocus) {
      this.#insertedHeadings[index]?.focus();

      this.dispatchEvent(
        new CustomEvent("tab-change", {
          bubbles: true,
          detail: {
            selectedTab: tabs[index],
            selectedTabLabel: tabs[index].textContent.trim(),
            selectedPanel: panels[index],
            selectedIndex: index,
          },
        }),
      );
    }
  }

  #setupEventListeners() {
    const { signal } = this.#abort;

    this.#list.addEventListener(
      "click",
      (e) => {
        const tab = e.target.closest("[data-js-tab]");
        if (!tab || !this.#list.contains(tab)) return;
        e.preventDefault();

        const index = this.#tabs.indexOf(tab);
        if (index === -1) return;
        this.#selectTab(index, true);
      },
      { signal },
    );
  }

  get #list() {
    return this.querySelector("[data-js-tab-list]");
  }

  get #tabs() {
    return Array.from(this.querySelectorAll("[data-js-tab]"));
  }

  get #panels() {
    return this.#tabs.map((tab) => {
      const hash = new URL(tab.href).hash;
      return hash ? this.querySelector(hash) : null;
    });
  }
}

customElements.define("dads-tab", Tab);
