[Playground](./file-upload.stories.ts?controls#Playground)

## コンポーネントのガイドライン

[ファイルアップロード／ドロップエリア（概要）｜デジタル庁デザインシステムβ版](https://design.digital.go.jp/dads/components/file-upload/)

## ソースコード

<details>
<summary>HTML</summary>

[playground.html](./playground.html#.dads-file-upload)

</details>

<details>
<summary>file-upload.css</summary>

[file-upload.css](./file-upload.css)

</details>

<details>
<summary>file-upload.js</summary>

[file-upload.js](./file-upload.js)

</details>

### 依存ファイル

<details>
<summary>button.css</summary>

[button.css](../button/button.css)

</details>

<details>
<summary>checkbox.css</summary>

[checkbox.css](../checkbox/checkbox.css)

</details>

## 仕様

### バリエーション

| 属性 | 値 | 説明 |
| --- | --- | --- |
| `max-files` | 数値 | 選択可能なファイル数の上限 |
| `max-file-size` | サイズ文字列（例：`5MB`） | 1ファイルあたりのサイズ上限 |
| `max-total-size` | サイズ文字列（例：`10MB`） | 全ファイルの合計サイズ上限 |

サイズの単位は `B`, `KB`, `MB`, `GB` が使用できます。

### 機能仕様

- **ファイル選択**: ボタンクリックまたはドラッグ＆ドロップでファイルを選択
- **バリデーション**: ファイル数、ファイルサイズ、ファイル形式のクライアントサイド検証。エラーがあるファイルは一覧内で個別にハイライト表示される
- **ドロップエリア拡張**: チェックボックスでブラウザウィンドウ全体をドロップエリアに拡張可能
- **スクリーンリーダー対応**: ドラッグ＆ドロップ時のライブリージョンによる読み上げ

## 使い方

### インストール

#### 必要なファイル

- **CSS**
  - `file-upload.css`
  - `button.css`
  - `checkbox.css`（ドロップエリア拡張機能を使用する場合）
- **JavaScript**
  - `file-upload.js`

スクリプトを読み込む際は必ず、`<script type="module">`を使用しES Moduleとして読み込んでください。

### マークアップ

[フォームコントロールラベル](?path=/docs/components-フォームコントロールラベル--docs)と組み合わせて使用してください。ラベル、サポートテキスト、コントロールを適切に関連付けることで、アクセシビリティが向上します。

[with-form-control-label.html](./with-form-control-label.html#.dads-form-control-label)

### ドロップエリアなしで使用する

ドラッグ＆ドロップ機能が不要な場合、`.dads-file-upload__drop-area`要素と`.dads-file-upload__viewport-overlay`要素を削除し、ボタンエリアを直接配置します。

[without-drop-area.html](./without-drop-area.html#.dads-file-upload)

### 単一ファイルのみ選択させる

`<input>`要素の`multiple`属性を外すと、1ファイルのみ選択可能になります。ファイル一覧のマーカーも連番表示から単純なマーカーに変わります。

### アップロード済みファイルを表示する

サーバー側で受け取り済みのファイルを`.dads-file-upload__file-list`要素内に事前に描画しておくことで、初期表示状態からファイルが選択済みであるように見せられます。各リスト項目には`<input type="hidden">`要素でファイルの識別IDを含めてください。

[with-existing-files.html](./with-existing-files.html#.dads-file-upload)

### エラーのあるファイルを表示する

ファイルにエラーがある場合、コンポーネントはリスト項目に`data-error="true"`属性を付与し、エラーメッセージを`[data-js-file-info]`要素内に追加します。この状態は通常、ファイル選択時のクライアントサイド検証によって動的に発生しますが、サーバーサイドで検証エラーのあるファイルを引き継ぐ場合などにも、あらかじめ同じマークアップで描画できます。

[with-error.html](./with-error.html#.dads-file-upload)

### 複数ステップフォームでの使い方

複数ステップのフォームでアップロードしたファイルを引き継ぐ場合、各ファイルにサーバーサイドで識別可能なIDを付与した上で、`<input type="hidden">`に当該ファイルIDを含めることで実現できます。

#### ステップ1: 初回ファイル選択

```html
<form action="/step1" method="post" enctype="multipart/form-data">
  <dads-file-upload class="dads-file-upload" max-files="3">
    <input
      class="dads-file-upload__input"
      type="file"
      name="upload_files"
      multiple
      data-js-input
    >
    <!-- 他の要素は省略 -->
  </dads-file-upload>
  <button type="submit">次へ</button>
</form>
```

コンポーネントは自動的に選択されたファイルをリスト項目内に`<input type="file">`として追加します。このため、フォーム送信時にファイルデータが送信されます。

#### ステップ2: 既存ファイルの表示と追加選択

サーバー側で受け取ったファイルを一時保存し、各ファイルに識別IDを発行してください。

フォームをレンダリングする際、既存ファイルを`.dads-file-upload__file-list`要素内に描画します。各リスト項目に`<input type="hidden">`要素を含め、`value`にファイルの識別IDを出力してください。描画に用いるHTMLは、`<template>`要素のものを使用してください。

```html
<form action="/step2" method="post" enctype="multipart/form-data">
  <dads-file-upload class="dads-file-upload" max-files="5">
    <input 
      class="dads-file-upload__input" 
      type="file"
      name="upload_files"
      multiple
      data-js-input
    >

    <!-- 省略 -->

    <ul class="dads-file-upload__file-list" data-js-file-list>
      <!-- 既存ファイル1（サーバー側でレンダリング） -->
      <li class="dads-file-upload__file-item">
        <!-- 既存ファイルのIDをhiddenで保持 -->
        <input type="hidden" name="existing_files" value="file123">
        <div class="dads-file-upload__file-marker"></div>
        <!-- 既存ファイルのファイル名およびファイルサイズを出力 -->
        <div class="dads-file-upload__file-info" data-js-file-info>
          <p>
            <span class="dads-file-upload__file-name" data-slot="fileName">document1.pdf</span>
            <span class="dads-file-upload__file-meta">
              <!-- data-slot="fileSizeBytes"の要素は必須 -->
              <span data-slot="fileSize">2.5MB</span>（<span data-slot="fileSizeBytes">2,621,440</span>バイト）
            </span>
          </p>
        </div>
        <button class="dads-file-upload__remove-button dads-button" data-type="text" data-size="xs" type="button" data-js-remove-button>解除</button>
      </li>
      <!-- 既存ファイル2 -->
      <li class="dads-file-upload__file-item">
        <input type="hidden" name="existing_files" value="file456">
        <div class="dads-file-upload__file-marker"></div>
        <div class="dads-file-upload__file-info" data-js-file-info>
          <p>
            <span class="dads-file-upload__file-name" data-slot="fileName">document2.xlsx</span>
            <span class="dads-file-upload__file-meta">
              <span data-slot="fileSize">1.2MB</span>（<span data-slot="fileSizeBytes">1,258,291</span>バイト）
            </span>
          </p>
        </div>
        <button class="dads-file-upload__remove-button dads-button" data-type="text" data-size="xs" type="button" data-js-remove-button>解除</button>
      </li>
    </ul>

    <!-- 省略 -->

  </dads-file-upload>
  <button type="submit">送信</button>
</form>
```

コンポーネントは初期化時に `data-js-file-list` 内の既存項目を読み込み、内部状態として保持します。
ユーザーが新たにファイルを選択すると、既存ファイルの後ろに追加されます。

## カスタマイズ

### エラーメッセージのカスタマイズ

エラーメッセージは `data-error-*` 属性でカスタマイズできます。

```html
<dads-file-upload 
  class="dads-file-upload"
  max-files="5"
  max-file-size="5MB"
  max-total-size="10MB"
  data-error-max-files="選択できるファイル数は{max}個までです。現在{current}個です。"
  data-error-max-total-size="選択できるファイルサイズの合計は{max}までです。現在{current}です。"
  data-error-invalid-type="このファイル形式はアップロードできません。"
  data-error-max-file-size="選択できるファイルサイズは{max}までです。現在{current}です。"
>
  <!-- 内容は省略 -->
</dads-file-upload>
```

#### 利用可能なエラーメッセージ属性

| 属性 | デフォルトメッセージ | 利用可能な変数 |
| --- | --- | --- |
| `data-error-max-files` | 選択できるファイル数が上限を超過しています。 | `{max}`, `{current}` |
| `data-error-max-total-size` | 選択できるファイルサイズの合計が上限を超過しています。 | `{max}`, `{current}` |
| `data-error-invalid-type` | 許可されていないファイル形式です。 | なし |
| `data-error-max-file-size` | ファイルサイズが上限を超過しています。 | `{max}`, `{current}` |
| `data-error-has-file-errors` | 選択したファイルにエラーがあります。該当ファイルをチェックしてください。 | なし |

### UIを英語化する

```html
<dads-file-upload 
  class="dads-file-upload"
  data-error-max-files="The number of files that can be selected has exceeded the limit."
  data-error-max-total-size="The total size of files that can be selected has exceeded the limit."
  data-error-invalid-type="This file format is not allowed."
  data-error-max-file-size="The file size has exceeded the limit."
  data-error-has-file-errors="There are errors in the selected files. Please reselect the files with errors."
  data-announce-drop-available="You can drop files here."
  data-announce-drop-unavailable="Outside of the drop area."
  data-label-selected-files="{count} files (Total: {sizeFormatted} / {sizeBytes} bytes)"
>
  <!-- 内容は省略 -->
</dads-file-upload>
```

### ファイルリストのテンプレートカスタマイズ

ファイルリストの各項目の表示は `template[data-js-template]` を編集することでカスタマイズできます。

#### 利用可能なスロット

| スロット名 | 内容 | 例 |
| --- | --- | --- |
| `fileName` | ファイル名 | `document.pdf` |
| `fileSize` | フォーマット済みファイルサイズ | `2.5MB` |
| `fileSizeBytes` | バイト数（カンマ区切り） | `2,621,440` |

### JavaScript API

コンポーネントはJavaScript経由でも操作できます。

```javascript
const fileUpload = document.querySelector('dads-file-upload');

// プログラムでファイルを追加
const files = [file1, file2]; // File オブジェクトの配列
fileUpload.addFiles(files);

// ファイルを削除
fileUpload.removeFile('file-id');

// 現在のファイルリストを取得
console.log(fileUpload.files);

// エラー情報を取得
console.log(fileUpload.errors);
```
