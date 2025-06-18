export class ScrollShadow extends HTMLElement {
  constructor() {
    super();
    this.subscriptions = [];
  }

  connectedCallback() {
    this.setup();
    this.setupEventListeners();
    this.update();
  }

  disconnectedCallback() {
    for (const subscription of this.subscriptions) subscription.remove();
    this.subscriptions = [];
    this.teardown();
  }

  setup() {
    Object.assign(this.style, {
      position: "relative",
      marginRight: "calc(var(--scroll-shadow-padding) * -1)",
      marginLeft: "calc(var(--scroll-shadow-padding) * -1)",
      display: "flex",
      overflowX: "auto",
      paddingRight: "var(--scroll-shadow-padding)",
      paddingBottom: "calc(8 / 16 * 1rem)",
      paddingLeft: "var(--scroll-shadow-padding)",
    });

    this.tabIndex = 0;

    const commonShadowStyles = `
      position: sticky;
      top: 0;
      bottom: 0;
      flex-shrink: 0;
      width: calc(24 / 16 * 1rem);
      transition: opacity 0.3s ease;
      opacity: 0;
      pointer-events: none;`;

    this.insertAdjacentHTML(
      "afterbegin",
      `<div class="dads-scroll-shadow__left" style="
        ${commonShadowStyles}
        left: calc(var(--scroll-shadow-padding) * -1);
        margin-right: calc(-24 / 16 * 1rem);
        background: linear-gradient(to right, rgba(0, 0, 0, 0.4), transparent);
      "></div>`,
    );

    this.insertAdjacentHTML(
      "beforeend",
      `<div class="dads-scroll-shadow__right" style="
        ${commonShadowStyles}
        right: calc(var(--scroll-shadow-padding) * -1);
        margin-left: calc(-24 / 16 * 1rem);
        background: linear-gradient(to left, rgba(0, 0, 0, 0.4), transparent);
      "></div>`,
    );
  }

  teardown() {
    this.removeAttribute("tabindex");
    this.querySelector(".dads-scroll-shadow__left")?.remove();
    this.querySelector(".dads-scroll-shadow__right")?.remove();
  }

  setupEventListeners() {
    this.subscriptions.push(
      subscribe(this, "scroll", () => this.update()),
      subscribe(window, "resize", () => this.update()),
    );
  }

  update() {
    if (this.leftShadow) {
      this.leftShadow.style.opacity = this.hasLeftShadow ? "1" : "0";
    }
    if (this.rightShadow) {
      this.rightShadow.style.opacity = this.hasRightShadow ? "1" : "0";
    }
  }

  get leftShadow() {
    return this.querySelector(".dads-scroll-shadow__left");
  }

  get rightShadow() {
    return this.querySelector(".dads-scroll-shadow__right");
  }

  get hasLeftShadow() {
    const paddingValue = this.getPaddingValue();
    return this.scrollLeft > paddingValue;
  }

  get hasRightShadow() {
    const paddingValue = this.getPaddingValue();
    return this.scrollLeft + this.clientWidth < this.scrollWidth - paddingValue;
  }

  getPaddingValue() {
    return resolveVarPx(this, "--scroll-shadow-padding");
  }
}

function subscribe(el, ...args) {
  el.addEventListener(...args);
  return { remove: () => el.removeEventListener(...args) };
}

function resolveVarPx(targetEl, varName) {
  const probe = document.createElement("div");
  probe.style.cssText = `
    position:absolute;
    visibility:hidden;
    width:var(${varName});
  `;
  targetEl.appendChild(probe);
  const px = parseFloat(getComputedStyle(probe).width);
  probe.remove();
  return px;
}

customElements.define("dads-scroll-shadow", ScrollShadow);
