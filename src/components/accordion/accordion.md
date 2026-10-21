[Playground](./accordion.stories.ts?controls#Playground)

## コンポーネントのガイドライン

[アコーディオン（概要）｜デジタル庁デザインシステムβ版](https://design.digital.go.jp/dads/components/accordion/)

## ソースコード

<details>
<summary>HTML</summary>

[playground.html](./playground.html#.dads-accordion)

</details>

<details>
<summary>accordion.css</summary>

[accordion.css](./accordion.css)

</details>

## 使い方

### マークアップ

#### 見出しレベル

`<summary>`内の見出しは、ページの見出し階層に合わせて適切なレベル（`<h2>`〜`<h6>`）を選択してください。

#### 開閉状態

アコーディオンを最初から開いた状態にするには、`<details>`要素に`open`属性を追加します。

```html
<details class="dads-accordion" open>
  ...
</details>
```

#### 先頭に戻るリンク

コンテンツが長い場合、コンテンツ末尾に「先頭に戻るリンク」を配置することを推奨します。このリンクは`<summary>`要素の`id`属性を参照します。

```html
<details class="dads-accordion">
  <summary id="accordion-1" class="dads-accordion__summary">
    ...
    <h3>ダミーテキストとは何ですか？</h3>
  </summary>
  <div class="dads-accordion__content">
    ...
    <a href="#accordion-1" class="dads-accordion__back-link">
      <svg class="dads-accordion__back-link-icon" width="24" height="24" fill="none" aria-hidden="true">
        <path d="M6 7V14.5C6 16.8 8.2 19 10.5 19C12.8 19 15 16.8 15 14.5V6M10.709 9.7L15 5.414L19.291 9.7" stroke="currentcolor" stroke-width="2" />
      </svg>
      「ダミーテキストとは何ですか？」の先頭に戻る
    </a>
  </div>
</details>
```
