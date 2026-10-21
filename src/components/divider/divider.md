[Playground](./divider.stories.ts?controls#Playground)

## コンポーネントのガイドライン

[ディバイダー（概要）｜デジタル庁デザインシステムβ版](https://design.digital.go.jp/dads/components/divider/)

## ソースコード

<details>
<summary>HTML</summary>

#### hr要素（主題区切り）

[playground.html](./playground.html#.dads-divider)

#### div要素（装飾）

[decorative.html](./decorative.html#.dads-divider)

</details>

<details>
<summary>divider.css</summary>

[divider.css](./divider.css)

</details>

## 仕様

### バリエーション

| 属性 | 値 | 説明 |
| --- | --- | --- |
| `data-color` | `solid-gray-420`, `solid-gray-536`, `black` | 線の色 |
| `data-style` | `solid`, `dashed` | 線のスタイル |
| `data-width` | `1`, `2`, `3`, `4` | 線の太さ（px） |

## 使い方

### 要素の選択

#### hr要素を使用する場合

コンテンツの主題が変わる箇所に配置する場合は`<hr>`要素を使用してください。`<hr>`要素はHTMLの仕様上「主題区切り（thematic break）」を表します。

```html
<p>前のトピックに関する内容...</p>
<hr class="dads-divider" data-color="solid-gray-420" data-style="solid" data-width="1" />
<p>次のトピックに関する内容...</p>
```

#### div要素を使用する場合

純粋に視覚的な装飾として水平線を表示したい場合は`<div>`要素を使用してください。見出しの前後に装飾線を入れる場合など、主題の区切りを意図しない場面に適しています。

```html
<div class="dads-divider" data-color="solid-gray-420" data-style="solid" data-width="1"></div>
<h2>見出し</h2>
```
