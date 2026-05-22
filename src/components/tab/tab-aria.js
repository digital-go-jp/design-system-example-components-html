export class TabAria extends HTMLElement {
  #abort = null;

  connectedCallback() {
    this.#abort = new AbortController();
    this.#setupIds();
    this.#initializeVisibility();
    this.#setupEventListeners();
  }

  disconnectedCallback() {
    this.#abort.abort();
  }

  #setupIds() {
    const id = this.id || `dads-tab-${Math.random().toString(36).slice(-8)}`;
    const tabs = this.#tabs;
    const panels = this.#panels;

    tabs.forEach((tab, index) => {
      const tabId = `${id}-tab-${index}`;
      const href = tab.getAttribute("href");
      const hrefTarget = href?.startsWith("#") ? href.slice(1) : null;
      const panel = hrefTarget
        ? this.querySelector(`#${CSS.escape(hrefTarget)}[role="tabpanel"]`)
        : panels[index];
      const panelId = panel?.id || `${id}-panel-${index}`;

      tab.id = tabId;
      tab.setAttribute("aria-controls", panelId);

      if (panel) {
        panel.id = panelId;
        panel.setAttribute("aria-labelledby", tabId);
      }
    });
  }

  #initializeVisibility() {
    const tabs = this.#tabs;
    const panels = this.#panels;

    const selectedIndex = tabs.findIndex(
      (tab) => tab.getAttribute("aria-selected") === "true",
    );
    const activeIndex = selectedIndex >= 0 ? selectedIndex : 0;

    tabs.forEach((tab, i) => {
      tab.setAttribute("aria-selected", i === activeIndex ? "true" : "false");
      tab.setAttribute("tabindex", i === activeIndex ? "0" : "-1");
    });

    panels.forEach((panel, i) => {
      panel.hidden = i !== activeIndex;
    });
  }

  #setupEventListeners() {
    const { signal } = this.#abort;

    this.#tablist.addEventListener(
      "click",
      (e) => {
        const tab = e.target.closest('[role="tab"]');
        if (tab) this.#handleTabClick(e, tab);
      },
      { signal },
    );

    this.#tablist.addEventListener(
      "auxclick",
      (e) => {
        const tab = e.target.closest('[role="tab"]');
        if (tab) this.#handleTabAuxclick(e);
      },
      { signal },
    );

    this.#tablist.addEventListener(
      "keydown",
      (e) => {
        const tab = e.target.closest('[role="tab"]');
        if (tab) this.#handleTabKeydown(e);
      },
      { signal },
    );
  }

  #handleTabClick(event, tab) {
    event.preventDefault();
    this.selectTab(tab);
  }

  #handleTabAuxclick(event) {
    // ミドルクリック（新しいタブで開く）を抑制
    if (event.button === 1) {
      event.preventDefault();
    }
  }

  #handleTabKeydown(event) {
    const { key } = event;
    const isManual = this.#isManualActivation;

    const focusedTab = event.target.closest('[role="tab"]');
    if (!focusedTab) return;

    const tabs = this.#tabs;
    const currentIndex = tabs.indexOf(focusedTab);

    const activate = isManual
      ? (tab) => this.#focusTab(tab)
      : (tab) => this.selectTab(tab);

    if (key === "ArrowLeft" || key === "ArrowUp") {
      event.preventDefault();
      const prevIndex = currentIndex <= 0 ? tabs.length - 1 : currentIndex - 1;
      activate(tabs[prevIndex]);
    } else if (key === "ArrowRight" || key === "ArrowDown") {
      event.preventDefault();
      const nextIndex = currentIndex >= tabs.length - 1 ? 0 : currentIndex + 1;
      activate(tabs[nextIndex]);
    } else if (key === "Home") {
      event.preventDefault();
      activate(tabs[0]);
    } else if (key === "End") {
      event.preventDefault();
      activate(tabs[tabs.length - 1]);
    } else if (key === " " && isManual) {
      event.preventDefault();
      this.selectTab(focusedTab);
    }
  }

  #focusTab(tab) {
    tab.focus();
  }

  selectTab(tab) {
    const panelId = tab.getAttribute("aria-controls");
    const panel = panelId
      ? this.querySelector(`#${CSS.escape(panelId)}`)
      : null;

    for (const t of this.#tabs) {
      t.setAttribute("aria-selected", "false");
      t.setAttribute("tabindex", "-1");
    }

    for (const p of this.#panels) {
      p.hidden = true;
    }

    tab.setAttribute("aria-selected", "true");
    tab.setAttribute("tabindex", "0");
    tab.focus();

    if (panel) {
      panel.hidden = false;
    }

    this.dispatchEvent(
      new CustomEvent("tab-change", {
        bubbles: true,
        detail: {
          selectedTab: tab,
          selectedTabLabel: tab.textContent.trim(),
          selectedPanel: panel,
          selectedIndex: this.#tabs.indexOf(tab),
        },
      }),
    );
  }

  get #tablist() {
    return this.querySelector('[role="tablist"]');
  }

  get #tabs() {
    return Array.from(this.querySelectorAll('[role="tab"]'));
  }

  get #panels() {
    return Array.from(this.querySelectorAll('[role="tabpanel"]'));
  }

  get #isManualActivation() {
    return this.getAttribute("data-activation") === "manual";
  }
}

customElements.define("dads-tab-aria", TabAria);
