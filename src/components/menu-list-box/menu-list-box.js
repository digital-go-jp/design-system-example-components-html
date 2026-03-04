export class MenuListBox extends HTMLElement {
  #abort = null;

  connectedCallback() {
    this.#abort = new AbortController();
    this.setupEventListeners();
  }

  disconnectedCallback() {
    this.#abort.abort();
  }

  setupEventListeners() {
    const { signal } = this.#abort;
    this.opener.addEventListener("click", (e) => this.handleOpenerClick(e), {
      signal,
    });
    this.opener.addEventListener(
      "keydown",
      (e) => this.handleOpenerKeydown(e),
      { signal },
    );
    this.menu.addEventListener("keydown", (e) => this.handleMenuKeydown(e), {
      signal,
    });
    this.menu.addEventListener("focusout", (e) => this.handleMenuFocusOut(e), {
      signal,
    });
    document.addEventListener("click", (e) => this.handleClickOutside(e), {
      signal,
    });
    document.addEventListener("keydown", (e) => this.handleEscape(e), {
      signal,
    });
    this.addEventListener(
      "click",
      (event) => {
        const item = event.target.closest("[data-js-menu-item]");
        if (item) this.selectMenuItem(item);
      },
      { signal },
    );
  }

  handleOpenerClick(event) {
    event.preventDefault();
    this.toggleMenu();
    if (this.isOpen) {
      this.focusFirstMenuItem();
    }
  }

  handleOpenerKeydown(event) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        this.openMenu();
        this.focusFirstMenuItem();
        break;
      case "ArrowUp":
        event.preventDefault();
        this.openMenu();
        this.focusLastMenuItem();
        break;
    }
  }

  handleMenuKeydown(event) {
    if (!this.isOpen) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        this.focusNextMenuItem();
        break;
      case "ArrowUp":
        event.preventDefault();
        this.focusPreviousMenuItem();
        break;
      case "Home":
        event.preventDefault();
        this.focusFirstMenuItem();
        break;
      case "End":
        event.preventDefault();
        this.focusLastMenuItem();
        break;
    }
  }

  handleClickOutside(event) {
    if (!this.isOpen) return;
    if (!this.contains(event.target)) {
      this.closeMenu();
    }
  }

  handleMenuFocusOut(event) {
    if (!this.isOpen) return;
    if (!event.relatedTarget) return;

    if (!this.contains(event.relatedTarget)) {
      this.closeMenu();
    }
  }

  handleEscape(event) {
    if (event.key === "Escape" && this.isOpen) {
      event.preventDefault();
      this.closeMenu();
      this.opener.focus();
    }
  }

  toggleMenu() {
    if (this.isOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  openMenu() {
    this.popup.hidden = false;
    this.opener.setAttribute("aria-expanded", "true");
  }

  closeMenu() {
    this.popup.hidden = true;
    this.opener.setAttribute("aria-expanded", "false");
  }

  focusFirstMenuItem() {
    this.focusItem(0);
  }

  focusLastMenuItem() {
    this.focusItem(this.menuItems.length - 1);
  }

  focusNextMenuItem() {
    if (this.currentIndex >= this.menuItems.length - 1) {
      this.focusItem(0);
    } else {
      this.focusItem(this.currentIndex + 1);
    }
  }

  focusPreviousMenuItem() {
    if (this.currentIndex <= 0) {
      this.focusItem(this.menuItems.length - 1);
    } else {
      this.focusItem(this.currentIndex - 1);
    }
  }

  focusItem(index) {
    const { menuItems } = this;

    if (index >= 0 && index < menuItems.length) {
      menuItems.forEach((item) => {
        item.setAttribute("tabindex", "-1");
      });
      menuItems[index].setAttribute("tabindex", "0");
      menuItems[index].focus();
    }
  }

  selectMenuItem(menuItem) {
    const selectedText = menuItem.textContent.trim();

    this.dispatchEvent(
      new CustomEvent("menuitemselect", {
        bubbles: true,
        detail: {
          selectedItem: menuItem,
          selectedValue: selectedText,
          selectedIndex: this.menuItems.indexOf(menuItem),
        },
      }),
    );

    this.closeMenu();
    this.opener.focus();
  }

  get opener() {
    return this.querySelector("[data-js-opener]");
  }

  get popup() {
    return this.querySelector("[data-js-popup]");
  }

  get menu() {
    return this.querySelector("[data-js-menu]");
  }

  get menuItems() {
    return Array.from(this.querySelectorAll("[data-js-menu-item]"));
  }

  get isOpen() {
    return this.opener.getAttribute("aria-expanded") === "true";
  }

  get currentIndex() {
    return this.menuItems.findIndex((item) => item === document.activeElement);
  }
}

customElements.define("dads-menu-list-box", MenuListBox);
