[Playground](./blockquote.stories.ts?controls#Playground)

## コンポーネントのガイドライン

[引用ブロック（概要）｜デジタル庁デザインシステムβ版](https://design.digital.go.jp/dads/components/blockquote/)

## ソースコード

<details>
<summary>HTML</summary>

[playground.html](./playground.html#.dads-blockquote)

</details>

<details>
<summary>blockquote.css</summary>

[blockquote.css](./blockquote.css)

</details>

## 使い方

### テキストのスタイル

このコンポーネントは、フォントの種類・サイズ・行の高さを指定していません。テキストには配置先から継承したスタイルが適用されます。必要に応じて、配置先でこれらのスタイルを指定してください。

### 複数の段落を含める

引用文には複数の段落を含めることができます。最初と最後の段落のマージンは自動的に調整されます。

[multiple-paragraphs.html](./multiple-paragraphs.html#.dads-blockquote)

### リストを含める

引用文にはリストを含めることもできます。この例では`list.css`が必要です。

[with-list.html](./with-list.html#.dads-blockquote)
