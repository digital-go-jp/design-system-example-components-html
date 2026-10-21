[Basic](./textarea.stories.ts?controls#Basic)

## コンポーネントのガイドライン

[テキストエリア（概要）｜デジタル庁デザインシステムβ版](https://design.digital.go.jp/dads/components/textarea/)

## ソースコード

<details>
<summary>HTML</summary>

[basic.html](./basic.html#.dads-textarea)

</details>

<details>
<summary>textarea.css</summary>

[textarea.css](./textarea.css)

</details>

<details>
<summary>textarea-counter.js（文字数カウンターを使用する場合）</summary>

[textarea-counter.js](./textarea-counter.js)

</details>

### 依存ファイル

<details>
<summary>form-control-label.css</summary>

[form-control-label.css](../form-control-label/form-control-label.css)

</details>

## 使い方

### インストール

#### 必要なファイル

- **共通**
  - `textarea.css`
- **文字数カウンターを使用する場合**
  - `textarea-counter.js`
- **フォームコントロールラベルと組み合わせる場合**
  - `form-control-label.css`

スクリプトを読み込む際は必ず、`<script type="module">`を使用しES Moduleとして読み込んでください。

```html
<script type="module" src="textarea-counter.js"></script>
```

### ラベルの関連付け

テキストエリアは[フォームコントロールラベル](?path=/docs/components-フォームコントロールラベル--docs)と組み合わせて使用し、`<label>`要素の`for`属性で`<textarea>`要素のIDを指定します。

[with-form-control-label.html](./with-form-control-label.html#.dads-form-control-label)

### エラー状態

エラー状態のテキストエリアには、`<textarea>`要素に`aria-invalid="true"`を設定します。エラーメッセージを表示する場合は、`aria-describedby`属性を使用してエラーテキストを関連付けてください。

[errored.html](./errored.html#.dads-form-control-label)

### 読み取り専用状態

入力済みの値を編集不可にする場合は、`readonly`属性を使用します。ラベルには「編集不可」のステータスを表示し、サポートテキストで編集できない理由を説明してください。

[readonly.html](./readonly.html#.dads-form-control-label)

### 無効状態

`disabled`属性を使用して入力を無効化できます。

[disabled.html](./disabled.html#.dads-form-control-label)

### 文字数カウンター（dads-textarea-counter）

`<dads-textarea-counter>`要素は、テキストエリアの文字数をカウントし、上限を超えた場合にエラー状態を表示するカスタム要素です。

[with-counter.html](./with-counter.html#.dads-form-control-label:first-child)

#### 属性

| 属性 | 説明 |
| --- | --- |
| `for` | 対象となる`<textarea>`要素の`id`（必須） |
| `max` | 文字数の上限（必須、例：`max="100"`） |

#### スクリーンリーダーへの読み上げ

文字数カウンターは、入力中の文字数の状況をスクリーンリーダーで自動的に読み上げます。読み上げには以下の2種類があります。

1. 入力文字数が上限以内の場合、「残り`{count}`文字」と読み上げます。読み上げまでの待機時間は残り文字数に応じて動的に変化し、残り文字数が少ないほど短い間隔（最短1秒）で、多いほど長い間隔で読み上げます。
2. 入力文字数が上限を超過している場合、「`{count}`文字超過」と即座に読み上げます。超過中は入力のたびに常に即時通知されます。

#### メッセージのカスタマイズ

`data-*`属性でメッセージをカスタマイズできます。

```html
<!-- UIを英語化する例 -->
<dads-textarea-counter
  class="dads-textarea__counter"
  for="my-textarea"
  max="100"
  data-error-exceeded="{count} characters exceeded."
  data-announce-exceeded="{count} characters exceeded."
  data-announce-remaining="{count} characters remaining."
></dads-textarea-counter>
```

| 属性 | デフォルトメッセージ | 利用可能な変数 |
| --- | --- | --- |
| `data-error-exceeded` | `{count}文字超過しています` | `{count}` |
| `data-announce-exceeded` | `{count}文字超過` | `{count}` |
| `data-announce-remaining` | `残り{count}文字` | `{count}` |
