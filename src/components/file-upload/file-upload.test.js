import path from "node:path";
import { test, expect } from "@playwright/test";
import { resetCssVrt } from "../../../tests/helpers/reset-css-vrt";

const { dirname } = import.meta;

resetCssVrt("file-upload-playground", path.join(dirname, "playground.html"));
resetCssVrt(
  "file-upload-with-existing-files",
  path.join(dirname, "with-existing-files.html"),
);

// ヘルパー関数: FileUploadコンポーネントをセットアップ
const setupFileUpload = async (page, fileName = "playground.html") => {
  await page.goto(`file://${path.join(dirname, fileName)}`);

  // デフォルトでバリデーション属性を削除
  await page.evaluate(() => {
    const fileUpload = document.querySelector("dads-file-upload");
    fileUpload.removeAttribute("max-files");
    fileUpload.removeAttribute("max-file-size");
    fileUpload.removeAttribute("max-total-size");
    fileUpload.removeAttribute("data-error-invalid-type");
    const input = fileUpload.querySelector("[data-js-input]");
    input.removeAttribute("accept");
  });
};

// ヘルパー関数: addFilesメソッドを使用してファイルを追加
const addMockFiles = async (page, files) => {
  await page.evaluate((fileInfos) => {
    const fileUpload = document.querySelector("dads-file-upload");
    const mockFiles = fileInfos.map((info) => {
      const file = new File([new ArrayBuffer(info.size)], info.name, {
        type: info.type || "application/octet-stream",
      });
      return file;
    });
    fileUpload.addFiles(mockFiles);
  }, files);
};

// ヘルパー関数: 既存ファイルのHTMLを動的に追加
const addExistingFileHTML = async (page, files) => {
  await page.evaluate((fileInfos) => {
    const fileList = document.querySelector("[data-js-file-list]");
    fileList.innerHTML = "";

    fileInfos.forEach((info) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <div data-js-file-info>
          <span data-slot="fileName">${info.name}</span>
          <span data-slot="fileSizeBytes">${info.sizeBytes}</span>
        </div>
        <button type="button" data-js-remove-button>解除</button>
      `;
      fileList.appendChild(li);
    });
  }, files);
};

// ヘルパー関数: コンポーネントを再初期化（既存ファイルを読み込むため）
const reinitializeComponent = async (page) => {
  await page.evaluate(() => {
    const fileUpload = document.querySelector("dads-file-upload");
    // disconnectedCallbackを呼び出してクリーンアップ
    fileUpload.remove();
    // 再度DOMに追加してconnectedCallbackをトリガー
    document
      .querySelector(".dads-form-control-label > div")
      .appendChild(fileUpload);
  });
};

// 機能テスト
test.describe("FileUpload 機能テスト", () => {
  test.describe("基本的な初期化とライフサイクル", () => {
    test("適切に初期化されるべき", async ({ page }) => {
      await setupFileUpload(page);

      const fileUpload = page.locator("dads-file-upload");
      await expect(fileUpload).toBeVisible();

      const fileInput = page.locator("[data-js-input]");
      const selectButton = page.getByRole("button", { name: "ファイルを選択" });
      const emptyMessage = page.locator("[data-js-empty-message]");
      const fileList = page.locator("[data-js-file-list]");

      await expect(fileInput).toBeAttached();
      await expect(selectButton).toBeVisible();
      await expect(emptyMessage).toBeVisible();
      await expect(emptyMessage).toHaveText("ファイルが選択されていません");
      await expect(fileList).not.toBeVisible();
    });

    test("multiple属性がある場合にdata-multiple属性が設定されるべき", async ({
      page,
    }) => {
      await setupFileUpload(page);

      const fileUpload = page.locator("dads-file-upload");
      await expect(fileUpload).toHaveAttribute("data-multiple", "true");
    });
  });

  test.describe("ファイル選択機能", () => {
    test("ボタンクリックでファイル入力がトリガーされるべき", async ({
      page,
    }) => {
      await setupFileUpload(page);

      const selectButton = page.getByRole("button", { name: "ファイルを選択" });

      // ファイル入力のクリックイベントを監視
      const clickPromise = page.evaluate(() => {
        return new Promise((resolve) => {
          const input = document.querySelector("[data-js-input]");
          input.addEventListener("click", () => resolve(true), { once: true });
        });
      });

      await selectButton.click();
      const wasClicked = await clickPromise;
      expect(wasClicked).toBe(true);
    });

    test("単一ファイルを選択できるべき", async ({ page }) => {
      await setupFileUpload(page);

      await addMockFiles(page, [
        { name: "test-file.png", size: 1024, type: "image/png" },
      ]);

      const fileList = page.locator("[data-js-file-list]");
      const emptyMessage = page.locator("[data-js-empty-message]");
      const fileItems = page.locator("[data-js-file-list] > li");

      await expect(fileList).toBeVisible();
      await expect(emptyMessage).not.toBeVisible();
      await expect(fileItems).toHaveCount(1);
      await expect(fileItems.locator('[data-slot="fileName"]')).toHaveText(
        "test-file.png",
      );
    });

    test("複数ファイルを選択できるべき", async ({ page }) => {
      await setupFileUpload(page);

      await addMockFiles(page, [
        { name: "file1.png", size: 1024, type: "image/png" },
        { name: "file2.jpg", size: 2048, type: "image/jpeg" },
        { name: "file3.pdf", size: 4096, type: "application/pdf" },
      ]);

      const fileItems = page.locator("[data-js-file-list] > li");
      await expect(fileItems).toHaveCount(3);
    });

    test("選択ファイル数とサイズが表示されるべき", async ({ page }) => {
      await setupFileUpload(page);

      await addMockFiles(page, [
        { name: "file1.png", size: 1048576, type: "image/png" }, // 1MB
        { name: "file2.jpg", size: 2097152, type: "image/jpeg" }, // 2MB
      ]);

      const selectedFilesMessage = page.locator("[data-js-select-summary]");
      await expect(selectedFilesMessage).toContainText("選択中：2個");
      await expect(selectedFilesMessage).toContainText("3MB");
      await expect(selectedFilesMessage).toContainText("3,145,728バイト");
    });

    test("ファイル選択後にボタンにフォーカスが戻るべき", async ({ page }) => {
      await setupFileUpload(page);

      const selectButton = page.getByRole("button", { name: "ファイルを選択" });

      // setInputFilesを使用して実際のファイル選択をシミュレート
      const fileInput = page.locator("[data-js-input]");
      await fileInput.setInputFiles({
        name: "test.png",
        mimeType: "image/png",
        buffer: Buffer.from("fake image content"),
      });

      await expect(selectButton).toBeFocused();
    });
  });

  test.describe("ファイル削除機能", () => {
    test("解除ボタンでファイルを削除できるべき", async ({ page }) => {
      await setupFileUpload(page);

      await addMockFiles(page, [
        { name: "file1.png", size: 1024, type: "image/png" },
        { name: "file2.jpg", size: 2048, type: "image/jpeg" },
      ]);

      const fileItems = page.locator("[data-js-file-list] > li");
      await expect(fileItems).toHaveCount(2);

      // 最初のファイルを削除
      const removeButton = fileItems
        .first()
        .getByRole("button", { name: /解除/ });
      await removeButton.click();

      await expect(fileItems).toHaveCount(1);
      await expect(
        fileItems.first().locator('[data-slot="fileName"]'),
      ).toHaveText("file2.jpg");
    });

    test("すべてのファイルを削除すると空メッセージが表示されるべき", async ({
      page,
    }) => {
      await setupFileUpload(page);

      await addMockFiles(page, [
        { name: "file1.png", size: 1024, type: "image/png" },
      ]);

      const removeButton = page.getByRole("button", { name: /解除/ });
      await removeButton.click();

      const emptyMessage = page.locator("[data-js-empty-message]");
      const fileList = page.locator("[data-js-file-list]");

      await expect(emptyMessage).toBeVisible();
      await expect(fileList).not.toBeVisible();
    });

    test("ファイル削除後に次のファイルの解除ボタンにフォーカスが移動するべき", async ({
      page,
    }) => {
      await setupFileUpload(page);

      await addMockFiles(page, [
        { name: "file1.png", size: 1024, type: "image/png" },
        { name: "file2.jpg", size: 2048, type: "image/jpeg" },
        { name: "file3.pdf", size: 4096, type: "application/pdf" },
      ]);

      const fileItems = page.locator("[data-js-file-list] > li");

      // 2番目のファイルを削除
      const secondRemoveButton = fileItems
        .nth(1)
        .getByRole("button", { name: /解除/ });
      await secondRemoveButton.click();

      // 次のファイル（元の3番目、現在の2番目）の解除ボタンにフォーカスが移動するべき
      const newSecondRemoveButton = fileItems
        .nth(1)
        .getByRole("button", { name: /解除/ });
      await expect(newSecondRemoveButton).toBeFocused();
    });

    test("最後のファイル削除後に前のファイルの解除ボタンにフォーカスが移動するべき", async ({
      page,
    }) => {
      await setupFileUpload(page);

      await addMockFiles(page, [
        { name: "file1.png", size: 1024, type: "image/png" },
        { name: "file2.jpg", size: 2048, type: "image/jpeg" },
      ]);

      const fileItems = page.locator("[data-js-file-list] > li");

      // 最後のファイルを削除
      const lastRemoveButton = fileItems
        .last()
        .getByRole("button", { name: /解除/ });
      await lastRemoveButton.click();

      // 前のファイル（現在最後）の解除ボタンにフォーカスが移動するべき
      const remainingRemoveButton = fileItems
        .first()
        .getByRole("button", { name: /解除/ });
      await expect(remainingRemoveButton).toBeFocused();
    });

    test("全ファイル削除後に選択ボタンにフォーカスが移動するべき", async ({
      page,
    }) => {
      await setupFileUpload(page);

      await addMockFiles(page, [
        { name: "file1.png", size: 1024, type: "image/png" },
      ]);

      const removeButton = page.getByRole("button", { name: /解除/ });
      await removeButton.click();

      const selectButton = page.getByRole("button", { name: "ファイルを選択" });
      await expect(selectButton).toBeFocused();
    });

    test("解除ボタンのaria-labelledbyが正しく設定されるべき", async ({
      page,
    }) => {
      await setupFileUpload(page);

      await addMockFiles(page, [
        { name: "test-file.png", size: 1024, type: "image/png" },
      ]);

      const removeButton = page.getByRole("button", { name: /解除/ });
      const ariaLabelledby = await removeButton.getAttribute("aria-labelledby");

      // aria-labelledbyにボタンIDとファイル名IDが含まれるべき
      expect(ariaLabelledby).toMatch(/file-\w+-remove/);
      expect(ariaLabelledby).toMatch(/file-\w+-name/);
    });
  });

  test.describe("バリデーション機能", () => {
    test("max-files超過時にエラーメッセージが表示されるべき", async ({
      page,
    }) => {
      await setupFileUpload(page);

      // max-files属性を設定
      await page.evaluate(() => {
        const fileUpload = document.querySelector("dads-file-upload");
        fileUpload.setAttribute("max-files", "5");
      });

      // 6ファイル追加
      await addMockFiles(page, [
        { name: "file1.png", size: 1024, type: "image/png" },
        { name: "file2.png", size: 1024, type: "image/png" },
        { name: "file3.png", size: 1024, type: "image/png" },
        { name: "file4.png", size: 1024, type: "image/png" },
        { name: "file5.png", size: 1024, type: "image/png" },
        { name: "file6.png", size: 1024, type: "image/png" },
      ]);

      const errorMessages = page.locator("[data-js-error-messages]");
      await expect(errorMessages).toContainText(
        "＊選択できるファイル数が上限を超過しています",
      );

      const fileUpload = page.locator("dads-file-upload");
      await expect(fileUpload).toHaveAttribute("data-has-error", "true");
    });

    test("max-total-size超過時にエラーメッセージが表示されるべき", async ({
      page,
    }) => {
      await setupFileUpload(page);

      // max-total-size属性を設定
      await page.evaluate(() => {
        const fileUpload = document.querySelector("dads-file-upload");
        fileUpload.setAttribute("max-total-size", "10MB");
      });

      // 合計12MB追加
      await addMockFiles(page, [
        { name: "large1.png", size: 6 * 1024 * 1024, type: "image/png" }, // 6MB
        { name: "large2.png", size: 6 * 1024 * 1024, type: "image/png" }, // 6MB
      ]);

      const errorMessages = page.locator("[data-js-error-messages]");
      await expect(errorMessages).toContainText(
        "＊選択できるファイルサイズの合計が上限を超過しています",
      );
    });

    test("max-file-size超過時にファイルレベルエラーが表示されるべき", async ({
      page,
    }) => {
      await setupFileUpload(page);

      // max-file-size属性を設定
      await page.evaluate(() => {
        const fileUpload = document.querySelector("dads-file-upload");
        fileUpload.setAttribute("max-file-size", "10MB");
      });

      // 11MBファイル追加
      await addMockFiles(page, [
        { name: "huge-file.png", size: 11 * 1024 * 1024, type: "image/png" },
      ]);

      const fileItem = page.locator("[data-js-file-list] > li");
      await expect(fileItem).toHaveAttribute("data-error", "true");

      const fileInfo = fileItem.locator("[data-js-file-info]");
      await expect(fileInfo).toContainText(
        "＊ファイルサイズが上限を超過しています",
      );

      // グローバルエラーも表示されるべき
      const errorMessages = page.locator("[data-js-error-messages]");
      await expect(errorMessages).toContainText(
        "＊選択したファイルにエラーがあります",
      );
    });

    test("accept属性（拡張子指定）で許可されていないファイル形式でエラーが表示されるべき", async ({
      page,
    }) => {
      await setupFileUpload(page);

      // accept属性を設定（拡張子指定）
      await page.evaluate(() => {
        const input = document.querySelector("[data-js-input]");
        input.setAttribute("accept", ".png,.jpg,.pdf");
      });

      // 許可されていない形式
      await addMockFiles(page, [
        { name: "malware.exe", size: 1024, type: "application/x-msdownload" },
      ]);

      const fileItem = page.locator("[data-js-file-list] > li");
      await expect(fileItem).toHaveAttribute("data-error", "true");

      const fileInfo = fileItem.locator("[data-js-file-info]");
      await expect(fileInfo).toContainText(
        "＊許可されていないファイル形式です",
      );
    });

    test("エラーがない場合はdata-has-error属性がないべき", async ({ page }) => {
      await setupFileUpload(page);

      await addMockFiles(page, [
        { name: "valid.png", size: 1024, type: "image/png" },
      ]);

      const fileUpload = page.locator("dads-file-upload");
      await expect(fileUpload).not.toHaveAttribute("data-has-error");
    });

    test("ファイル削除後にバリデーションが再実行されるべき", async ({
      page,
    }) => {
      await setupFileUpload(page);

      // max-files属性を設定
      await page.evaluate(() => {
        const fileUpload = document.querySelector("dads-file-upload");
        fileUpload.setAttribute("max-files", "5");
      });

      // 6ファイル追加（max-files超過）
      await addMockFiles(page, [
        { name: "file1.png", size: 1024, type: "image/png" },
        { name: "file2.png", size: 1024, type: "image/png" },
        { name: "file3.png", size: 1024, type: "image/png" },
        { name: "file4.png", size: 1024, type: "image/png" },
        { name: "file5.png", size: 1024, type: "image/png" },
        { name: "file6.png", size: 1024, type: "image/png" },
      ]);

      const errorMessages = page.locator("[data-js-error-messages]");
      await expect(errorMessages).toContainText(
        "＊選択できるファイル数が上限を超過しています",
      );

      // 1ファイル削除して5ファイルに
      const removeButton = page
        .locator("[data-js-file-list] > li")
        .first()
        .getByRole("button", { name: /解除/ });
      await removeButton.click();

      // エラーが解消されるべき
      await expect(errorMessages).toBeEmpty();

      const fileUpload = page.locator("dads-file-upload");
      await expect(fileUpload).not.toHaveAttribute("data-has-error");
    });
  });

  test.describe("既存ファイルの読み込み", () => {
    test("HTMLに記述された既存ファイルが読み込まれるべき", async ({ page }) => {
      await setupFileUpload(page);

      // 既存ファイルのHTMLを動的に追加
      await addExistingFileHTML(page, [
        {
          name: "既存ファイル1.jpg",
          sizeBytes: "1,572,864",
        },
        {
          name: "既存ファイル2.pdf",
          sizeBytes: "2,411,724",
        },
      ]);

      // コンポーネントを再初期化して既存ファイルを読み込む
      await reinitializeComponent(page);

      const fileItems = page.locator("[data-js-file-list] > li");
      await expect(fileItems).toHaveCount(2);

      const firstFileName = fileItems.first().locator('[data-slot="fileName"]');
      await expect(firstFileName).toHaveText("既存ファイル1.jpg");

      const secondFileName = fileItems.last().locator('[data-slot="fileName"]');
      await expect(secondFileName).toHaveText("既存ファイル2.pdf");
    });

    test("既存ファイルの選択数とサイズが表示されるべき", async ({ page }) => {
      await setupFileUpload(page);

      await addExistingFileHTML(page, [
        {
          name: "file1.jpg",
          sizeBytes: "1,048,576",
        },
        {
          name: "file2.pdf",
          sizeBytes: "2,097,152",
        },
      ]);

      await reinitializeComponent(page);

      const selectedFilesMessage = page.locator("[data-js-select-summary]");
      await expect(selectedFilesMessage).toContainText("選択中：2個");
    });

    test("既存ファイルを削除できるべき", async ({ page }) => {
      await setupFileUpload(page);

      await addExistingFileHTML(page, [
        {
          name: "file1.jpg",
          sizeBytes: "1,048,576",
        },
        {
          name: "file2.pdf",
          sizeBytes: "2,097,152",
        },
        {
          name: "file3.png",
          sizeBytes: "512,000",
        },
      ]);

      await reinitializeComponent(page);

      const fileItems = page.locator("[data-js-file-list] > li");
      await expect(fileItems).toHaveCount(3);

      const removeButton = fileItems
        .first()
        .getByRole("button", { name: /解除/ });
      await removeButton.click();

      await expect(fileItems).toHaveCount(2);
    });

    test("既存ファイルの解除ボタンにaria-labelledbyが設定されるべき", async ({
      page,
    }) => {
      await setupFileUpload(page);

      await addExistingFileHTML(page, [
        {
          name: "test-file.jpg",
          sizeBytes: "1,048,576",
        },
      ]);

      await reinitializeComponent(page);

      const removeButton = page
        .locator("[data-js-file-list] > li")
        .first()
        .getByRole("button", { name: /解除/ });
      const ariaLabelledby = await removeButton.getAttribute("aria-labelledby");

      expect(ariaLabelledby).toMatch(/file-\w+-remove/);
      expect(ariaLabelledby).toMatch(/file-\w+-name/);
    });

    test("既存ファイルに新規ファイルを追加できるべき", async ({ page }) => {
      await setupFileUpload(page);

      await addExistingFileHTML(page, [
        {
          name: "existing.jpg",
          sizeBytes: "1,048,576",
        },
      ]);

      await reinitializeComponent(page);

      await addMockFiles(page, [
        { name: "new-file.png", size: 1024, type: "image/png" },
      ]);

      const fileItems = page.locator("[data-js-file-list] > li");
      await expect(fileItems).toHaveCount(2);

      const selectedFilesMessage = page.locator("[data-js-select-summary]");
      await expect(selectedFilesMessage).toContainText("選択中：2個");
    });

    test("既存ファイルはバリデーションエラーが付与されないべき", async ({
      page,
    }) => {
      await setupFileUpload(page);

      // accept属性を設定
      await page.evaluate(() => {
        const input = document.querySelector("[data-js-input]");
        input.setAttribute("accept", ".png");
      });

      // .jpgファイルを既存ファイルとして追加（accept制限に違反するが、既存ファイルなのでエラーにならないべき）
      await addExistingFileHTML(page, [
        {
          name: "existing.jpg",
          sizeBytes: "1,048,576",
        },
      ]);

      await reinitializeComponent(page);

      const fileItem = page.locator("[data-js-file-list] > li");
      await expect(fileItem).not.toHaveAttribute("data-error", "true");
    });
  });

  test.describe("UI更新とメッセージ", () => {
    test("ファイルサイズが適切にフォーマットされるべき", async ({ page }) => {
      await setupFileUpload(page);

      await addMockFiles(page, [
        { name: "small.png", size: 500, type: "image/png" }, // 500B
        { name: "medium.png", size: 500 * 1024, type: "image/png" }, // 500KB
        { name: "large.png", size: 2 * 1024 * 1024, type: "image/png" }, // 2MB
      ]);

      const fileItems = page.locator("[data-js-file-list] > li");

      // 500B
      await expect(
        fileItems.nth(0).locator('[data-slot="fileSize"]'),
      ).toHaveText("500B");

      // 500KB
      await expect(
        fileItems.nth(1).locator('[data-slot="fileSize"]'),
      ).toHaveText("500KB");

      // 2MB
      await expect(
        fileItems.nth(2).locator('[data-slot="fileSize"]'),
      ).toHaveText("2MB");
    });

    test("ファイルサイズのバイト数がカンマ区切りで表示されるべき", async ({
      page,
    }) => {
      await setupFileUpload(page);

      await addMockFiles(page, [
        { name: "file.png", size: 1234567, type: "image/png" },
      ]);

      const fileItem = page.locator("[data-js-file-list] > li");
      await expect(fileItem.locator('[data-slot="fileSizeBytes"]')).toHaveText(
        "1,234,567",
      );
    });

    test("複数エラーが同時に表示されるべき", async ({ page }) => {
      await setupFileUpload(page);

      // max-files属性とaccept属性を設定
      await page.evaluate(() => {
        const fileUpload = document.querySelector("dads-file-upload");
        fileUpload.setAttribute("max-files", "5");
        const input = document.querySelector("[data-js-input]");
        input.setAttribute("accept", ".png,.jpg,.pdf");
      });

      // max-files超過 + 不正な形式
      await addMockFiles(page, [
        { name: "file1.png", size: 1024, type: "image/png" },
        { name: "file2.png", size: 1024, type: "image/png" },
        { name: "file3.png", size: 1024, type: "image/png" },
        { name: "file4.png", size: 1024, type: "image/png" },
        { name: "file5.png", size: 1024, type: "image/png" },
        { name: "file6.png", size: 1024, type: "image/png" }, // 6ファイル目でmax-files超過
        { name: "invalid.exe", size: 1024, type: "application/x-msdownload" }, // 不正な形式
      ]);

      const errorMessages = page.locator("[data-js-error-messages] li");
      await expect(errorMessages).toHaveCount(2); // max-files + hasFileErrors
    });
  });

  test.describe("単一ファイルモード", () => {
    test("multipleがない場合は1ファイルのみ保持されるべき", async ({
      page,
    }) => {
      await setupFileUpload(page);

      // multiple属性を削除
      await page.evaluate(() => {
        const input = document.querySelector("[data-js-input]");
        input.removeAttribute("multiple");
      });

      await addMockFiles(page, [
        { name: "file1.png", size: 1024, type: "image/png" },
      ]);

      let fileItems = page.locator("[data-js-file-list] > li");
      await expect(fileItems).toHaveCount(1);

      // 2つ目のファイルを追加すると、最初のファイルが置き換わるべき
      await addMockFiles(page, [
        { name: "file2.png", size: 2048, type: "image/png" },
      ]);

      fileItems = page.locator("[data-js-file-list] > li");
      await expect(fileItems).toHaveCount(1);
      await expect(fileItems.locator('[data-slot="fileName"]')).toHaveText(
        "file2.png",
      );
    });

    test("data-multiple属性がfalseになるべき", async ({ page }) => {
      await setupFileUpload(page);

      // multiple属性を削除
      await page.evaluate(() => {
        const input = document.querySelector("[data-js-input]");
        input.removeAttribute("multiple");
        // UIを更新するためにファイルを追加
        const fileUpload = document.querySelector("dads-file-upload");
        fileUpload.addFiles([]);
      });

      const fileUpload = page.locator("dads-file-upload");
      await expect(fileUpload).toHaveAttribute("data-multiple", "false");
    });
  });
});

// ユニットテスト（ユーティリティ関数）
test.describe("ユーティリティ関数のユニットテスト", () => {
  test.describe("parseSize", () => {
    test("nullまたは空文字列の場合はnullを返すべき", async ({ page }) => {
      await setupFileUpload(page);
      const results = await page.evaluate(async () => {
        const { parseSize } = await import("./file-upload.js");
        return [parseSize(null), parseSize(""), parseSize(undefined)];
      });
      expect(results).toEqual([null, null, null]);
    });

    test("バイト単位を正しくパースするべき", async ({ page }) => {
      await setupFileUpload(page);
      const results = await page.evaluate(async () => {
        const { parseSize } = await import("./file-upload.js");
        return [
          parseSize("100"),
          parseSize("100b"),
          parseSize("100B"),
          parseSize("0"),
        ];
      });
      expect(results).toEqual([100, 100, 100, 0]);
    });

    test("KB単位を正しくパースするべき", async ({ page }) => {
      await setupFileUpload(page);
      const results = await page.evaluate(async () => {
        const { parseSize } = await import("./file-upload.js");
        return [
          parseSize("1kb"),
          parseSize("1KB"),
          parseSize("10KB"),
          parseSize("1.5KB"),
        ];
      });
      expect(results).toEqual([1024, 1024, 10 * 1024, 1.5 * 1024]);
    });

    test("MB単位を正しくパースするべき", async ({ page }) => {
      await setupFileUpload(page);
      const results = await page.evaluate(async () => {
        const { parseSize } = await import("./file-upload.js");
        return [
          parseSize("1mb"),
          parseSize("1MB"),
          parseSize("10MB"),
          parseSize("1.5MB"),
        ];
      });
      expect(results).toEqual([
        1024 * 1024,
        1024 * 1024,
        10 * 1024 * 1024,
        1.5 * 1024 * 1024,
      ]);
    });

    test("GB単位を正しくパースするべき", async ({ page }) => {
      await setupFileUpload(page);
      const results = await page.evaluate(async () => {
        const { parseSize } = await import("./file-upload.js");
        return [parseSize("1gb"), parseSize("1GB"), parseSize("2.5GB")];
      });
      expect(results).toEqual([
        1024 * 1024 * 1024,
        1024 * 1024 * 1024,
        2.5 * 1024 * 1024 * 1024,
      ]);
    });

    test("スペースを含む文字列を正しくパースするべき", async ({ page }) => {
      await setupFileUpload(page);
      const results = await page.evaluate(async () => {
        const { parseSize } = await import("./file-upload.js");
        return [parseSize("10 MB"), parseSize("1 kb")];
      });
      expect(results).toEqual([10 * 1024 * 1024, 1024]);
    });

    test("不正な文字列の場合はnullを返すべき", async ({ page }) => {
      await setupFileUpload(page);
      const results = await page.evaluate(async () => {
        const { parseSize } = await import("./file-upload.js");
        return [
          parseSize("abc"),
          parseSize("10TB"),
          parseSize("-10MB"),
          parseSize("10 20 MB"),
        ];
      });
      expect(results).toEqual([null, null, null, null]);
    });
  });

  test.describe("formatSize", () => {
    test("0バイトを正しくフォーマットするべき", async ({ page }) => {
      await setupFileUpload(page);
      const result = await page.evaluate(async () => {
        const { formatSize } = await import("./file-upload.js");
        return formatSize(0);
      });
      expect(result).toBe("0B");
    });

    test("バイト単位を正しくフォーマットするべき", async ({ page }) => {
      await setupFileUpload(page);
      const results = await page.evaluate(async () => {
        const { formatSize } = await import("./file-upload.js");
        return [formatSize(1), formatSize(500), formatSize(1023)];
      });
      expect(results).toEqual(["1B", "500B", "1023B"]);
    });

    test("KB単位を正しくフォーマットするべき", async ({ page }) => {
      await setupFileUpload(page);
      const results = await page.evaluate(async () => {
        const { formatSize } = await import("./file-upload.js");
        return [formatSize(1024), formatSize(1536), formatSize(500 * 1024)];
      });
      expect(results).toEqual(["1KB", "1.5KB", "500KB"]);
    });

    test("MB単位を正しくフォーマットするべき", async ({ page }) => {
      await setupFileUpload(page);
      const results = await page.evaluate(async () => {
        const { formatSize } = await import("./file-upload.js");
        return [
          formatSize(1024 * 1024),
          formatSize(1.5 * 1024 * 1024),
          formatSize(2 * 1024 * 1024),
        ];
      });
      expect(results).toEqual(["1MB", "1.5MB", "2MB"]);
    });

    test("GB単位を正しくフォーマットするべき", async ({ page }) => {
      await setupFileUpload(page);
      const results = await page.evaluate(async () => {
        const { formatSize } = await import("./file-upload.js");
        return [
          formatSize(1024 * 1024 * 1024),
          formatSize(2.5 * 1024 * 1024 * 1024),
        ];
      });
      expect(results).toEqual(["1GB", "2.5GB"]);
    });

    test("precisionを指定した場合に正しくフォーマットするべき", async ({
      page,
    }) => {
      await setupFileUpload(page);
      const results = await page.evaluate(async () => {
        const { formatSize } = await import("./file-upload.js");
        return [
          formatSize(1536, 0),
          formatSize(1536, 1),
          formatSize(1536, 2),
          formatSize(1024 * 1024, 2),
        ];
      });
      expect(results).toEqual(["2KB", "1.5KB", "1.5KB", "1MB"]);
    });
  });

  test.describe("formatSizeWithDiff", () => {
    test("bytes1が0の場合を正しく処理するべき", async ({ page }) => {
      await setupFileUpload(page);
      const result = await page.evaluate(async () => {
        const { formatSizeWithDiff } = await import("./file-upload.js");
        return formatSizeWithDiff(0, 1024);
      });
      expect(result.size1).toBe("0B");
      expect(result.size2).toBe("1KB");
    });

    test("bytes2が0の場合を正しく処理するべき", async ({ page }) => {
      await setupFileUpload(page);
      const result = await page.evaluate(async () => {
        const { formatSizeWithDiff } = await import("./file-upload.js");
        return formatSizeWithDiff(1024, 0);
      });
      expect(result.size1).toBe("1KB");
      expect(result.size2).toBe("0B");
    });

    test("同じ単位で異なる値を正しくフォーマットするべき", async ({ page }) => {
      await setupFileUpload(page);
      const result = await page.evaluate(async () => {
        const { formatSizeWithDiff } = await import("./file-upload.js");
        return formatSizeWithDiff(10 * 1024 * 1024, 11 * 1024 * 1024);
      });
      expect(result.size1).toBe("10MB");
      expect(result.size2).toBe("11MB");
    });

    test("同じ値の場合を正しく処理するべき", async ({ page }) => {
      await setupFileUpload(page);
      const result = await page.evaluate(async () => {
        const { formatSizeWithDiff } = await import("./file-upload.js");
        return formatSizeWithDiff(1024, 1024);
      });
      expect(result.size1).toBe(result.size2);
    });

    test("丸めると同じになる値を精度を上げて区別するべき", async ({ page }) => {
      await setupFileUpload(page);
      // 10.0000MBと10.0001MBのように、通常の精度では両方「10MB」になってしまう値
      const result = await page.evaluate(async () => {
        const { formatSizeWithDiff } = await import("./file-upload.js");
        const bytes1 = 10.0 * 1024 * 1024; // 10.0000MB
        const bytes2 = 10.0001 * 1024 * 1024; // 10.0001MB
        return formatSizeWithDiff(bytes1, bytes2);
      });
      // 両方が「10MB」ではなく、区別できる表示になっているべき
      expect(result.size1).not.toBe(result.size2);
    });
  });

  test.describe("parseAcceptAttribute", () => {
    test("空またはnullの場合は空配列を返すべき", async ({ page }) => {
      await setupFileUpload(page);
      const results = await page.evaluate(async () => {
        const { parseAcceptAttribute } = await import("./file-upload.js");
        return [
          parseAcceptAttribute(""),
          parseAcceptAttribute(null),
          parseAcceptAttribute(undefined),
        ];
      });
      expect(results).toEqual([[], [], []]);
    });

    test("単一の拡張子をパースするべき", async ({ page }) => {
      await setupFileUpload(page);
      const results = await page.evaluate(async () => {
        const { parseAcceptAttribute } = await import("./file-upload.js");
        return [parseAcceptAttribute(".png"), parseAcceptAttribute(".PNG")];
      });
      expect(results).toEqual([[".png"], [".png"]]);
    });

    test("複数の拡張子をパースするべき", async ({ page }) => {
      await setupFileUpload(page);
      const result = await page.evaluate(async () => {
        const { parseAcceptAttribute } = await import("./file-upload.js");
        return parseAcceptAttribute(".png,.jpg,.gif");
      });
      expect(result).toEqual([".png", ".jpg", ".gif"]);
    });

    test("スペースを含む文字列を正しくパースするべき", async ({ page }) => {
      await setupFileUpload(page);
      const results = await page.evaluate(async () => {
        const { parseAcceptAttribute } = await import("./file-upload.js");
        return [
          parseAcceptAttribute(".png, .jpg, .gif"),
          parseAcceptAttribute(" .png , .jpg "),
        ];
      });
      expect(results).toEqual([
        [".png", ".jpg", ".gif"],
        [".png", ".jpg"],
      ]);
    });

    test("MIMEタイプをパースするべき", async ({ page }) => {
      await setupFileUpload(page);
      const result = await page.evaluate(async () => {
        const { parseAcceptAttribute } = await import("./file-upload.js");
        return parseAcceptAttribute("image/png,image/jpeg");
      });
      expect(result).toEqual(["image/png", "image/jpeg"]);
    });

    test("MIMEタイプワイルドカードをパースするべき", async ({ page }) => {
      await setupFileUpload(page);
      const results = await page.evaluate(async () => {
        const { parseAcceptAttribute } = await import("./file-upload.js");
        return [
          parseAcceptAttribute("image/*"),
          parseAcceptAttribute("image/*,application/*"),
        ];
      });
      expect(results).toEqual([["image/*"], ["image/*", "application/*"]]);
    });
  });

  test.describe("getFileExtension", () => {
    test("通常のファイル名から拡張子を取得するべき", async ({ page }) => {
      await setupFileUpload(page);
      const results = await page.evaluate(async () => {
        const { getFileExtension } = await import("./file-upload.js");
        return [
          getFileExtension("file.png"),
          getFileExtension("document.pdf"),
          getFileExtension("image.JPEG"),
        ];
      });
      expect(results).toEqual([".png", ".pdf", ".jpeg"]);
    });

    test("複数のドットを含むファイル名から拡張子を取得するべき", async ({
      page,
    }) => {
      await setupFileUpload(page);
      const results = await page.evaluate(async () => {
        const { getFileExtension } = await import("./file-upload.js");
        return [
          getFileExtension("file.name.png"),
          getFileExtension("my.document.v2.pdf"),
        ];
      });
      expect(results).toEqual([".png", ".pdf"]);
    });

    test("拡張子がないファイル名の場合は空文字列を返すべき", async ({
      page,
    }) => {
      await setupFileUpload(page);
      const results = await page.evaluate(async () => {
        const { getFileExtension } = await import("./file-upload.js");
        return [getFileExtension("filename"), getFileExtension("Makefile")];
      });
      expect(results).toEqual(["", ""]);
    });

    test("大文字の拡張子を小文字に変換するべき", async ({ page }) => {
      await setupFileUpload(page);
      const results = await page.evaluate(async () => {
        const { getFileExtension } = await import("./file-upload.js");
        return [getFileExtension("FILE.PNG"), getFileExtension("Document.PDF")];
      });
      expect(results).toEqual([".png", ".pdf"]);
    });
  });

  test.describe("isFileTypeAllowed", () => {
    test("許可された拡張子の場合はtrueを返すべき", async ({ page }) => {
      await setupFileUpload(page);
      const results = await page.evaluate(async () => {
        const { isFileTypeAllowed } = await import("./file-upload.js");
        return [
          isFileTypeAllowed(".png", "image/png", [".png", ".jpg"]),
          isFileTypeAllowed(".jpg", "image/jpeg", [".png", ".jpg"]),
        ];
      });
      expect(results).toEqual([true, true]);
    });

    test("許可されていない拡張子の場合はfalseを返すべき", async ({ page }) => {
      await setupFileUpload(page);
      const results = await page.evaluate(async () => {
        const { isFileTypeAllowed } = await import("./file-upload.js");
        return [
          isFileTypeAllowed(".exe", "application/x-msdownload", [
            ".png",
            ".jpg",
          ]),
          isFileTypeAllowed(".gif", "image/gif", [".png", ".jpg"]),
        ];
      });
      expect(results).toEqual([false, false]);
    });

    test("許可されたMIMEタイプの場合はtrueを返すべき", async ({ page }) => {
      await setupFileUpload(page);
      const result = await page.evaluate(async () => {
        const { isFileTypeAllowed } = await import("./file-upload.js");
        return isFileTypeAllowed(".png", "image/png", [
          "image/png",
          "image/jpeg",
        ]);
      });
      expect(result).toBe(true);
    });

    test("許可されていないMIMEタイプの場合はfalseを返すべき", async ({
      page,
    }) => {
      await setupFileUpload(page);
      const result = await page.evaluate(async () => {
        const { isFileTypeAllowed } = await import("./file-upload.js");
        return isFileTypeAllowed(".gif", "image/gif", [
          "image/png",
          "image/jpeg",
        ]);
      });
      expect(result).toBe(false);
    });

    test("image/*で画像ファイルを許可するべき", async ({ page }) => {
      await setupFileUpload(page);
      const results = await page.evaluate(async () => {
        const { isFileTypeAllowed } = await import("./file-upload.js");
        return [
          isFileTypeAllowed(".png", "image/png", ["image/*"]),
          isFileTypeAllowed(".jpg", "image/jpeg", ["image/*"]),
          isFileTypeAllowed(".gif", "image/gif", ["image/*"]),
          isFileTypeAllowed(".webp", "image/webp", ["image/*"]),
        ];
      });
      expect(results).toEqual([true, true, true, true]);
    });

    test("image/*で非画像ファイルを拒否するべき", async ({ page }) => {
      await setupFileUpload(page);
      const results = await page.evaluate(async () => {
        const { isFileTypeAllowed } = await import("./file-upload.js");
        return [
          isFileTypeAllowed(".pdf", "application/pdf", ["image/*"]),
          isFileTypeAllowed(".txt", "text/plain", ["image/*"]),
        ];
      });
      expect(results).toEqual([false, false]);
    });

    test("空の許可リストの場合はfalseを返すべき", async ({ page }) => {
      await setupFileUpload(page);
      const result = await page.evaluate(async () => {
        const { isFileTypeAllowed } = await import("./file-upload.js");
        return isFileTypeAllowed(".png", "image/png", []);
      });
      expect(result).toBe(false);
    });
  });
});
