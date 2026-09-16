[Playground](./chip-label.stories.ts?controls#Playground)

## コンポーネントのガイドライン

[チップラベル（概要）｜デジタル庁デザインシステムβ版](https://design.digital.go.jp/dads/components/chip-label/)

## ソースコード

<details>
<summary>HTML</summary>

[playground.html](./playground.html#.dads-chip-label)

</details>

<details>
<summary>chip-label.css</summary>

[chip-label.css](./chip-label.css)

</details>

## 仕様

### バリエーション

| 属性 | 値 | 説明 |
| --- | --- | --- |
| `data-style` | `text`, `outlined`, `filled-1`, `filled-2` | チップラベルのスタイル |
| `data-color` | `gray`, `blue`, `light-blue`, `cyan`, `green`, `lime`, `yellow`, `orange`, `red`, `magenta`, `purple` | チップラベルの色 |

## 使い方

### アイコン付きチップラベル

アイコンを表示する場合は、`<svg>`要素に`.dads-chip-label__icon`クラスを付与します。アイコンは装飾的なため`aria-hidden="true"`を設定してください。

[with-icon.html](./with-icon.html#.dads-chip-label)

### アイコンなしチップラベル

アイコンが不要な場合は`<svg>`要素を省略します。

[without-icon.html](./without-icon.html#.dads-chip-label)

### 任意の色を使う

所定のCSSカスタムプロパティを使用することで、チップラベルに任意の色を指定できます。

[custom-color.html](./custom-color.html#.dads-chip-label)

上書き可能なカスタムプロパティは下記の通りです。

| プロパティ | 用途 |
| --- | --- |
| `--_non-text` | `outlined`と`filled-1`タイプの外枠、`filled-2`タイプの背景、アイコン |
| `--_bg` | `filled-1`タイプの背景 |
| `--_text` | `text`と`outlined`タイプのテキスト |
| `--_text-dark` | `filled-1`タイプのテキスト |
