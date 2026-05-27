import { describe, expect, test } from "vitest";
import {
  formatSize,
  formatSizeWithDiff,
  getFileExtension,
  isFileTypeAllowed,
  parseAcceptAttribute,
  parseSize,
} from "./file-upload.js";

describe("parseSize", () => {
  test("nullまたは空文字列の場合はnullを返すべき", () => {
    expect(parseSize(null)).toBe(null);
    expect(parseSize("")).toBe(null);
    expect(parseSize(undefined)).toBe(null);
  });

  test("バイト単位を正しくパースするべき", () => {
    expect(parseSize("100")).toBe(100);
    expect(parseSize("100b")).toBe(100);
    expect(parseSize("100B")).toBe(100);
    expect(parseSize("0")).toBe(0);
  });

  test("KB単位を正しくパースするべき", () => {
    expect(parseSize("1kb")).toBe(1024);
    expect(parseSize("1KB")).toBe(1024);
    expect(parseSize("10KB")).toBe(10 * 1024);
    expect(parseSize("1.5KB")).toBe(1.5 * 1024);
  });

  test("MB単位を正しくパースするべき", () => {
    expect(parseSize("1mb")).toBe(1024 * 1024);
    expect(parseSize("1MB")).toBe(1024 * 1024);
    expect(parseSize("10MB")).toBe(10 * 1024 * 1024);
    expect(parseSize("1.5MB")).toBe(1.5 * 1024 * 1024);
  });

  test("GB単位を正しくパースするべき", () => {
    expect(parseSize("1gb")).toBe(1024 * 1024 * 1024);
    expect(parseSize("1GB")).toBe(1024 * 1024 * 1024);
    expect(parseSize("2.5GB")).toBe(2.5 * 1024 * 1024 * 1024);
  });

  test("スペースを含む文字列を正しくパースするべき", () => {
    expect(parseSize("10 MB")).toBe(10 * 1024 * 1024);
    expect(parseSize("1 kb")).toBe(1024);
  });

  test("不正な文字列の場合はnullを返すべき", () => {
    expect(parseSize("abc")).toBe(null);
    expect(parseSize("10TB")).toBe(null);
    expect(parseSize("-10MB")).toBe(null);
    expect(parseSize("10 20 MB")).toBe(null);
  });
});

describe("formatSize", () => {
  test("0バイトを正しくフォーマットするべき", () => {
    expect(formatSize(0)).toBe("0B");
  });

  test("バイト単位を正しくフォーマットするべき", () => {
    expect(formatSize(1)).toBe("1B");
    expect(formatSize(500)).toBe("500B");
    expect(formatSize(1023)).toBe("1023B");
  });

  test("KB単位を正しくフォーマットするべき", () => {
    expect(formatSize(1024)).toBe("1KB");
    expect(formatSize(1536)).toBe("1.5KB");
    expect(formatSize(500 * 1024)).toBe("500KB");
  });

  test("MB単位を正しくフォーマットするべき", () => {
    expect(formatSize(1024 * 1024)).toBe("1MB");
    expect(formatSize(1.5 * 1024 * 1024)).toBe("1.5MB");
    expect(formatSize(2 * 1024 * 1024)).toBe("2MB");
  });

  test("GB単位を正しくフォーマットするべき", () => {
    expect(formatSize(1024 * 1024 * 1024)).toBe("1GB");
    expect(formatSize(2.5 * 1024 * 1024 * 1024)).toBe("2.5GB");
  });

  test("precisionを指定した場合に正しくフォーマットするべき", () => {
    expect(formatSize(1536, 0)).toBe("2KB");
    expect(formatSize(1536, 1)).toBe("1.5KB");
    expect(formatSize(1536, 2)).toBe("1.5KB");
    expect(formatSize(1024 * 1024, 2)).toBe("1MB");
  });
});

describe("formatSizeWithDiff", () => {
  test("bytes1が0の場合を正しく処理するべき", () => {
    const result = formatSizeWithDiff(0, 1024);
    expect(result.size1).toBe("0B");
    expect(result.size2).toBe("1KB");
  });

  test("bytes2が0の場合を正しく処理するべき", () => {
    const result = formatSizeWithDiff(1024, 0);
    expect(result.size1).toBe("1KB");
    expect(result.size2).toBe("0B");
  });

  test("同じ単位で異なる値を正しくフォーマットするべき", () => {
    const result = formatSizeWithDiff(10 * 1024 * 1024, 11 * 1024 * 1024);
    expect(result.size1).toBe("10MB");
    expect(result.size2).toBe("11MB");
  });

  test("同じ値の場合を正しく処理するべき", () => {
    const result = formatSizeWithDiff(1024, 1024);
    expect(result.size1).toBe(result.size2);
  });

  test("丸めると同じになる値を精度を上げて区別するべき", () => {
    const bytes1 = 10.0 * 1024 * 1024;
    const bytes2 = 10.0001 * 1024 * 1024;
    const result = formatSizeWithDiff(bytes1, bytes2);
    expect(result.size1).not.toBe(result.size2);
  });
});

describe("parseAcceptAttribute", () => {
  test("空またはnullの場合は空配列を返すべき", () => {
    expect(parseAcceptAttribute("")).toEqual([]);
    expect(parseAcceptAttribute(null)).toEqual([]);
    expect(parseAcceptAttribute(undefined)).toEqual([]);
  });

  test("単一の拡張子をパースするべき", () => {
    expect(parseAcceptAttribute(".png")).toEqual([".png"]);
    expect(parseAcceptAttribute(".PNG")).toEqual([".png"]);
  });

  test("複数の拡張子をパースするべき", () => {
    expect(parseAcceptAttribute(".png,.jpg,.gif")).toEqual([
      ".png",
      ".jpg",
      ".gif",
    ]);
  });

  test("スペースを含む文字列を正しくパースするべき", () => {
    expect(parseAcceptAttribute(".png, .jpg, .gif")).toEqual([
      ".png",
      ".jpg",
      ".gif",
    ]);
    expect(parseAcceptAttribute(" .png , .jpg ")).toEqual([".png", ".jpg"]);
  });

  test("MIMEタイプをパースするべき", () => {
    expect(parseAcceptAttribute("image/png,image/jpeg")).toEqual([
      "image/png",
      "image/jpeg",
    ]);
  });

  test("MIMEタイプワイルドカードをパースするべき", () => {
    expect(parseAcceptAttribute("image/*")).toEqual(["image/*"]);
    expect(parseAcceptAttribute("image/*,application/*")).toEqual([
      "image/*",
      "application/*",
    ]);
  });
});

describe("getFileExtension", () => {
  test("通常のファイル名から拡張子を取得するべき", () => {
    expect(getFileExtension("file.png")).toBe(".png");
    expect(getFileExtension("document.pdf")).toBe(".pdf");
    expect(getFileExtension("image.JPEG")).toBe(".jpeg");
  });

  test("複数のドットを含むファイル名から拡張子を取得するべき", () => {
    expect(getFileExtension("file.name.png")).toBe(".png");
    expect(getFileExtension("my.document.v2.pdf")).toBe(".pdf");
  });

  test("拡張子がないファイル名の場合は空文字列を返すべき", () => {
    expect(getFileExtension("filename")).toBe("");
    expect(getFileExtension("Makefile")).toBe("");
  });

  test("大文字の拡張子を小文字に変換するべき", () => {
    expect(getFileExtension("FILE.PNG")).toBe(".png");
    expect(getFileExtension("Document.PDF")).toBe(".pdf");
  });
});

describe("isFileTypeAllowed", () => {
  test("許可された拡張子の場合はtrueを返すべき", () => {
    expect(isFileTypeAllowed(".png", "image/png", [".png", ".jpg"])).toBe(true);
    expect(isFileTypeAllowed(".jpg", "image/jpeg", [".png", ".jpg"])).toBe(
      true,
    );
  });

  test("許可されていない拡張子の場合はfalseを返すべき", () => {
    expect(
      isFileTypeAllowed(".exe", "application/x-msdownload", [".png", ".jpg"]),
    ).toBe(false);
    expect(isFileTypeAllowed(".gif", "image/gif", [".png", ".jpg"])).toBe(
      false,
    );
  });

  test("許可されたMIMEタイプの場合はtrueを返すべき", () => {
    expect(
      isFileTypeAllowed(".png", "image/png", ["image/png", "image/jpeg"]),
    ).toBe(true);
  });

  test("許可されていないMIMEタイプの場合はfalseを返すべき", () => {
    expect(
      isFileTypeAllowed(".gif", "image/gif", ["image/png", "image/jpeg"]),
    ).toBe(false);
  });

  test("image/*で画像ファイルを許可するべき", () => {
    expect(isFileTypeAllowed(".png", "image/png", ["image/*"])).toBe(true);
    expect(isFileTypeAllowed(".jpg", "image/jpeg", ["image/*"])).toBe(true);
    expect(isFileTypeAllowed(".gif", "image/gif", ["image/*"])).toBe(true);
    expect(isFileTypeAllowed(".webp", "image/webp", ["image/*"])).toBe(true);
  });

  test("image/*で非画像ファイルを拒否するべき", () => {
    expect(isFileTypeAllowed(".pdf", "application/pdf", ["image/*"])).toBe(
      false,
    );
    expect(isFileTypeAllowed(".txt", "text/plain", ["image/*"])).toBe(false);
  });

  test("空の許可リストの場合はfalseを返すべき", () => {
    expect(isFileTypeAllowed(".png", "image/png", [])).toBe(false);
  });
});
