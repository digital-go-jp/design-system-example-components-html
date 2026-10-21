[Playground](./language-selector.stories.ts?controls#Playground)

## コンポーネントのガイドライン

[ランゲージセレクター（概要）｜デジタル庁デザインシステムβ版](https://design.digital.go.jp/dads/components/language-selector/)

## ソースコード

<details>
<summary>HTML</summary>

[playground.html](./playground.html#.dads-language-selector)

</details>

<details>
<summary>language-selector.css</summary>

[language-selector.css](./language-selector.css)

</details>

<details>
<summary>language-selector.js</summary>

[language-selector.js](./language-selector.js)

</details>

### 依存ファイル

<details>
<summary>menu-list-box.css</summary>

[menu-list-box.css](../menu-list-box/menu-list-box.css)

</details>

<details>
<summary>menu-list-box.js</summary>

[menu-list-box.js](../menu-list-box/menu-list-box.js)

</details>

<details>
<summary>menu-list.css</summary>

[menu-list.css](../menu-list/menu-list.css)

</details>

## 仕様

### 機能仕様

ランゲージセレクターは`<dads-language-selector>`カスタム要素として実装されており、以下の機能を提供します。

#### キーボード操作

| キー | 動作 |
| --- | --- |
| `Enter` / `Space` | メニューの開閉 |
| `↓` | 次のメニュー項目にフォーカス移動（開いている場合） |
| `↑` | 前のメニュー項目にフォーカス移動（開いている場合） |
| `Home` | 最初のメニュー項目にフォーカス移動 |
| `End` | 最後のメニュー項目にフォーカス移動 |
| `Escape` | メニューを閉じてボタンにフォーカス移動 |

#### その他の動作

- メニュー外をクリックするとメニューが閉じます
- メニュー項目をクリックするとメニューが閉じてボタンにフォーカスが戻ります
- フォーカスがメニュー外に移動するとメニューが閉じます

## 使い方

### インストール

#### 必要なファイル

- **共通**
  - `language-selector.css`
  - `language-selector.js`
  - `menu-list.css`
  - `menu-list-box.css`
  - `menu-list-box.js`

スクリプトを読み込む際は必ず、`<script type="module">`を使用しES Moduleとして読み込んでください。

### 現在の言語を示す

現在選択されている言語のメニュー項目には、`aria-current="true"`と`data-current`属性を設定します。これにより、チェックマークアイコンが表示されます。

```html
<a class="dads-menu-list__item" data-js-menu-item href="#" lang="ja" hreflang="ja" data-type="box" data-size="regular" data-current aria-current="true">
  <!-- チェックマークアイコン -->
  <span class="dads-menu-list__label">日本語</span>
</a>
```

### 言語属性の設定

各メニュー項目には`lang`属性と`hreflang`属性を設定し、その言語のページへのリンクを`href`属性に指定してください。

```html
<a class="dads-menu-list__item" data-js-menu-item href="/en/" lang="en" hreflang="en" data-type="box" data-size="regular">
```
