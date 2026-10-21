[Playground](./search-box.stories.ts?controls#Playground)

## コンポーネントのガイドライン

[検索ボックス（概要）｜デジタル庁デザインシステムβ版](https://design.digital.go.jp/dads/components/search-box/)

## ソースコード

<details>
<summary>HTML</summary>

#### 基本形

[playground.html](./playground.html#.dads-search-box)

#### 詳細検索パネルあり

[with-detail.html](./with-detail.html#.dads-search-box)

</details>

<details>
<summary>search-box.css</summary>

[search-box.css](./search-box.css)

</details>

### 依存ファイル

<details>
<summary>button.css</summary>

[button.css](../button/button.css)

</details>

<details>
<summary>disclosure.css</summary>

[disclosure.css](../disclosure/disclosure.css)

</details>

## 仕様

### バリエーション

| 属性 | 値 | 説明 |
| --- | --- | --- |
| `data-size` | `lg`（デフォルト）, `md`, `sm` | 検索ボックスのサイズ |

## 使い方

### インストール

#### 必要なファイル

- **共通**
  - `search-box.css`
  - `button.css`
- **追加で必要**
  - `disclosure.css`（詳細検索パネルを使用する場合）

### サイズを変更する

`data-size`属性を`.dads-search-box`要素と`.dads-button`要素の両方に同じ値で指定します。

```html
<div class="dads-search-box" data-size="md">
  ...
  <button class="dads-button" type="submit" data-type="solid-fill" data-size="md">検索</button>
</div>
```

`sm`サイズでは、絞り込みオプション（`.dads-search-box__select`）のラベル（`<span>`）が視覚的に非表示になります（DOM上には存在します）。

### 絞り込みオプションを非表示にする

絞り込みオプション（`.dads-search-box__select`）は任意です。検索対象を絞り込む必要がない場合は、この要素を削除してください。

[without-select.html](./without-select.html#.dads-search-box)

### 詳細検索パネルを追加する

詳細検索パネルは`.dads-search-box__detail`クラスと`dads-disclosure`クラスを付与した`<details>`要素で実装します。`.dads-search-box__fields`と`.dads-button`の間に配置します（「詳細検索パネルあり」のHTMLを参照）。

#### 開閉状態

初期状態で開いておく場合は`<details>`要素に`open`属性を追加します。

#### パネルの中身

`.dads-disclosure__content`内のコンテンツは自由に構成できます。デモでは[ラジオボタン](?path=/docs/components-ラジオボタン--docs)や[チェックボックス](?path=/docs/components-チェックボックス--docs)を使用しています。実装例は上記「詳細検索パネルあり」の[with-detail.html](./with-detail.html#.dads-search-box)を参照してください。

### アクセシビリティ

検索フィールドには必ずラベルを付けてください。

#### 画面上にラベルがある場合

画面上に表示される見出しなどがラベルとして機能する場合、その要素に`id`属性を設定し、検索フィールドの`aria-labelledby`属性にその`id`を指定します。

```html
<h1 id="site-search-heading">サイト内検索</h1>

<label class="dads-search-box__input">
  <svg ...>...</svg>
  <input type="search" name="q" aria-labelledby="site-search-heading">
</label>
```

#### 画面上にラベルがない場合

画面上に表示されるラベルがない場合、検索フィールドの直前に視覚的に非表示のラベル（`dads-u-visually-hidden`クラスを付与）を配置します。

```html
<label class="dads-search-box__input">
  <svg ...>...</svg>
  <span class="dads-u-visually-hidden">サイト内検索</span>
  <input type="search" name="q">
</label>
```
