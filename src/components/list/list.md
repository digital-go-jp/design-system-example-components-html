[Bullet](./list.stories.ts?controls#Bullet)

## コンポーネントのガイドライン

[箇条書きリスト（概要）｜デジタル庁デザインシステムβ版](https://design.digital.go.jp/dads/components/list/)

## ソースコード

<details>
<summary>HTML</summary>

#### 箇条書きリスト

[bullet.html](./bullet.html#body>.dads-list)

#### 番号付きリスト

[numbered.html](./numbered.html#body>.dads-list)

</details>

<details>
<summary>list.css</summary>

[list.css](./list.css)

</details>

<details>
<summary>link.css（リンクを使用する場合）</summary>

[link.css](../link/link.css)

</details>

## 仕様

### バリエーション

| 属性 | 値 | 説明 |
| --- | --- | --- |
| `data-spacing` | `4`, `8`, `12` | リスト項目間の垂直方向の間隔（px）|
| `data-marker` | `number` | 番号付きリストとして表示 |

## 使い方

### テキストのスタイル

このコンポーネントは、フォントの種類・サイズ・行の高さを指定していません。テキストには配置先から継承したスタイルが適用されます。必要に応じて、配置先でこれらのスタイルを指定してください。

### 番号付きリスト

番号付きリストを使用する場合は、`data-marker="number"`を設定し、各リスト項目内に番号用の`<span>`要素を配置します。番号の`<span>`要素は、`<li>`要素の最初の子要素である必要があります。

[numbered.html](./numbered.html#body>.dads-list)

### 番号の書式を自由に指定する

番号のテキストはマークアップ側で自由に指定できます。丸数字や括弧付きなど、任意の形式が使用可能です。

[custom-marker-format.html](./custom-marker-format.html#body>.dads-list)

### リンク付きリスト項目

番号付きリストでリスト項目全体をリンクにする場合は、`<li>`要素の直下に`<a>`要素を配置し、その中に番号の`<span>`要素を含めます。番号の`<span>`要素は、`<a>`要素の最初の子要素である必要があります。

[numbered-with-links.html](./numbered-with-links.html#body>.dads-list)

### ネストされたリスト

リストはネストして使用できます。ネストされたリストにも同じ`data-spacing`属性を設定してください。

[nested.html](./nested.html#body>.dads-list)

順序なしリストと番号付きリストを組み合わせてネストすることも可能です。
