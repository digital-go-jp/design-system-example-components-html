import carousel1024 from "./docs/carousel-1024.webp";
import carousel1024At2x from "./docs/carousel-1024@2x.webp";

<div class="border-image">
  <img src={carousel1024} srcSet={`${carousel1024At2x} 2x`} alt="Normalカルーセルのスクリーンショット" width="768" height="320" style={{ maxWidth: '100%', height: 'auto' }} />
</div>

コンテナ幅が1024pxの地点にブレークポイントを持つカルーセルの作例です。各スライドは横幅696pxです。

コードスニペットにおける実際の動作は、ナビゲーションから[各Story](?path=/story/components-カルーセル--container)を参照してください。

## コンポーネントのガイドライン

[カルーセル（概要）｜デジタル庁デザインシステムβ版](https://design.digital.go.jp/dads/components/carousel/)

## ソースコード

<details>
<summary>HTML</summary>

#### 複数スライド（マルチ）

[container.html](./container.html#dads-carousel)

#### シングル（スライドが1枚のみ）

[key-visual-single.html](./key-visual-single.html#.dads-carousel-single)

</details>

<details>
<summary>carousel.css</summary>

[carousel.css](./carousel.css)

</details>

<details>
<summary>carousel-single.css</summary>

[carousel-single.css](./carousel-single.css)

</details>

<details>
<summary>carousel.js</summary>

[carousel.js](./carousel.js)

</details>

### 依存ファイル

<details>
<summary>disclosure.css</summary>

[disclosure.css](../disclosure/disclosure.css)

</details>

## 仕様

### バリエーション

| 属性 | 値 | 説明 |
| --- | --- | --- |
| `breakpoint-rem` | 数値（例：`64`） | レスポンシブのブレークポイント。単位は`rem` |
| `data-js-unit` | 文字列（例：`スライド`） | スライドの番号に前置きする単位 |

## 使い方

### インストール

#### 複数スライド（マルチ）の場合

- `carousel.css`
- `carousel.js`
- `disclosure.css`

#### シングル（1枚のみ）の場合

- `carousel-single.css`

スクリプトを読み込む際は必ず、`<script type="module">`を使用しES Moduleとして読み込んでください。

### 基底要素とラベル

カルーセルの基底要素は`<dads-carousel>`カスタム要素です。この要素には`role="region"`を付与し、適切なラベルを設定する必要があります。

#### 見出しがある場合

見出しを使用する場合は、見出し要素にIDを付与し、基底要素の`aria-labelledby`属性でそのIDを参照します。

```html
<dads-carousel class="dads-carousel" role="region" aria-labelledby="carousel-heading" ...>
  <div class="dads-carousel__inner">
    <h2 id="carousel-heading" class="dads-carousel__heading">開催中のイベント</h2>
    ...
  </div>
</dads-carousel>
```

[Container](./carousel.stories.ts?controls#Container)

#### 見出しがない場合

見出しを使用しない場合は、基底要素の`aria-label`属性で直接ラベルを指定します。

```html
<dads-carousel class="dads-carousel" role="region" aria-label="スライドショー" ...>
  ...
</dads-carousel>
```

[KeyVisual](./carousel.stories.ts?controls#KeyVisual)

### メインパネル

`.dads-carousel__main`内のメインパネルには、1枚目のスライドの情報を記述します。リンクがない場合は`href`属性を省略できます。

[ContainerWithoutLink](./carousel.stories.ts?controls#ContainerWithoutLink)

### ネクストパネル

`.dads-carousel__next`内のネクストパネルには、2枚目のスライドの情報を記述します。画像の`alt`属性は空にします。

### ステップナビゲーション

`.dads-carousel__step-nav`要素内にスライド枚数分の`<li>`要素を記述してください。

### すべてのスライド

`.dads-carousel__others-content`要素内の`<ul>`要素に、最初のスライドも含め全てのスライドの情報を記述します。

### シングル（1枚のみ）

スライドが1枚のみの場合は、シンプルなマークアップを使用できます。

[key-visual-single.html](./key-visual-single.html#.dads-carousel-single)

画像にリンクを設定する場合は、`<span>`要素を`<a>`要素に置き換えてください。

```html
<div class="dads-carousel-single">
  <a class="dads-carousel-single__link" href="...">
    <img class="dads-carousel-single__image" src="..." alt="..." width="..." height="...">
  </a>
</div>
```

## カスタマイズ

### 高解像度の画像を提供する場合

高解像度ディスプレイ向けに2倍の解像度の画像を提供する場合は、`<img>`要素に`srcset`属性を追加します。

```html
<img src="image.webp" srcset="image@2x.webp 2x" alt="..." width="..." height="...">
```

### ブレークポイントを変更する

規定のブレークポイントはコンテナ幅を基準とした1024px（64rem）です。ブレークポイントを変更するにはHTMLとCSSの両方を修正します。

HTMLは`breakpoint-rem`属性値を修正してください。

```html
<dads-carousel breakpoint-rem="64" ...>
```

CSSは`carousel.css`にある`@container (min-width: 64rem)`の記述を全て修正してください。

### 多言語化

カルーセルのコードスニペットには日本語のテキストが含まれています。翻訳する場合は、表示されているテキストに加え、下記の非表示テキストも翻訳してください。

- `.dads-carousel`要素の`aria-label`属性
- `.dads-carousel`要素の`data-js-unit`属性
- `.dads-carousel__main-link`要素に含まれるスライドの番号付き表記
- `.dads-carousel__step-nav`要素の`aria-label`属性
- `.dads-carousel__step`要素に含まれるスライドの番号付き表記
- `.dads-carousel__page-nav`要素に含まれる「次のスライド」および「前のスライド」
