import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { page } from "vitest/browser";
import "./file-upload.js";

// ---------------------------------------------------------------------------
// テスト用の最小限のHTML。playground.html から独立させることで、
// バリデーション属性の手動削除が不要になり、テストの意図が明確になる。
// ---------------------------------------------------------------------------
const fileUploadHTML = (attrs = "", inputAttrs = "multiple") => `
<dads-file-upload class="dads-file-upload" ${attrs}>
  <input
    class="dads-file-upload__input"
    type="file"
    name="file-upload"
    ${inputAttrs}
    data-js-input
  >
  <div class="dads-u-visually-hidden" aria-live="polite" data-js-announcer></div>
  <div class="dads-u-visually-hidden" aria-live="assertive" data-js-announcer-assertive></div>
  <div class="dads-file-upload__inner">
    <div class="dads-file-upload__drop-area" data-js-drop-area>
      <div class="dads-file-upload__button-area">
        <button class="dads-button" type="button" data-js-select-button>ファイルを選択</button>
        <p>または、このエリア内にドラッグ＆ドロップ</p>
      </div>
      <p class="dads-file-upload__select-summary" data-js-select-summary></p>
      <ul class="dads-file-upload__error-messages" data-js-error-messages></ul>
      <p class="dads-file-upload__expand-drop-area">
        <label class="dads-checkbox" data-size="md">
          <span class="dads-checkbox__checkbox">
            <input class="dads-checkbox__input" type="checkbox" data-js-expand-drop-area>
          </span>
          <span class="dads-checkbox__label">ドラッグ＆ドロップの範囲をこのブラウザウィンドウ全体に広げる</span>
        </label>
      </p>
    </div>
    <p class="dads-file-upload__empty-message" data-js-empty-message>ファイルが選択されていません</p>
    <ul class="dads-file-upload__file-list" data-js-file-list hidden></ul>
  </div>
  <div class="dads-file-upload__viewport-overlay" data-js-viewport-overlay hidden>
    <div class="dads-file-upload__viewport-overlay-message">ドラッグ＆ドロップ</div>
  </div>
  <template data-js-template>
    <li class="dads-file-upload__file-item">
      <div class="dads-file-upload__file-marker"></div>
      <div class="dads-file-upload__file-info" data-js-file-info>
        <p>
          <span class="dads-file-upload__file-name" data-slot="fileName"></span>
          <span class="dads-file-upload__file-meta">
            <span data-slot="fileSize"></span>（<span data-slot="fileSizeBytes"></span>バイト）
          </span>
        </p>
      </div>
      <button class="dads-file-upload__remove-button dads-button" type="button" data-js-remove-button>解除</button>
    </li>
  </template>
</dads-file-upload>`;

// ---------------------------------------------------------------------------
// Setup / Teardown
// ---------------------------------------------------------------------------

afterEach(() => {
  document.body.innerHTML = "";
});

/**
 * FileUpload コンポーネントをマウントして返す。
 * @param {{ attrs?: string, inputAttrs?: string }} options
 */
const mount = (options = {}) => {
  const { attrs = "", inputAttrs = "multiple" } = options;
  document.body.innerHTML = fileUploadHTML(attrs, inputAttrs);
  return document.querySelector("dads-file-upload");
};

/**
 * 既存ファイルHTMLをリストに追加した状態でマウントする（サーバーから返却された既存ファイルを模倣）。
 */
const mountWithExistingFiles = (files, options = {}) => {
  const { attrs = "", inputAttrs = "multiple" } = options;
  document.body.innerHTML = fileUploadHTML(attrs, inputAttrs);

  const list = document.querySelector("[data-js-file-list]");
  for (const info of files) {
    const li = document.createElement("li");
    li.innerHTML = `
      <div data-js-file-info>
        <span data-slot="fileName">${info.name}</span>
        <span data-slot="fileSizeBytes">${info.sizeBytes}</span>
      </div>
      <button type="button" data-js-remove-button>解除</button>
    `;
    list.appendChild(li);
  }

  // Remove and re-add to trigger connectedCallback with existing items
  const el = document.querySelector("dads-file-upload");
  const parent = el.parentElement;
  el.remove();
  parent.appendChild(el);

  return document.querySelector("dads-file-upload");
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const fileUpload = () => document.querySelector("dads-file-upload");
const fileList = () => document.querySelector("[data-js-file-list]");
const fileItems = () => [
  ...document.querySelectorAll("[data-js-file-list] > li"),
];
const removeButtons = () => [
  ...document.querySelectorAll("[data-js-file-list] [data-js-remove-button]"),
];
const errorMessages = () => document.querySelector("[data-js-error-messages]");
const summary = () => document.querySelector("[data-js-select-summary]");
const emptyMessage = () => document.querySelector("[data-js-empty-message]");

/** Mock ファイルを作成して addFiles で追加する */
const addFiles = (fileInfos) => {
  const mockFiles = fileInfos.map(
    (info) =>
      new File([new ArrayBuffer(info.size)], info.name, {
        type: info.type || "application/octet-stream",
      }),
  );
  fileUpload().addFiles(mockFiles);
};

// ===========================================================================
// Tests
// ===========================================================================

describe("FileUpload", () => {
  // -------------------------------------------------------------------------
  // 初期化
  // -------------------------------------------------------------------------
  describe("初期化", () => {
    test("ファイル未選択時に空メッセージが表示される", () => {
      mount();
      expect(emptyMessage().hidden).toBe(false);
      expect(emptyMessage().textContent).toBe("ファイルが選択されていません");
      expect(fileList().hidden).toBe(true);
    });

    test("ファイル選択ボタンが表示される", async () => {
      mount();
      await expect
        .element(page.getByRole("button", { name: "ファイルを選択" }))
        .toBeVisible();
    });

    test("multiple 属性がある場合 data-multiple='true' が設定される", () => {
      mount();
      expect(fileUpload().getAttribute("data-multiple")).toBe("true");
    });

    test("multiple 属性がない場合 data-multiple='false' が設定される", () => {
      mount({ inputAttrs: "" });
      expect(fileUpload().getAttribute("data-multiple")).toBe("false");
    });

    test("初期状態で files 配列が空である", () => {
      mount();
      expect(fileUpload().files).toHaveLength(0);
    });

    test("初期状態で errors 配列が空である", () => {
      mount();
      expect(fileUpload().errors).toHaveLength(0);
    });
  });

  // -------------------------------------------------------------------------
  // ファイル選択ボタン
  // -------------------------------------------------------------------------
  describe("ファイル選択ボタン", () => {
    test("ボタンクリックで隠しファイル入力がトリガーされる", () => {
      mount();
      const input = document.querySelector("[data-js-input]");
      const clickHandler = vi.fn();
      input.addEventListener("click", clickHandler);

      page.getByRole("button", { name: "ファイルを選択" }).element().click();
      expect(clickHandler).toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // ファイル追加
  // -------------------------------------------------------------------------
  describe("ファイル追加", () => {
    test("単一ファイルを追加するとリストに表示される", () => {
      mount();
      addFiles([{ name: "photo.png", size: 1024, type: "image/png" }]);

      expect(fileList().hidden).toBe(false);
      expect(emptyMessage().hidden).toBe(true);
      expect(fileItems()).toHaveLength(1);
      expect(
        fileItems()[0].querySelector('[data-slot="fileName"]').textContent,
      ).toBe("photo.png");
    });

    test("複数ファイルを一度に追加できる", () => {
      mount();
      addFiles([
        { name: "file1.png", size: 1024, type: "image/png" },
        { name: "file2.jpg", size: 2048, type: "image/jpeg" },
        { name: "file3.pdf", size: 4096, type: "application/pdf" },
      ]);

      expect(fileItems()).toHaveLength(3);
      expect(fileUpload().files).toHaveLength(3);
    });

    test("追加でファイルを選択すると既存のファイルに追記される", () => {
      mount();
      addFiles([{ name: "first.png", size: 1024, type: "image/png" }]);
      addFiles([{ name: "second.jpg", size: 2048, type: "image/jpeg" }]);

      expect(fileItems()).toHaveLength(2);
      expect(fileUpload().files).toHaveLength(2);
    });

    test("files プロパティにファイル情報が格納される", () => {
      mount();
      addFiles([{ name: "doc.pdf", size: 5000, type: "application/pdf" }]);

      const info = fileUpload().files[0];
      expect(info.name).toBe("doc.pdf");
      expect(info.size).toBe(5000);
      expect(info.isExisting).toBe(false);
      expect(info.id).toMatch(/^file-/);
    });
  });

  // -------------------------------------------------------------------------
  // 選択サマリー表示
  // -------------------------------------------------------------------------
  describe("選択サマリー", () => {
    test("ファイル数とサイズが表示される", () => {
      mount();
      addFiles([
        { name: "file1.png", size: 1048576, type: "image/png" },
        { name: "file2.jpg", size: 2097152, type: "image/jpeg" },
      ]);

      expect(summary().textContent).toContain("選択中：2個");
      expect(summary().textContent).toContain("3MB");
      expect(summary().textContent).toContain("3,145,728バイト");
    });

    test("ファイルゼロ件の時はサマリーが空になる", () => {
      mount();
      addFiles([{ name: "file.png", size: 1024, type: "image/png" }]);
      removeButtons()[0].click();

      expect(summary().textContent).toBe("");
    });
  });

  // -------------------------------------------------------------------------
  // ファイルサイズ表示
  // -------------------------------------------------------------------------
  describe("ファイルサイズ表示", () => {
    test("バイト単位が正しくフォーマットされる", () => {
      mount();
      addFiles([{ name: "tiny.png", size: 500, type: "image/png" }]);

      expect(
        fileItems()[0].querySelector('[data-slot="fileSize"]').textContent,
      ).toBe("500B");
    });

    test("KB単位が正しくフォーマットされる", () => {
      mount();
      addFiles([{ name: "medium.png", size: 512 * 1024, type: "image/png" }]);

      expect(
        fileItems()[0].querySelector('[data-slot="fileSize"]').textContent,
      ).toBe("512KB");
    });

    test("MB単位が正しくフォーマットされる", () => {
      mount();
      addFiles([
        { name: "large.png", size: 2 * 1024 * 1024, type: "image/png" },
      ]);

      expect(
        fileItems()[0].querySelector('[data-slot="fileSize"]').textContent,
      ).toBe("2MB");
    });

    test("バイト数がカンマ区切りで表示される", () => {
      mount();
      addFiles([{ name: "file.png", size: 1234567, type: "image/png" }]);

      expect(
        fileItems()[0].querySelector('[data-slot="fileSizeBytes"]').textContent,
      ).toBe("1,234,567");
    });
  });

  // -------------------------------------------------------------------------
  // ファイル削除
  // -------------------------------------------------------------------------
  describe("ファイル削除", () => {
    test("解除ボタンでファイルが削除される", () => {
      mount();
      addFiles([
        { name: "file1.png", size: 1024, type: "image/png" },
        { name: "file2.jpg", size: 2048, type: "image/jpeg" },
      ]);

      removeButtons()[0].click();

      expect(fileItems()).toHaveLength(1);
      expect(fileUpload().files).toHaveLength(1);
      expect(fileUpload().files[0].name).toBe("file2.jpg");
    });

    test("全ファイル削除で空メッセージが再表示される", () => {
      mount();
      addFiles([{ name: "file.png", size: 1024, type: "image/png" }]);
      removeButtons()[0].click();

      expect(emptyMessage().hidden).toBe(false);
      expect(fileList().hidden).toBe(true);
      expect(fileUpload().files).toHaveLength(0);
    });

    test("中間ファイル削除後に次のファイルの解除ボタンにフォーカスが移る", () => {
      mount();
      addFiles([
        { name: "file1.png", size: 1024, type: "image/png" },
        { name: "file2.jpg", size: 2048, type: "image/jpeg" },
        { name: "file3.pdf", size: 4096, type: "application/pdf" },
      ]);

      // 2番目を削除
      removeButtons()[1].click();

      // 元3番目（新2番目）の解除ボタンにフォーカス
      expect(document.activeElement).toBe(removeButtons()[1]);
    });

    test("最後のファイル削除後に前のファイルの解除ボタンにフォーカスが移る", () => {
      mount();
      addFiles([
        { name: "file1.png", size: 1024, type: "image/png" },
        { name: "file2.jpg", size: 2048, type: "image/jpeg" },
      ]);

      removeButtons()[1].click();

      expect(document.activeElement).toBe(removeButtons()[0]);
    });

    test("全ファイル削除後に選択ボタンにフォーカスが移る", async () => {
      mount();
      addFiles([{ name: "file.png", size: 1024, type: "image/png" }]);
      removeButtons()[0].click();

      await expect
        .element(page.getByRole("button", { name: "ファイルを選択" }))
        .toHaveFocus();
    });

    test("removeFile メソッドでプログラム的に削除できる", () => {
      mount();
      addFiles([
        { name: "file1.png", size: 1024, type: "image/png" },
        { name: "file2.jpg", size: 2048, type: "image/jpeg" },
      ]);

      const fileId = fileUpload().files[0].id;
      fileUpload().removeFile(fileId);

      expect(fileUpload().files).toHaveLength(1);
      expect(fileUpload().files[0].name).toBe("file2.jpg");
    });

    test("存在しない ID で removeFile を呼んでもエラーにならない", () => {
      mount();
      addFiles([{ name: "file.png", size: 1024, type: "image/png" }]);

      expect(() => fileUpload().removeFile("nonexistent-id")).not.toThrow();
      expect(fileUpload().files).toHaveLength(1);
    });
  });

  // -------------------------------------------------------------------------
  // アクセシビリティ（解除ボタン）
  // -------------------------------------------------------------------------
  describe("解除ボタンのアクセシビリティ", () => {
    test("aria-labelledby がボタンIDとファイル名IDを参照する", () => {
      mount();
      addFiles([{ name: "report.pdf", size: 1024, type: "application/pdf" }]);

      const btn = removeButtons()[0];
      const labelledby = btn.getAttribute("aria-labelledby");

      // 形式: "{fileId}-remove {fileId}-name"
      expect(labelledby).toMatch(/^file-.+-remove file-.+-name$/);

      // 参照先の要素が実在する
      const [removeId, nameId] = labelledby.split(" ");
      expect(document.getElementById(removeId)).toBe(btn);
      expect(document.getElementById(nameId).textContent).toBe("report.pdf");
    });
  });

  // -------------------------------------------------------------------------
  // バリデーション: max-files
  // -------------------------------------------------------------------------
  describe("バリデーション: max-files", () => {
    test("上限超過時にエラーメッセージが表示される", () => {
      mount({ attrs: 'max-files="2"' });
      addFiles([
        { name: "file1.png", size: 1024, type: "image/png" },
        { name: "file2.png", size: 1024, type: "image/png" },
        { name: "file3.png", size: 1024, type: "image/png" },
      ]);

      expect(errorMessages().textContent).toContain(
        "選択できるファイル数が上限を超過しています",
      );
      expect(fileUpload().getAttribute("data-has-error")).toBe("true");
    });

    test("上限以内ではエラーが表示されない", () => {
      mount({ attrs: 'max-files="3"' });
      addFiles([
        { name: "file1.png", size: 1024, type: "image/png" },
        { name: "file2.png", size: 1024, type: "image/png" },
        { name: "file3.png", size: 1024, type: "image/png" },
      ]);

      expect(fileUpload().hasAttribute("data-has-error")).toBe(false);
      expect(fileUpload().errors).toHaveLength(0);
    });

    test("ファイル削除で上限以内に戻るとエラーがクリアされる", () => {
      mount({ attrs: 'max-files="2"' });
      addFiles([
        { name: "file1.png", size: 1024, type: "image/png" },
        { name: "file2.png", size: 1024, type: "image/png" },
        { name: "file3.png", size: 1024, type: "image/png" },
      ]);

      expect(fileUpload().errors.length).toBeGreaterThan(0);

      removeButtons()[0].click();

      expect(fileUpload().errors).toHaveLength(0);
      expect(fileUpload().hasAttribute("data-has-error")).toBe(false);
    });
  });

  // -------------------------------------------------------------------------
  // バリデーション: max-total-size
  // -------------------------------------------------------------------------
  describe("バリデーション: max-total-size", () => {
    test("合計サイズ超過時にエラーメッセージが表示される", () => {
      mount({ attrs: 'max-total-size="10MB"' });
      addFiles([
        { name: "big1.png", size: 6 * 1024 * 1024, type: "image/png" },
        { name: "big2.png", size: 6 * 1024 * 1024, type: "image/png" },
      ]);

      expect(errorMessages().textContent).toContain(
        "選択できるファイルサイズの合計が上限を超過しています",
      );
      expect(fileUpload().errors).toEqual(
        expect.arrayContaining([expect.stringContaining("合計が上限を超過")]),
      );
    });

    test("合計サイズが上限以内ではエラーが表示されない", () => {
      mount({ attrs: 'max-total-size="10MB"' });
      addFiles([
        { name: "ok1.png", size: 4 * 1024 * 1024, type: "image/png" },
        { name: "ok2.png", size: 4 * 1024 * 1024, type: "image/png" },
      ]);

      expect(fileUpload().hasAttribute("data-has-error")).toBe(false);
    });
  });

  // -------------------------------------------------------------------------
  // バリデーション: max-file-size
  // -------------------------------------------------------------------------
  describe("バリデーション: max-file-size", () => {
    test("個別ファイルサイズ超過時にファイルレベルエラーが表示される", () => {
      mount({ attrs: 'max-file-size="5MB"' });
      addFiles([
        { name: "huge.png", size: 6 * 1024 * 1024, type: "image/png" },
      ]);

      const item = fileItems()[0];
      expect(item.getAttribute("data-error")).toBe("true");
      expect(item.querySelector("[data-js-file-info]").textContent).toContain(
        "ファイルサイズが上限を超過しています",
      );

      // グローバルエラーにも「エラーがあります」が含まれる
      expect(errorMessages().textContent).toContain(
        "選択したファイルにエラーがあります",
      );
    });

    test("上限以内のファイルにはエラーが付かない", () => {
      mount({ attrs: 'max-file-size="5MB"' });
      addFiles([{ name: "ok.png", size: 4 * 1024 * 1024, type: "image/png" }]);

      expect(fileItems()[0].hasAttribute("data-error")).toBe(false);
      expect(fileUpload().hasAttribute("data-has-error")).toBe(false);
    });

    test("files プロパティの errors 配列にエラーが格納される", () => {
      mount({ attrs: 'max-file-size="5MB"' });
      addFiles([
        { name: "huge.png", size: 6 * 1024 * 1024, type: "image/png" },
      ]);

      expect(fileUpload().files[0].errors.length).toBeGreaterThan(0);
      expect(fileUpload().files[0].errors[0]).toContain(
        "ファイルサイズが上限を超過",
      );
    });
  });

  // -------------------------------------------------------------------------
  // バリデーション: accept（ファイル形式）
  // -------------------------------------------------------------------------
  describe("バリデーション: ファイル形式", () => {
    test("許可されていない拡張子のファイルにエラーが付く", () => {
      mount({ inputAttrs: 'multiple accept=".png,.jpg,.pdf"' });
      addFiles([
        { name: "malware.exe", size: 1024, type: "application/x-msdownload" },
      ]);

      const item = fileItems()[0];
      expect(item.getAttribute("data-error")).toBe("true");
      expect(item.querySelector("[data-js-file-info]").textContent).toContain(
        "許可されていないファイル形式です",
      );
    });

    test("許可された拡張子のファイルにはエラーが付かない", () => {
      mount({ inputAttrs: 'multiple accept=".png,.jpg,.pdf"' });
      addFiles([{ name: "photo.png", size: 1024, type: "image/png" }]);

      expect(fileItems()[0].hasAttribute("data-error")).toBe(false);
    });

    test("MIME タイプワイルドカード（image/*）で判定できる", () => {
      mount({ inputAttrs: 'multiple accept="image/*"' });
      addFiles([
        { name: "photo.webp", size: 1024, type: "image/webp" },
        { name: "doc.pdf", size: 1024, type: "application/pdf" },
      ]);

      expect(fileItems()[0].hasAttribute("data-error")).toBe(false);
      expect(fileItems()[1].getAttribute("data-error")).toBe("true");
    });
  });

  // -------------------------------------------------------------------------
  // カスタムエラーメッセージ（data属性）
  // -------------------------------------------------------------------------
  describe("カスタムエラーメッセージ", () => {
    test("data-error-invalid-type でファイル形式エラーメッセージをカスタマイズできる", () => {
      mount({
        attrs: 'data-error-invalid-type="PNG/JPEGだけが選択できます。"',
        inputAttrs: 'multiple accept=".png,.jpg"',
      });
      addFiles([
        { name: "file.exe", size: 1024, type: "application/x-msdownload" },
      ]);

      const item = fileItems()[0];
      expect(item.querySelector("[data-js-file-info]").textContent).toContain(
        "PNG/JPEGだけが選択できます。",
      );
    });
  });

  // -------------------------------------------------------------------------
  // 複合バリデーション
  // -------------------------------------------------------------------------
  describe("複合バリデーション", () => {
    test("複数のグローバルエラーが同時に表示される", () => {
      mount({
        attrs: 'max-files="2"',
        inputAttrs: 'multiple accept=".png"',
      });
      addFiles([
        { name: "file1.png", size: 1024, type: "image/png" },
        { name: "file2.png", size: 1024, type: "image/png" },
        { name: "bad.exe", size: 1024, type: "application/x-msdownload" },
      ]);

      const errorItems = errorMessages().querySelectorAll("li");
      // "ファイルにエラーがあります" + "ファイル数が上限"
      expect(errorItems.length).toBe(2);
    });

    test("errors プロパティにすべてのグローバルエラーが格納される", () => {
      mount({ attrs: 'max-files="1" max-total-size="1KB"' });
      addFiles([
        { name: "file1.png", size: 2048, type: "image/png" },
        { name: "file2.png", size: 2048, type: "image/png" },
      ]);

      // max-files + max-total-size の2つ
      expect(fileUpload().errors.length).toBeGreaterThanOrEqual(2);
    });
  });

  // -------------------------------------------------------------------------
  // 単一ファイルモード
  // -------------------------------------------------------------------------
  describe("単一ファイルモード", () => {
    test("ファイルを追加すると前のファイルが置き換えられる", () => {
      mount({ inputAttrs: "" }); // multiple なし

      addFiles([{ name: "first.png", size: 1024, type: "image/png" }]);
      expect(fileItems()).toHaveLength(1);
      expect(fileUpload().files[0].name).toBe("first.png");

      addFiles([{ name: "second.png", size: 2048, type: "image/png" }]);
      expect(fileItems()).toHaveLength(1);
      expect(fileUpload().files[0].name).toBe("second.png");
    });

    test("複数ファイルを渡しても最初の1つだけ保持される", () => {
      mount({ inputAttrs: "" });

      addFiles([
        { name: "file1.png", size: 1024, type: "image/png" },
        { name: "file2.png", size: 2048, type: "image/png" },
      ]);

      expect(fileItems()).toHaveLength(1);
      expect(fileUpload().files[0].name).toBe("file1.png");
    });
  });

  // -------------------------------------------------------------------------
  // 既存ファイル（サーバーから返却されたHTMLに含まれるファイル）
  // -------------------------------------------------------------------------
  describe("既存ファイル", () => {
    test("HTMLに記述された既存ファイルが読み込まれる", () => {
      mountWithExistingFiles([
        { name: "既存ファイル1.jpg", sizeBytes: "1,572,864" },
        { name: "既存ファイル2.pdf", sizeBytes: "2,411,724" },
      ]);

      expect(fileItems()).toHaveLength(2);
      expect(fileUpload().files).toHaveLength(2);
      expect(fileUpload().files[0].name).toBe("既存ファイル1.jpg");
      expect(fileUpload().files[0].isExisting).toBe(true);
      expect(fileUpload().files[0].size).toBe(1572864);
    });

    test("既存ファイルの選択サマリーが表示される", () => {
      mountWithExistingFiles([
        { name: "file1.jpg", sizeBytes: "1,048,576" },
        { name: "file2.pdf", sizeBytes: "2,097,152" },
      ]);

      expect(summary().textContent).toContain("選択中：2個");
    });

    test("既存ファイルを削除できる", () => {
      mountWithExistingFiles([
        { name: "file1.jpg", sizeBytes: "1,048,576" },
        { name: "file2.pdf", sizeBytes: "2,097,152" },
      ]);

      removeButtons()[0].click();

      expect(fileItems()).toHaveLength(1);
      expect(fileUpload().files).toHaveLength(1);
      expect(fileUpload().files[0].name).toBe("file2.pdf");
    });

    test("既存ファイルに新規ファイルを追加できる", () => {
      mountWithExistingFiles([
        { name: "existing.jpg", sizeBytes: "1,048,576" },
      ]);

      addFiles([{ name: "new-file.png", size: 2048, type: "image/png" }]);

      expect(fileItems()).toHaveLength(2);
      expect(fileUpload().files).toHaveLength(2);
      expect(summary().textContent).toContain("選択中：2個");
    });

    test("既存ファイルにはバリデーションエラーが付与されない", () => {
      mountWithExistingFiles([{ name: "legacy.exe", sizeBytes: "1,048,576" }], {
        inputAttrs: 'multiple accept=".png"',
      });

      // 既存ファイルは accept 制約を受けない
      expect(fileItems()[0].hasAttribute("data-error")).toBe(false);
    });

    test("既存ファイルの解除ボタンに aria-labelledby が設定される", () => {
      mountWithExistingFiles([{ name: "test.jpg", sizeBytes: "512,000" }]);

      const btn = removeButtons()[0];
      const labelledby = btn.getAttribute("aria-labelledby");

      expect(labelledby).toMatch(/^file-.+-remove file-.+-name$/);
      const [removeId, nameId] = labelledby.split(" ");
      expect(document.getElementById(removeId)).toBe(btn);
      expect(document.getElementById(nameId).textContent).toBe("test.jpg");
    });
  });

  // -------------------------------------------------------------------------
  // ライフサイクル
  // -------------------------------------------------------------------------
  describe("ライフサイクル", () => {
    test("DOM から削除した後に再接続しても正常に動作する", () => {
      mount();
      addFiles([{ name: "file.png", size: 1024, type: "image/png" }]);

      const el = fileUpload();
      const parent = el.parentElement;
      el.remove();
      parent.appendChild(el);

      // 再接続後も追加・削除が可能
      addFiles([{ name: "new.png", size: 2048, type: "image/png" }]);
      expect(fileUpload().files.length).toBeGreaterThanOrEqual(1);
    });
  });
});
