[Plain](./breadcrumb.stories.ts?controls#Plain)

## コンポーネントのガイドライン

[パンくずナビゲーション（概要）｜デジタル庁デザインシステムβ版](https://design.digital.go.jp/dads/components/breadcrumb/)

## ソースコード

<details>
<summary>HTML</summary>

[plain.html](./plain.html#.dads-breadcrumb)

</details>

<details>
<summary>breadcrumb.css</summary>

[breadcrumb.css](./breadcrumb.css)

</details>

## 使い方

### ラベルを表示する

ラベルを視覚的に表示する場合は、`dads-u-visually-hidden`の代わりに`dads-breadcrumb__label`クラスを使用します。

[with-visible-label.html](./with-visible-label.html#.dads-breadcrumb)

### ホームアイコンを追加する

リンクテキストの前にアイコンを追加できます。アイコンには`dads-breadcrumb__link-icon`クラスと`aria-hidden="true"`を付与します。

[with-home-icon.html](./with-home-icon.html#.dads-breadcrumb)

### マークアップ

#### 同一ページ内で`id`属性の重複を避ける

`aria-labelledby`属性によってナビゲーションのラベルを`id="breadcrumb-label"`で指定しています。同一ページ内に複数のパンくずナビゲーションを配置する場合は、`id`値が重複しないようにユニークな値を付けてください。

```html
<!-- 例: 複数ある場合 -->
<nav class="dads-breadcrumb" aria-labelledby="breadcrumb-2-label">
  <span id="breadcrumb-2-label" class="dads-u-visually-hidden">現在位置</span>
  …
</nav>
```

### アクセシビリティ

#### `aria-labelledby`属性でラベルと紐づける

`<nav>`要素の`aria-labelledby`属性を使用し、ナビゲーションのラベルとして機能する要素と関連付けます。ページ内のランドマークとして名前をつけることで、支援技術ユーザーのナビゲーションの手掛かりになります。

`aria-label`属性を使うことでも同様の結果を得られますが、自動翻訳ツールのサポートが万全でない場合があります。堅牢性の確保のため、原則として`aria-labelledby`属性を使用してください。
