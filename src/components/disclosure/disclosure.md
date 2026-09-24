[Playground](./disclosure.stories.ts?controls#Playground)

## コンポーネントのガイドライン

[ディスクロージャー（概要）｜デジタル庁デザインシステムβ版](https://design.digital.go.jp/dads/components/disclosure/)

## ソースコード

<details>
<summary>HTML</summary>

[playground.html](./playground.html#.dads-disclosure)

</details>

<details>
<summary>disclosure.css</summary>

[disclosure.css](./disclosure.css)

</details>

## 使い方

### テキストのスタイル

このコンポーネントは、フォントの種類・サイズ・行の高さを指定していません。テキストには配置先から継承したスタイルが適用されます。必要に応じて、配置先でこれらのスタイルを指定してください。

### マークアップ

#### 開閉状態

ディスクロージャーを最初から開いた状態にするには、`<details>`要素に`open`属性を追加します。

```html
<details class="dads-disclosure" open>
  ...
</details>
```

#### 先頭に戻るリンク

コンテンツが長い場合、コンテンツ末尾に「先頭に戻るリンク」を配置することを推奨します。このリンクは`<summary>`要素の`id`属性を参照します。

```html
<details class="dads-disclosure">
  <summary id="disclosure-1" class="dads-disclosure__summary">
    ...
    ダミーテキストとは何ですか？
  </summary>
  <div class="dads-disclosure__content">
    ...
    <a class="dads-disclosure__back-link" href="#disclosure-1">
      <svg class="dads-disclosure__back-link-icon" width="24" height="24" fill="none" aria-hidden="true">
        <path d="M6 7V14.5C6 16.8 8.2 19 10.5 19C12.8 19 15 16.8 15 14.5V6M10.709 9.7L15 5.414L19.291 9.7" stroke="currentcolor" stroke-width="2" />
      </svg>
      「ダミーテキストとは何ですか？」の先頭に戻る
    </a>
  </div>
</details>
```
