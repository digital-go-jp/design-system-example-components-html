export class Carousel extends HTMLElement {
  #slideData = [];
  #currentIndex = 0;
  #abort = new AbortController();
  #widthObserver = null;

  connectedCallback() {
    if (!this.hasAttribute("breakpoint-rem")) {
      console.error(`<${this.localName}>: "breakpoint-rem" attr is required.`);
      return;
    }

    this.#widthObserver = new WidthObserver(this, this.breakpointRem);

    this.collectSlideData();
    this.initializeSlideBgs();
    this.setupEventListeners();

    requestAnimationFrame(() => {
      this.update();
    });
  }

  disconnectedCallback() {
    this.#abort.abort();
    this.#widthObserver?.disconnect();
  }

  collectSlideData() {
    this.#slideData = this.slides.map((slide) => {
      const link = slide.querySelector("a");
      const href = link?.href;
      const target = link?.target;
      const rel = link?.rel;

      return { el: slide, href, target, rel };
    });
  }

  initializeSlideBgs() {
    for (const slide of this.#slideData) {
      const bg = slide.el.querySelector("[data-js-bg-container]");
      const image = this.getSlideImage(slide, { noAlt: true });
      bg.innerHTML = "";
      bg.appendChild(image);
    }
  }

  setupEventListeners() {
    const signal = this.#abort.signal;

    this.nextButton.addEventListener("click", () => this.next(), { signal });

    this.prevSlideButton.addEventListener("click", () => this.prev(), {
      signal,
    });
    this.nextSlideButton.addEventListener("click", () => this.next(), {
      signal,
    });

    this.addEventListener("select", (event) => this.goTo(event.detail.index), {
      signal,
    });

    this.#widthObserver.addEventListener("change", () => this.update(), {
      signal,
    });
  }

  update() {
    const nextIndex = (this.#currentIndex + 1) % this.#slideData.length;
    const current = this.#slideData[this.#currentIndex];
    const next = this.#slideData[nextIndex];

    this.currentNumber.textContent = this.#currentIndex + 1;

    if (this.#widthObserver.matches) {
      this.mainPanel.setAttribute("role", "tabpanel");
      this.mainPanel.setAttribute(
        "aria-label",
        `${this.unit}${this.#currentIndex + 1}`,
      );
    } else {
      this.mainPanel.removeAttribute("role");
      this.mainPanel.removeAttribute("aria-label");
    }

    if (current.href) {
      this.mainLink.href = current.href;
      this.mainLink.target = current.target || "_self";
      this.mainLink.rel = current.rel || "";
    } else {
      this.mainLink.removeAttribute("href");
      this.mainLink.removeAttribute("target");
      this.mainLink.removeAttribute("rel");
    }

    this.mainLabel.textContent = `${this.unit}${this.#currentIndex + 1}`;

    const mainImage = this.getSlideImage(current);
    this.mainImages.innerHTML = "";
    this.mainImages.appendChild(mainImage);

    const mainImageBg = this.getSlideImage(current, { noAlt: true });
    this.mainBg.innerHTML = "";
    this.mainBg.appendChild(mainImageBg);

    // Workaround for macOS Safari reading bug
    this.mainLink.replaceWith(this.mainLink.cloneNode(true));

    const nextImage = this.getSlideImage(next, { noAlt: true });
    this.nextImageContainer.innerHTML = "";
    this.nextImageContainer.appendChild(nextImage);

    const nextImageBg = this.getSlideImage(next, { noAlt: true });
    this.nextBg.innerHTML = "";
    this.nextBg.appendChild(nextImageBg);

    this.currentSlide.textContent = `${this.#currentIndex + 1} / ${this.#slideData.length}`;

    this.slideContainer.innerHTML = "";
    this.slideContainer.append(
      ...[
        ...this.#slideData.slice(this.#currentIndex + 1),
        ...this.#slideData.slice(0, this.#currentIndex),
      ].map((slide) => slide.el),
    );

    this.stepNav.setSelectedIndex(this.#currentIndex);
  }

  getSlideImage(slide, { noAlt } = {}) {
    const picture = slide.el.querySelector("picture");
    const img = slide.el.querySelector("img");

    const imgOrPicture = (picture || img).cloneNode(true);
    const imgEl = picture ? imgOrPicture.querySelector("img") : imgOrPicture;

    if (noAlt) {
      imgEl.alt = "";
    }

    return imgOrPicture;
  }

  next() {
    this.#currentIndex = (this.#currentIndex + 1) % this.#slideData.length;
    this.update();
  }

  prev() {
    this.#currentIndex =
      (this.#currentIndex + this.#slideData.length - 1) %
      this.#slideData.length;
    this.update();
  }

  goTo(index) {
    this.#currentIndex = index;
    this.update();
  }

  get breakpointRem() {
    return parseFloat(this.getAttribute("breakpoint-rem"));
  }

  get unit() {
    return this.getAttribute("data-js-unit") || "Slide ";
  }

  get slides() {
    return Array.from(this.querySelectorAll("[data-js-slide]"));
  }

  get inner() {
    return this.firstElementChild;
  }

  get mainPanel() {
    return this.querySelector("[data-js-main-panel]");
  }

  get mainLink() {
    return this.querySelector("[data-js-main-link]");
  }

  get mainLabel() {
    return this.querySelector("[data-js-main-label]");
  }

  get mainImages() {
    return this.querySelector("[data-js-main-images]");
  }

  get mainBg() {
    return this.querySelector("[data-js-main-bg]");
  }

  get currentNumber() {
    return this.querySelector("[data-js-current-number]");
  }

  get nextButton() {
    return this.querySelector("[data-js-next-button]");
  }

  get nextImageContainer() {
    return this.querySelector("[data-js-next-image-container]");
  }

  get nextBg() {
    return this.querySelector("[data-js-next-bg]");
  }

  get stepNav() {
    return this.querySelector("dads-carousel-step-nav");
  }

  get prevSlideButton() {
    return this.querySelector("[data-js-prev-slide-button]");
  }

  get nextSlideButton() {
    return this.querySelector("[data-js-next-slide-button]");
  }

  get currentSlide() {
    return this.querySelector("[data-js-current-slide]");
  }

  get slideContainer() {
    return this.querySelector("[data-js-slide-container]");
  }
}

export class CarouselStepNav extends HTMLElement {
  #selectedIndex = 0;
  #abort = new AbortController();

  connectedCallback() {
    this.setupEventListeners();
    this.update();
  }

  disconnectedCallback() {
    this.#abort.abort();
  }

  setupEventListeners() {
    const signal = this.#abort.signal;

    this.tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => this.selectTab(index), { signal });
    });

    this.addEventListener(
      "keydown",
      (event) => {
        if (event.key === "ArrowRight" || event.key === "ArrowDown") {
          event.preventDefault();
          this.next();
        } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
          event.preventDefault();
          this.prev();
        }
      },
      { signal },
    );
  }

  next() {
    const newIndex = (this.#selectedIndex + 1) % this.tabs.length;
    this.selectTab(newIndex);
  }

  prev() {
    const newIndex =
      (this.#selectedIndex + this.tabs.length - 1) % this.tabs.length;
    this.selectTab(newIndex);
  }

  selectTab(index) {
    this.#selectedIndex = index;
    this.update();

    this.tabs[index].focus();

    const event = new CustomEvent("select", {
      detail: { index },
      bubbles: true,
    });
    this.dispatchEvent(event);
  }

  setSelectedIndex(index) {
    this.#selectedIndex = index;
    this.update();
  }

  update() {
    this.tabs.forEach((tab, i) => {
      const isSelected = i === this.#selectedIndex;
      tab.setAttribute("aria-selected", isSelected ? "true" : "false");
      tab.tabIndex = isSelected ? 0 : -1;
    });
  }

  get tabs() {
    return Array.from(this.querySelectorAll("[role='tab']"));
  }
}

class WidthObserver extends EventTarget {
  minWidth;
  matches;
  #resizeObserver;

  constructor(element, minWidthRem) {
    super();
    this.minWidth = minWidthRem;
    this.matches = false;

    this.#resizeObserver = new ResizeObserver((entries) => {
      requestAnimationFrame(() => {
        for (const entry of entries) {
          const widthPx = entry.borderBoxSize[0].inlineSize;
          const remSize = parseFloat(
            getComputedStyle(document.documentElement).fontSize,
          );
          const widthRem = widthPx / remSize;
          const currentMatches = widthRem >= minWidthRem;

          if (currentMatches !== this.matches) {
            this.matches = currentMatches;
            this.dispatchEvent(
              new CustomEvent("change", {
                detail: { matches: currentMatches },
              }),
            );
          }
        }
      });
    });

    this.#resizeObserver.observe(element);
  }

  disconnect() {
    this.#resizeObserver.disconnect();
  }
}

customElements.define("dads-carousel", Carousel);
customElements.define("dads-carousel-step-nav", CarouselStepNav);
