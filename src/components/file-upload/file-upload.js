let activeExpandedComponent = null;

export class FileUpload extends HTMLElement {
  /**
   * @typedef {Object} FileInfo
   * @property {string} id
   * @property {string} name
   * @property {number} size
   * @property {boolean} isExisting
   * @property {HTMLElement} element
   * @property {File} [file]
   * @property {string[]} [errors]
   */
  /** @type {FileInfo[]} */
  files = [];

  /** @type {string[]} */
  errors = [];

  #timers = {};
  #dragCounter = 0;
  #viewportOverlay = null;
  #abort = null;

  static get defaultMessages() {
    return {
      error: {
        maxFiles: "選択できるファイル数が上限を超過しています。",
        maxTotalSize: "選択できるファイルサイズの合計が上限を超過しています。",
        invalidType: "許可されていないファイル形式です。",
        maxFileSize: "ファイルサイズが上限を超過しています。",
        hasFileErrors:
          "選択したファイルにエラーがあります。該当ファイルをチェックしてください。",
      },
      announce: {
        dropAvailable: "ここにドロップできます。",
        dropUnavailable: "ドロップエリア外。",
      },
      label: {
        selectedFiles:
          "選択中：{count}個、{sizeFormatted}（{sizeBytes}バイト）",
      },
    };
  }

  connectedCallback() {
    this.#abort = new AbortController();

    this.#viewportOverlay = this.querySelector("[data-js-viewport-overlay]");
    if (this.#viewportOverlay) {
      document.body.appendChild(this.#viewportOverlay);
    }

    this.#loadExistingFiles();
    this.#setupEventListeners();
    this.#updateUI();
  }

  disconnectedCallback() {
    this.#abort.abort();
    this.#clearAllTimers();

    if (this.#viewportOverlay) {
      this.appendChild(this.#viewportOverlay);
    }
  }

  addFiles(files) {
    const filesToAdd = this.isMultiple ? files : files.slice(0, 1);

    if (!this.isMultiple && this.files.length > 0) {
      this.files.forEach((file) => {
        if (file.element) {
          file.element.remove();
        }
      });
      this.files = [];
    }

    const newFiles = filesToAdd.map((file) => ({
      id: `file-${Math.random().toString(36).slice(-8)}`,
      file: file,
      name: file.name,
      size: file.size,
      isExisting: false,
      errors: [],
    }));

    this.files.push(...newFiles);
    this.#validateFiles();
    this.#updateUI();
  }

  removeFile(fileId) {
    const index = this.files.findIndex((f) => f.id === fileId);
    if (index === -1) return;

    const file = this.files[index];
    if (file.element) {
      file.element.remove();
    }
    this.files.splice(index, 1);
    this.#validateFiles();
    this.#updateUI();
  }

  setExpandedDropArea(expanded) {
    if (this.expandDropAreaCheckbox) {
      this.expandDropAreaCheckbox.checked = expanded;
    }
  }

  #clearAllTimers() {
    for (const key in this.#timers) {
      clearTimeout(this.#timers[key]);
      clearInterval(this.#timers[key]);
    }
    this.#timers = {};
  }

  #setupEventListeners() {
    const signal = this.#abort.signal;

    this.selectButton.addEventListener(
      "click",
      (e) => {
        e.preventDefault();
        this.fallbackInput.click();
      },
      { signal },
    );

    this.fallbackInput.addEventListener(
      "change",
      (e) => {
        const files = Array.from(e.target.files || []);
        this.addFiles(files);
        this.fallbackInput.value = "";
        this.selectButton.focus();
      },
      { signal },
    );

    const dropZone = this.dropArea || this.selectButton;

    dropZone.addEventListener(
      "dragenter",
      () => {
        this.#dragCounter++;
        if (this.#dragCounter === 1) {
          dropZone.setAttribute("data-dragover", "true");
          this.#startDropAnnounce();
        }
      },
      { signal },
    );

    dropZone.addEventListener(
      "dragover",
      (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
      },
      { signal },
    );

    dropZone.addEventListener(
      "dragleave",
      () => {
        this.#dragCounter--;
        if (this.#dragCounter === 0) {
          dropZone.removeAttribute("data-dragover");
          this.#stopDropAnnounce();
          this.#announceText(
            this.#getMessage("announce", "dropUnavailable"),
            true,
          );
        }
      },
      { signal },
    );

    dropZone.addEventListener(
      "drop",
      (e) => {
        e.preventDefault();
        this.#dragCounter = 0;
        dropZone.removeAttribute("data-dragover");
        this.#stopDropAnnounce();

        const files = Array.from(e.dataTransfer?.files || []);
        this.addFiles(files);
        this.selectButton.focus();
      },
      { signal },
    );

    this.expandDropAreaCheckbox?.addEventListener(
      "change",
      (e) => {
        if (e.target.checked) {
          if (activeExpandedComponent && activeExpandedComponent !== this) {
            activeExpandedComponent.setExpandedDropArea(false);
          }
          activeExpandedComponent = this;
        } else {
          if (activeExpandedComponent === this) {
            activeExpandedComponent = null;
          }
        }
      },
      { signal },
    );

    document.documentElement.addEventListener(
      "dragover",
      (e) => {
        if (this.expandDropAreaCheckbox?.checked) {
          e.preventDefault();
          this.#showViewportOverlay();
        }
      },
      { signal },
    );

    this.#viewportOverlay?.addEventListener(
      "dragenter",
      () => {
        this.#dragCounter++;
        if (this.#dragCounter === 1) {
          this.#startDropAnnounce();
        }
      },
      { signal },
    );

    this.#viewportOverlay?.addEventListener(
      "dragover",
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.#resetDragOverTimeout();
        e.dataTransfer.dropEffect = "copy";
      },
      { signal },
    );

    this.#viewportOverlay?.addEventListener(
      "dragleave",
      () => {
        this.#dragCounter--;
        if (this.#dragCounter === 0) {
          this.#hideViewportOverlay();
          this.#stopDropAnnounce();
          this.#announceText(
            this.#getMessage("announce", "dropUnavailable"),
            true,
          );
        }
      },
      { signal },
    );

    this.#viewportOverlay?.addEventListener(
      "drop",
      (e) => {
        e.preventDefault();
        this.#dragCounter = 0;
        this.#hideViewportOverlay();
        this.#stopDropAnnounce();

        const files = Array.from(e.dataTransfer?.files || []);
        this.addFiles(files);
        this.selectButton.focus();
      },
      { signal },
    );

    // Remove button delegation
    this.addEventListener(
      "click",
      ({ target }) => {
        if (!target.closest("[data-js-remove-button]")) return;

        const listItem = target.closest("li");
        const fileId = listItem?.dataset.id;
        const fileIndex = this.files.findIndex((f) => f.id === fileId);

        this.removeFile(fileId);
        this.#focusAfterFileRemoval(fileIndex);
      },
      { signal },
    );
  }

  #startDropAnnounce() {
    this.#stopDropAnnounce();

    const message = this.#getMessage("announce", "dropAvailable");

    this.#announceText(message, true);

    this.#timers.drop = setInterval(() => {
      this.#announceText(message);
    }, 3000);
  }

  #stopDropAnnounce() {
    clearInterval(this.#timers.drop);
  }

  #announceText(text, assertive = false) {
    const announcer = assertive ? this.announcerAssertive : this.announcer;
    if (!announcer || !text) return;

    const timerKey = `announce_${assertive ? "assertive" : "polite"}`;
    clearTimeout(this.#timers[timerKey]);

    announcer.textContent = "";

    this.#timers[timerKey] = setTimeout(() => {
      announcer.textContent = text;
      this.#timers[timerKey] = setTimeout(() => {
        announcer.textContent = "";
      }, 1000);
    }, 100);
  }

  #resetDragOverTimeout() {
    clearTimeout(this.#timers.dragover);

    this.#timers.dragover = setTimeout(() => {
      if (
        this.#viewportOverlay &&
        !this.#viewportOverlay.hasAttribute("hidden")
      ) {
        this.#dragCounter = 0;
        this.#hideViewportOverlay();
      }
    }, 300);
  }

  #showViewportOverlay() {
    this.#viewportOverlay.removeAttribute("hidden");
  }

  #hideViewportOverlay() {
    this.#viewportOverlay.setAttribute("hidden", "");
  }

  #focusAfterFileRemoval(index) {
    const totalCount = this.files.length;

    if (totalCount === 0) {
      this.selectButton.focus();
    } else if (index < this.files.length) {
      const nextFile = this.files[index];
      nextFile.element.querySelector("[data-js-remove-button]")?.focus();
    } else {
      const lastFile = this.files[this.files.length - 1];
      lastFile.element.querySelector("[data-js-remove-button]")?.focus();
    }
  }

  #getMessage(category, key, variables = {}) {
    const datasetKey = `${category}${key.charAt(0).toUpperCase()}${key.slice(1)}`;
    let template = this.dataset[datasetKey];

    if (!template) {
      template = FileUpload.defaultMessages[category]?.[key] || "";
    }

    return template.replace(/\{(\w+)\}/g, (match, variable) => {
      return variables[variable] !== undefined ? variables[variable] : match;
    });
  }

  #loadExistingFiles() {
    const existingItems = this.fileList.querySelectorAll(":scope > li");
    existingItems.forEach((item) => {
      const fileId = `file-${Math.random().toString(36).slice(-8)}`;
      item.dataset.id = fileId;

      const fileNameEl = item.querySelector('[data-slot="fileName"]');
      const fileSizeEl = item.querySelector('[data-slot="fileSizeBytes"]');
      const fileSizeText = fileSizeEl?.textContent.trim() ?? "0";

      const removeButton = item.querySelector("[data-js-remove-button]");

      if (fileNameEl && removeButton) {
        const nameId = `${fileId}-name`;
        const buttonId = `${fileId}-remove`;

        fileNameEl.id = nameId;
        removeButton.id = buttonId;
        removeButton.setAttribute("aria-labelledby", `${buttonId} ${nameId}`);
      }

      const fileInfo = {
        id: fileId,
        name: fileNameEl?.textContent.trim() ?? "",
        size: Number.parseInt(fileSizeText.replace(/,/g, ""), 10),
        isExisting: true,
        element: item,
      };
      this.files.push(fileInfo);
    });
  }

  #validateFiles() {
    this.errors = [];
    this.files.forEach((fileInfo) => {
      if (!fileInfo.isExisting) {
        fileInfo.errors = [];
      }
    });

    const newFiles = this.files.filter((f) => !f.isExisting);

    const maxFiles = Number.parseInt(this.getAttribute("max-files"), 10);
    if (!Number.isNaN(maxFiles) && this.files.length > maxFiles) {
      this.errors.push(
        this.#getMessage("error", "maxFiles", {
          max: maxFiles,
          current: this.files.length,
        }),
      );
    }

    const accept = this.fallbackInput.accept;
    const allowedExtensions = this.#parseAcceptAttribute(accept);
    const maxFileSize = this.#parseSize(this.getAttribute("max-file-size"));
    const maxTotalSize = this.#parseSize(this.getAttribute("max-total-size"));
    const totalSize = this.files.reduce((sum, fileInfo) => {
      return sum + (fileInfo.size || 0);
    }, 0);

    newFiles.forEach((fileInfo) => {
      if (allowedExtensions.length > 0) {
        const ext = this.#getFileExtension(fileInfo.name);
        const mimeType = fileInfo.file.type;

        if (!this.#isFileTypeAllowed(ext, mimeType, allowedExtensions)) {
          fileInfo.errors.push(this.#getMessage("error", "invalidType"));
        }
      }

      if (maxFileSize && fileInfo.size > maxFileSize) {
        const { size1: maxFormatted, size2: currentFormatted } =
          this.#formatSizeWithDiff(maxFileSize, fileInfo.size);
        fileInfo.errors.push(
          this.#getMessage("error", "maxFileSize", {
            max: maxFormatted,
            current: currentFormatted,
          }),
        );
      }
    });

    if (maxTotalSize && totalSize > maxTotalSize) {
      const { size1: maxFormatted, size2: currentFormatted } =
        this.#formatSizeWithDiff(maxTotalSize, totalSize);
      this.errors.push(
        this.#getMessage("error", "maxTotalSize", {
          max: maxFormatted,
          current: currentFormatted,
        }),
      );
    }

    const hasFileErrors = this.files.some((f) => f.errors?.length > 0);
    if (hasFileErrors) {
      this.errors.unshift(this.#getMessage("error", "hasFileErrors"));
    }
  }

  #parseAcceptAttribute(accept) {
    if (!accept) return [];
    return accept.split(",").map((s) => s.trim().toLowerCase());
  }

  #getFileExtension(filename) {
    const match = filename.match(/\.([^.]+)$/);
    return match ? `.${match[1].toLowerCase()}` : "";
  }

  #isFileTypeAllowed(ext, mimeType, allowedExtensions) {
    return allowedExtensions.some((allowed) => {
      if (allowed.includes("/*")) {
        const [category] = allowed.split("/");
        return mimeType.startsWith(`${category}/`);
      }
      if (allowed.startsWith(".")) {
        return ext === allowed;
      }
      return mimeType === allowed;
    });
  }

  #parseSize(sizeStr) {
    if (!sizeStr) return null;

    const units = {
      b: 1,
      kb: 1024,
      mb: 1024 * 1024,
      gb: 1024 * 1024 * 1024,
    };

    const match = sizeStr
      .toLowerCase()
      .match(/^(\d+(?:\.\d+)?)\s*(b|kb|mb|gb)?$/);
    if (!match) return null;

    const value = parseFloat(match[1]);
    const unit = match[2] || "b";

    return value * units[unit];
  }

  #formatSize(bytes, precision = null) {
    if (bytes === 0) return "0B";

    const units = ["B", "KB", "MB", "GB"];
    const k = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    const decimals = precision !== null ? precision : i > 0 ? 1 : 0;
    return `${parseFloat((bytes / k ** i).toFixed(decimals))}${units[i]}`;
  }

  #formatSizeWithDiff(bytes1, bytes2) {
    if (bytes1 === 0) return { size1: "0B", size2: this.#formatSize(bytes2) };
    if (bytes2 === 0) return { size1: this.#formatSize(bytes1), size2: "0B" };

    const units = ["B", "KB", "MB", "GB"];
    const k = 1024;
    const i1 = Math.floor(Math.log(bytes1) / Math.log(k));
    const i2 = Math.floor(Math.log(bytes2) / Math.log(k));

    const i = Math.max(i1, i2);
    const value1 = bytes1 / k ** i;
    const value2 = bytes2 / k ** i;

    if (i === 0 || value1 === value2) {
      const precision = i > 0 ? 1 : 0;
      return {
        size1: this.#formatSize(bytes1, precision),
        size2: this.#formatSize(bytes2, precision),
      };
    }

    let precision = 1;
    while (true) {
      const formatted1 = value1.toFixed(precision);
      const formatted2 = value2.toFixed(precision);
      if (formatted1 !== formatted2) {
        return {
          size1: `${parseFloat(formatted1)}${units[i]}`,
          size2: `${parseFloat(formatted2)}${units[i]}`,
        };
      }
      precision++;
    }
  }

  #updateUI() {
    this.#updateSelectedFilesMessage();
    this.#updateErrorMessages();
    this.#updateFileList();

    if (this.files.length === 0) {
      this.emptyMessage.removeAttribute("hidden");
      this.fileList.setAttribute("hidden", "");
    } else {
      this.emptyMessage.setAttribute("hidden", "");
      this.fileList.removeAttribute("hidden");
    }

    this.setAttribute("data-multiple", this.isMultiple ? "true" : "false");

    if (this.errors.length > 0) {
      this.setAttribute("data-has-error", "true");
    } else {
      this.removeAttribute("data-has-error");
    }
  }

  #updateSelectedFilesMessage() {
    if (this.files.length === 0) {
      this.selectSummary.textContent = "";
      return;
    }

    const currentFileCount = this.files.length;
    const currentTotalSize = this.files.reduce((sum, f) => sum + f.size, 0);
    const sizeFormatted = this.#formatSize(currentTotalSize);
    const sizeBytes = currentTotalSize.toLocaleString();

    const message = this.#getMessage("label", "selectedFiles", {
      count: currentFileCount,
      sizeFormatted: sizeFormatted,
      sizeBytes: sizeBytes,
    });

    this.selectSummary.textContent = message;
  }

  #updateErrorMessages() {
    this.errorMessagesContainer.innerHTML = "";

    for (const errorText of this.errors) {
      const li = document.createElement("li");
      li.textContent = `＊${errorText}`;
      this.errorMessagesContainer.appendChild(li);
    }
  }

  #updateFileList() {
    const newFiles = this.files.filter((f) => !f.element);

    newFiles.forEach((fileInfo) => {
      const li = this.#createFileItem(fileInfo);
      fileInfo.element = li;
      this.fileList.appendChild(li);
    });
  }

  #createFileItem(fileInfo) {
    const hasErrors = fileInfo.errors && fileInfo.errors.length > 0;

    const clone = this.fileItemTemplate.content.cloneNode(true);

    const slots = {
      fileName: fileInfo.name,
      fileSize: this.#formatSize(fileInfo.size),
      fileSizeBytes: fileInfo.size.toLocaleString(),
    };

    Object.entries(slots).forEach(([key, value]) => {
      const elements = clone.querySelectorAll(`[data-slot="${key}"]`);
      elements.forEach((element) => {
        element.textContent = value;
      });
    });

    const li = clone.firstElementChild;
    li.dataset.id = fileInfo.id;

    const fileNameElement = li.querySelector('[data-slot="fileName"]');
    const removeButton = li.querySelector("[data-js-remove-button]");

    if (fileNameElement && removeButton) {
      const nameId = `${fileInfo.id}-name`;
      const removeId = `${fileInfo.id}-remove`;

      fileNameElement.id = nameId;
      removeButton.id = removeId;
      removeButton.setAttribute("aria-labelledby", `${removeId} ${nameId}`);
    }

    if (hasErrors) {
      li.setAttribute("data-error", "true");

      const infoDiv = li.querySelector("[data-js-file-info]");
      if (infoDiv) {
        fileInfo.errors.forEach((errorText) => {
          const errorP = document.createElement("p");
          errorP.textContent = `＊${errorText}`;
          infoDiv.appendChild(errorP);
        });
      }
    }

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.name = this.fallbackInput.name;

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(fileInfo.file);
    fileInput.files = dataTransfer.files;

    li.appendChild(fileInput);

    return li;
  }

  get dropArea() {
    return this.querySelector("[data-js-drop-area]");
  }

  get fallbackInput() {
    return this.querySelector("[data-js-input]");
  }

  get selectButton() {
    return this.querySelector("[data-js-select-button]");
  }

  get emptyMessage() {
    return this.querySelector("[data-js-empty-message]");
  }

  get fileList() {
    return this.querySelector("[data-js-file-list]");
  }

  get errorMessagesContainer() {
    return this.querySelector("[data-js-error-messages]");
  }

  get fileItemTemplate() {
    return this.querySelector("[data-js-template]");
  }

  get expandDropAreaCheckbox() {
    return this.querySelector("[data-js-expand-drop-area]");
  }

  get announcer() {
    return this.querySelector("[data-js-announcer]");
  }

  get announcerAssertive() {
    return this.querySelector("[data-js-announcer-assertive]");
  }

  get selectSummary() {
    return this.querySelector("[data-js-select-summary]");
  }

  get isMultiple() {
    return this.fallbackInput.hasAttribute("multiple");
  }
}

customElements.define("dads-file-upload", FileUpload);

/* Utility Functions */

export function parseSize(sizeStr) {
  if (!sizeStr) return null;

  const units = {
    b: 1,
    kb: 1024,
    mb: 1024 * 1024,
    gb: 1024 * 1024 * 1024,
  };

  const match = sizeStr
    .toLowerCase()
    .match(/^(\d+(?:\.\d+)?)\s*(b|kb|mb|gb)?$/);
  if (!match) return null;

  const value = parseFloat(match[1]);
  const unit = match[2] || "b";

  return value * units[unit];
}

export function formatSize(bytes, precision = null) {
  if (bytes === 0) return "0B";

  const units = ["B", "KB", "MB", "GB"];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  const decimals = precision !== null ? precision : i > 0 ? 1 : 0;
  return `${parseFloat((bytes / k ** i).toFixed(decimals))}${units[i]}`;
}

export function formatSizeWithDiff(bytes1, bytes2) {
  if (bytes1 === 0) return { size1: "0B", size2: formatSize(bytes2) };
  if (bytes2 === 0) return { size1: formatSize(bytes1), size2: "0B" };

  const units = ["B", "KB", "MB", "GB"];
  const k = 1024;
  const i1 = Math.floor(Math.log(bytes1) / Math.log(k));
  const i2 = Math.floor(Math.log(bytes2) / Math.log(k));

  const i = Math.max(i1, i2);
  const value1 = bytes1 / k ** i;
  const value2 = bytes2 / k ** i;

  if (i === 0 || value1 === value2) {
    const precision = i > 0 ? 1 : 0;
    return {
      size1: formatSize(bytes1, precision),
      size2: formatSize(bytes2, precision),
    };
  }

  let precision = 1;
  while (true) {
    const formatted1 = value1.toFixed(precision);
    const formatted2 = value2.toFixed(precision);
    if (formatted1 !== formatted2) {
      return {
        size1: `${parseFloat(formatted1)}${units[i]}`,
        size2: `${parseFloat(formatted2)}${units[i]}`,
      };
    }
    precision++;
  }
}

export function parseAcceptAttribute(accept) {
  if (!accept) return [];
  return accept.split(",").map((s) => s.trim().toLowerCase());
}

export function getFileExtension(filename) {
  const match = filename.match(/\.([^.]+)$/);
  return match ? `.${match[1].toLowerCase()}` : "";
}

export function isFileTypeAllowed(ext, mimeType, allowedExtensions) {
  return allowedExtensions.some((allowed) => {
    if (allowed.includes("/*")) {
      const [category] = allowed.split("/");
      return mimeType.startsWith(`${category}/`);
    }
    if (allowed.startsWith(".")) {
      return ext === allowed;
    }
    return mimeType === allowed;
  });
}
