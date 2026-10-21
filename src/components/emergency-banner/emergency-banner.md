[Playground](./emergency-banner.stories.ts?controls#Playground)

## コンポーネントのガイドライン

[緊急時バナー（概要）｜デジタル庁デザインシステムβ版](https://design.digital.go.jp/dads/components/emergency-banner/)

## ソースコード

<details>
<summary>HTML</summary>

[playground.html](./playground.html#.dads-emergency-banner)

</details>

<details>
<summary>emergency-banner.css</summary>

[emergency-banner.css](./emergency-banner.css)

</details>

## 使い方

### マークアップ

緊急時バナーは`<article>`要素を使用します。見出しには適切な見出しレベル（`<h1>`〜`<h6>`）を設定してください。

### リンクボタン

リンクボタンはオプションです。不要な場合は`.dads-emergency-banner__action`要素を削除してください。

リンクボタンが別タブで開く場合は、`target="_blank"`を指定し、アイコンで視覚的に示します。

```html
<a class="dads-emergency-banner__button" href="#" target="_blank">
  指定避難所を確認する
  <span class="dads-emergency-banner__button-icon">
    <svg class="dads-emergency-banner__button-icon-glyph" width="16" height="16" viewBox="0 0 48 48" role="img" aria-label="新規タブで開きます"><path d="M22 6V9H9V39H39V26H42V42H6V6H22ZM42 6V20H39V11.2L21 29L19 27L36.8 9H28V6H42Z" fill="currentcolor"/></svg>
  </span>
</a>
```

アイコンには`role="img"`と`aria-label`で代替テキストを提供し、支援技術のユーザーにも別タブで開くことを伝えます。
