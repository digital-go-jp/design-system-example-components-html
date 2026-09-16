[Playground](./select.stories.ts?controls#Playground)

## コンポーネントのガイドライン

[セレクトボックス（概要）｜デジタル庁デザインシステムβ版](https://design.digital.go.jp/dads/components/select/)

## ソースコード

<details>
<summary>HTML</summary>

[playground.html](./playground.html#.dads-select)

</details>

<details>
<summary>select.css</summary>

[select.css](./select.css)

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
| `data-size` | `sm`, `md`, `lg` | セレクトボックスの高さ |

## 使い方

### ラベルの関連付け

セレクトボックスは[フォームコントロールラベル](?path=/docs/components-フォームコントロールラベル--docs)と組み合わせて使用し、`<label>`要素の`for`属性で`<select>`要素のIDを指定します。

[with-form-control-label.html](./with-form-control-label.html#.dads-form-control-label)

### エラー状態

エラー状態のセレクトボックスには、`<select>`要素に`aria-invalid="true"`を設定します。エラーメッセージを表示する場合は、`aria-describedby`属性を使用してエラーテキストを関連付けてください。

[error.html](./error.html#.dads-select)

### 無効状態

`disabled`属性を使用して選択を無効化できます。

[disabled.html](./disabled.html#.dads-select)

### 選択肢のグループ化

関連する選択肢をグループ化するには、`<optgroup>`要素を使用し、`label`属性でグループ名を指定します。

[optgroup.html](./optgroup.html#.dads-select)
