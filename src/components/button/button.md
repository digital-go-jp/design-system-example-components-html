[Playground](./button.stories.ts?controls#Playground)

## コンポーネントのガイドライン

[ボタン（概要）｜デジタル庁デザインシステムβ版](https://design.digital.go.jp/dads/components/button/)

## ソースコード

<details>
<summary>HTML</summary>

#### button要素

[playground.html](./playground.html#.dads-button)

#### a要素（リンク）

[as-link.html](./as-link.html#.dads-button)

</details>

<details>
<summary>button.css</summary>

[button.css](./button.css)

</details>

## 仕様

### バリエーション

| 属性 | 値 | 説明 |
| --- | --- | --- |
| `data-type` | `solid-fill`, `outline`, `text` | ボタンのスタイル |
| `data-size` | `lg`, `md`, `sm`, `xs` | ボタンのサイズ |

## 使い方

### 要素の選択

- **アクションを実行する場合**: `<button>`要素を使用してください（フォーム送信、ダイアログを開くなど）
- **ページ遷移する場合**: `<a>`要素を使用してください

### 無効状態

`<button>`要素には`disabled`属性を付与します。

[disabled.html](./disabled.html#.dads-button)

`<a>`要素には`disabled`属性が使えないため、`href`属性を削除し、`role="link"`と`aria-disabled="true"`を付与します。

[disabled-link.html](./disabled-link.html#.dads-button)

### アイコンの追加

アイコンはボタンのテキストの前後に配置できます。`<svg>`要素に`dads-button__icon`クラスを付与してください。

[with-icon.html](./with-icon.html#.dads-button)

- **装飾的なアイコン**: `aria-hidden="true"`を付与して支援技術から隠します
- **意味を持つアイコン**: `role="img"`と`aria-label`で代替テキストを提供します
