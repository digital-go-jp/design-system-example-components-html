## コンポーネントのガイドライン

[カード（概要）｜デジタル庁デザインシステムβ版](https://design.digital.go.jp/dads/components/card/)

## カード作例 1

全体がリンクのクリッカブルエリアになっているカードです。メインエリアの角を丸くしています。

- カード全体を`<a>`要素で囲んでいます
- イメージエリアの背景はCSSグラデーション、アイコンは`<svg aria-hidden="true">`としています

[カード作例 1](./card.stories.ts?controls#Example1)

### ソースコード

<details>
<summary>HTML</summary>

[example-1.html](./example-1.html#.dads-card-example-1-list)

</details>

<details>
<summary>card-example-1.css</summary>

[card-example-1.css](./card-example-1.css)

</details>

## カード作例 2

メインエリアの縦三点リーダーボタンと「詳しくみる」リンクを持つカードです。

- イメージエリアはDOM上ではメインエリアの後に位置し、グリッドレイアウトにより見た目上は左に配置しています
- 画像に代替テキストを付与しています

[カード作例 2](./card.stories.ts?controls#Example2)

### ソースコード

<details>
<summary>HTML</summary>

[example-2.html](./example-2.html#.dads-card-example-2-list)

</details>

<details>
<summary>card-example-2.css</summary>

[card-example-2.css](./card-example-2.css)

</details>

## カード作例 3

リンクとお気に入りボタンを持つカードです。

- 見出しがカード内の最初の要素になるように、フレックスボックスレイアウトと`order`プロパティを使用しています
- カードが横並びになった時にイラストの高さを揃えるために、サブグリッド（`grid-template-rows: subgrid`）を使用しています
- 画像に代替テキストを付与しています

[カード作例 3](./card.stories.ts?controls#Example3)

### ソースコード

<details>
<summary>HTML</summary>

[example-3.html](./example-3.html#.dads-card-example-3-list)

</details>

<details>
<summary>card-example-3.css</summary>

[card-example-3.css](./card-example-3.css)

</details>

#### 依存ファイル

<details>
<summary>button.css</summary>

[button.css](../button/button.css)

</details>

<details>
<summary>link.css</summary>

[link.css](../link/link.css)

</details>

## カード作例 4

縦三点リーダーボタンと、アクションボタンとして関連情報リンクと「詳しくみる」リンクを持つカードです。

- 全体をグリッドレイアウトで構成しています
- 画像に代替テキストを付与しています
- アクションボタンにボタンコンポーネントを使用しています

[カード作例 4](./card.stories.ts?controls#Example4)

### ソースコード

<details>
<summary>HTML</summary>

[example-4.html](./example-4.html#.dads-card-example-4-list)

</details>

<details>
<summary>card-example-4.css</summary>

[card-example-4.css](./card-example-4.css)

</details>

#### 依存ファイル

<details>
<summary>button.css</summary>

[button.css](../button/button.css)

</details>

## カード作例 5

リンクと、アクションボタンとして「共有する」ボタンと「あとで読む」ボタンを持つカードです。

- 画像、日付、ラベル、タイトルを含む領域をリンクにしています
- 画像、日付、ラベル、タイトルを含む領域を見出しにしています
- 画像は補佐的な画像であるものとみなし、`alt=""`としています
- アクションボタンにボタンコンポーネントを使用しています

[カード作例 5](./card.stories.ts?controls#Example5)

### ソースコード

<details>
<summary>HTML</summary>

[example-5.html](./example-5.html#.dads-card-example-5-list)

</details>

<details>
<summary>card-example-5.css</summary>

[card-example-5.css](./card-example-5.css)

</details>

#### 依存ファイル

<details>
<summary>button.css</summary>

[button.css](../button/button.css)

</details>

## カード作例 6

全体がフォームコントロールのクリッカブルエリアになっているカードです。

- 見出しがカード内の最初の要素になるように、グリッドレイアウトを使用しています
- チェックボックスとタイトルを関連づけるために`<label>`要素を使用しています
- カード全体をクリッカブルエリアとするために、`label::before`疑似要素をカード全体に広げています

[カード作例 6](./card.stories.ts?controls#Example6)

### ソースコード

<details>
<summary>HTML</summary>

[example-6.html](./example-6.html#.dads-card-example-6-list)

</details>

<details>
<summary>card-example-6.css</summary>

[card-example-6.css](./card-example-6.css)

</details>

#### 依存ファイル

<details>
<summary>checkbox.css</summary>

[checkbox.css](../checkbox/checkbox.css)

</details>
