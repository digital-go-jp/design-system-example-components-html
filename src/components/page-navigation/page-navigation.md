[Text](./page-navigation.stories.ts?controls#Text)

## コンポーネントのガイドライン

[ページナビゲーション（概要）｜デジタル庁デザインシステムβ版](https://design.digital.go.jp/dads/components/page-navigation/)

## ソースコード

<details>
<summary>HTML</summary>

#### テキスト型

[text-button.html](./text-button.html#.dads-page-navigation)

#### アウトライン型

[outlined-button.html](./outlined-button.html#.dads-page-navigation)

#### 矢印型

[arrow-button.html](./arrow-button.html#.dads-page-navigation)

</details>

<details>
<summary>page-navigation.css</summary>

[page-navigation.css](./page-navigation.css)

</details>

### 依存ファイル

<details>
<summary>button.css</summary>

[button.css](../button/button.css)

</details>

## 使い方

### ボタンまたはリンクを使用する

ページ遷移がURLの変化を伴う場合は`<a>`要素を、そうでない場合は`<button>`要素を使用します。

```html
<!-- ボタンの場合 -->
<button class="dads-button" type="button" data-type="text" data-size="md" data-control="prev">
  <svg class="dads-button__icon" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <path d="m7.9 12 8-8-1.4-1.4L5.1 12l9.4 9.4 1.4-1.4z" fill="currentcolor"></path>
  </svg>
  前のページ
</button>

<!-- リンクの場合 -->
<a class="dads-button" href="/page/4" data-type="text" data-size="md" data-control="prev">
  <svg class="dads-button__icon" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <path d="m7.9 12 8-8-1.4-1.4L5.1 12l9.4 9.4 1.4-1.4z" fill="currentcolor"></path>
  </svg>
  前のページ
</a>
```

矢印型でも同様に`<button type="button">`と`<a href="...">`を切り替えます。

```html
<!-- ボタンの場合 -->
<button class="dads-page-navigation__arrow-button" type="button" data-size="lg" data-control="prev">
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <path d="m7.9 12 8-8-1.4-1.4L5.1 12l9.4 9.4 1.4-1.4z" fill="currentcolor"></path>
  </svg>
  <span class="dads-u-visually-hidden">前のページ</span>
</button>

<!-- リンクの場合 -->
<a class="dads-page-navigation__arrow-button" href="/page/4" data-size="lg" data-control="prev">
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <path d="m7.9 12 8-8-1.4-1.4L5.1 12l9.4 9.4 1.4-1.4z" fill="currentcolor"></path>
  </svg>
  <span class="dads-u-visually-hidden">前のページ</span>
</a>
```

### ページ数に応じた表示制御

ページ数に応じて、ナビゲーションの表示を切り替えてください。

- 合計1ページのとき、`.dads-page-navigation` 要素自体を出力しない。
- 最初のページのとき、「前のページ」ボタンを出力しない。`disabled`属性は使用しません。
- 最後のページのとき、「次のページ」ボタンを出力しない。`disabled`属性は使用しません。

#### 最初のページ（前のページボタンなし）

[first-page.html](./first-page.html#.dads-page-navigation)

#### 最後のページ（次のページボタンなし）

[last-page.html](./last-page.html#.dads-page-navigation)

### アクセシビリティ

`<nav>` 要素の `aria-label` 属性は、ナビゲーションの対象が伝わるラベルに書き換えてください。ロール名（「ナビゲーション」）と読み上げが重複しないよう、「ページネーション」のような冗長な表現は避けることを推奨します。

```html
<!-- 記事一覧のページナビゲーションの場合 -->
<nav class="dads-page-navigation" aria-label="記事一覧">...</nav>

<!-- 検索結果のページナビゲーションの場合 -->
<nav class="dads-page-navigation" aria-label="検索結果">...</nav>
```

矢印型はボタンに可視テキストがないため、`dads-u-visually-hidden` クラスを使ったスクリーンリーダー向けテキストを必ず含めてください。

```html
<button class="dads-page-navigation__arrow-button" type="button" data-size="lg" data-control="prev">
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <path d="m7.9 12 8-8-1.4-1.4L5.1 12l9.4 9.4 1.4-1.4z" fill="currentcolor"></path>
  </svg>
  <span class="dads-u-visually-hidden">前のページ</span>
</button>
```
