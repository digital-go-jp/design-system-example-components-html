[Playground](./heading.stories.ts?controls#Playground)

## コンポーネントのガイドライン

[見出し（概要）｜デジタル庁デザインシステムβ版](https://design.digital.go.jp/dads/components/heading/)

## ソースコード

<details>
<summary>HTML</summary>

#### 基本形

[basic.html](./basic.html#.dads-heading)

#### ショルダーテキスト付き

[with-shoulder.html](./with-shoulder.html#.dads-heading)

</details>

<details>
<summary>heading.css</summary>

[heading.css](./heading.css)

</details>

## 仕様

### バリエーション

| 属性 | 値 | 説明 |
| --- | --- | --- |
| `data-size` | `64`, `57`, `45`, `36`, `32`, `28`, `24`, `20`, `18`, `16` | 見出しのフォントサイズ（px相当） |
| `data-chip` | （属性の有無） | 左端に縦線を表示 |
| `data-rule` | `8`, `6`, `4`, `2` | 下線の太さ（px相当） |

## 使い方

### マークアップ

- **基本形**: ショルダーテキストがない場合は`<div>`要素を使用します
- **ショルダーテキスト付き**: `<hgroup>`要素で見出しとショルダーテキストをグループ化します
- **見出しレベル**: `<h1>`〜`<h6>`のいずれかを使用し、ページの文書構造に適したレベルを選択してください

### チップ（縦線）を追加する

`data-chip`属性を追加すると、見出しの左端に縦線が表示されます。

[with-chip.html](./with-chip.html#.dads-heading)

### 下線を追加する

`data-rule`属性を追加すると、見出しの下に線が表示されます。

[with-rule.html](./with-rule.html#.dads-heading)

### アイコンを追加する

見出しテキストの前にアイコンを追加できます。

[with-icon.html](./with-icon.html#.dads-heading)

### ショルダーテキストを追加する

見出しの上に小さなテキスト（ショルダーテキスト）を追加できます。この場合、ルート要素を`<hgroup>`に変更します。

[with-shoulder.html](./with-shoulder.html#.dads-heading)
