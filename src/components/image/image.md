[Playground](./image.stories.ts?controls#Playground)

## コンポーネントのガイドライン

[画像（概要）｜デジタル庁デザインシステムβ版](https://design.digital.go.jp/dads/components/image/)

## ソースコード

<details>
<summary>HTML</summary>

[playground.html](./playground.html#.dads-image)

</details>

<details>
<summary>image.css</summary>

[image.css](./image.css)

</details>

## 使い方

### 画像の枠線を表示しない

デフォルトでは`.dads-image__image-area`要素に枠線が表示されます。枠線を表示しないようにするには、`data-bordered`属性を指定しないでください。

[borderless.html](./borderless.html#.dads-image)

### リンク付き画像にする

画像にリンクを設定するには、`.dads-image__image-area`を`<a>`要素に変更します。

[with-link.html](./with-link.html#.dads-image)

### 幅100%で表示する

画像の固有サイズにかかわらずコンテナ幅いっぱいに表示するには、`.dads-image`要素に`data-full-width`属性を追加します。

[full-width.html](./full-width.html#.dads-image)

### `<picture>`要素を使う

画面幅に応じて異なる画像を出し分けるには、`<picture>`要素を使用できます。

[with-picture-element.html](./with-picture-element.html#.dads-image)

### キャプションを省略する

キャプションが不要な場合は、`<figcaption>`要素を省略できます。

[without-caption.html](./without-caption.html#.dads-image)

### キャプションの枠線のスタイルを変更する

キャプションの枠線のスタイルを変更するには、`.dads-image__caption`要素の`data-style`属性に`solid`を指定します。

[caption-solid.html](./caption-solid.html#.dads-image)

### アクセシビリティ

- `<img>`要素には適切な`alt`属性を必ず設定してください。`alt`属性に空の文字列を設定したり、`alt`属性を省略したりすることは許容されません。
