[Playground](./blockquote.stories.ts?controls#Playground)

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

### 複数の段落を含める

引用文には複数の段落を含めることができます。最初と最後の段落のマージンは自動的に調整されます。

[multiple-paragraphs.html](./multiple-paragraphs.html#.dads-blockquote)

### リストを含める

引用文にはリストを含めることもできます。この例では`list.css`が必要です。

[with-list.html](./with-list.html#.dads-blockquote)

## 実装仕様

- 引用ブロックコンポーネント自体には`font-size`や`line-height`等のテキスト関連のスタイルは指定されていません。引用ブロック内のテキストは、親要素のスタイルを継承します。
