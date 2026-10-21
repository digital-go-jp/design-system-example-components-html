[Basic](./input-text.stories.ts?controls#Basic)

## コンポーネントのガイドライン

[インプットテキスト（概要）｜デジタル庁デザインシステムβ版](https://design.digital.go.jp/dads/components/input-text/)

## ソースコード

<details>
<summary>HTML</summary>

[basic.html](./basic.html#.dads-input-text)

</details>

<details>
<summary>input-text.css</summary>

[input-text.css](./input-text.css)

</details>

### 依存ファイル

<details>
<summary>form-control-label.css</summary>

[form-control-label.css](../form-control-label/form-control-label.css)

</details>

## 仕様

### バリエーション

| 属性 | 値 | 説明 |
| --- | --- | --- |
| `data-size` | `sm`, `md`, `lg` | インプットテキストの高さ |

## 使い方

### ラベルの関連付け

インプットテキストは[フォームコントロールラベル](?path=/docs/components-フォームコントロールラベル--docs)と組み合わせて使用し、`<label>`要素の`for`属性で`<input>`要素のIDを指定します。

[with-form-control-label.html](./with-form-control-label.html#.dads-form-control-label)

### エラー状態

エラー状態のインプットテキストには、`<input>`要素に`aria-invalid="true"`を設定します。エラーメッセージを表示する場合は、`aria-describedby`属性を使用してエラーテキストを関連付けてください。

[errored.html](./errored.html#.dads-form-control-label)

### 読み取り専用状態

入力済みの値を編集不可にする場合は、`readonly`属性を使用します。ラベルには「編集不可」のステータスを表示し、サポートテキストで編集できない理由を説明してください。

[readonly.html](./readonly.html#.dads-form-control-label)

### 無効状態

`disabled`属性を使用して入力を無効化できます。

[disabled.html](./disabled.html#.dads-form-control-label)
