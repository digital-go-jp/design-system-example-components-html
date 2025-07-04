export class LanguageSelector extends HTMLElement {
  constructor() {
    super();
    this.subscriptions = [];
  }

  connectedCallback() {
    this.setupEventListeners();
  }

  disconnectedCallback() {
    for (const subscription of this.subscriptions) subscription.remove();
    this.subscriptions = [];
  }

  setupEventListeners() {
    this.subscriptions.push(
      subscribe(this.opener, "click", (e) => this.handleOpenerClick(e)),
      subscribe(this.opener, "keydown", (e) => this.handleOpenerKeydown(e)),
      subscribe(this.menu, "keydown", (e) => this.handleMenuKeydown(e)),
      subscribe(this.menu, "focusout", (e) => this.handleMenuFocusOut(e)),
      subscribe(document, "click", (e) => this.handleClickOutside(e)),
      subscribe(document, "keydown", (e) => this.handleEscape(e)),
    );

    this.menuItems.forEach((item) => {
      this.subscriptions.push(
        subscribe(item, "click", () => this.handleMenuItemClick()),
      );
    });
  }

  handleOpenerClick(event) {
    event.preventDefault();
    this.toggleMenu();
  }

  handleOpenerKeydown(event) {
    if (!this.isOpen) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        this.focusFirstMenuItem();
        break;
      case "ArrowUp":
        event.preventDefault();
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

  handleMenuItemClick() {
    this.closeMenu();
    this.opener.focus();
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
    this.menuItems[index]?.focus();
  }

  get opener() {
    return this.querySelector(".dads-menu-list-box__opener");
  }

  get popup() {
    return this.querySelector(".dads-menu-list-box__popup");
  }

  get menu() {
    return this.querySelector(".dads-menu-list");
  }

  get menuItems() {
    return Array.from(this.querySelectorAll(".dads-menu-list__item"));
  }

  get isOpen() {
    return this.opener.getAttribute("aria-expanded") === "true";
  }

  get currentIndex() {
    return this.menuItems.findIndex((item) => item === document.activeElement);
  }
}

function subscribe(el, ...args) {
  el.addEventListener(...args);
  return { remove: () => el.removeEventListener(...args) };
}

customElements.define("dads-language-selector", LanguageSelector);
