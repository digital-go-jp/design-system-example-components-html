[Playground](./notice-block.stories.ts?controls#Playground)

## コンポーネントのガイドライン

[注釈ブロック（概要）｜デジタル庁デザインシステムβ版](https://design.digital.go.jp/dads/components/notice-block/)

## ソースコード

<details>
<summary>HTML</summary>

[playground.html](./playground.html#.dads-notice-block)

</details>

<details>
<summary>notice-block.css</summary>

[notice-block.css](./notice-block.css)

</details>

### 依存ファイル

チップラベルやディスクロージャー等を組み合わせる場合は、対応するCSSも読み込んでください。

<details>
<summary>chip-label.css</summary>

[chip-label.css](../chip-label/chip-label.css)

</details>

<details>
<summary>disclosure.css</summary>

[disclosure.css](../disclosure/disclosure.css)

</details>

## 仕様

### バリエーション

| 属性 | 値 | 説明 |
| --- | --- | --- |
| `data-style` | `border-rounded` | 白い背景、枠線、角丸 |
| `data-style` | `border-solid` | 白い背景、枠線、左側の太い線 |
| `data-style` | `fill-rounded` | 色付きの背景、枠線、角丸 |
| `data-style` | `fill-solid` | 色付きの背景、枠線、左側の太い線 |
| `data-color` | `gray`, `light-blue` | 枠線と背景の色 |

## 使い方

### タイトルを見出しにする

タイトルを見出しにする場合、文書の見出し構造に応じて`.dads-notice-block__header`を適切なレベルの見出し要素に変更してください。

```html
<h3 class="dads-notice-block__header">
  タイトル
</h3>
```

### タイトルを省略する

本文だけを表示する場合は、`.dads-notice-block__header`を省略してください。

### チップラベルを組み合わせる

下記は、タイトルの前、または本文の前に[チップラベル](./?path=/docs/components-チップラベル--docs)を配置した作例です。

[With Chip Label in Title](./notice-block.stories.ts#WithChipLabelInTitle)

[with-chip-label-in-title.html](./with-chip-label-in-title.html#.dads-notice-block)

[With Chip Label in Body](./notice-block.stories.ts#WithChipLabelInBody)

[with-chip-label-in-body.html](./with-chip-label-in-body.html#.dads-notice-block)

### ディスクロージャーとチップラベルを組み合わせる

下記は、注釈ブロックの中に既存の[ディスクロージャー](./?path=/docs/components-ディスクロージャー--docs)を配置した作例です。

[With Disclosure and Chip Label](./notice-block.stories.ts#WithDisclosureAndChipLabel)

[with-disclosure-and-chip-label.html](./with-disclosure-and-chip-label.html#.dads-notice-block)
