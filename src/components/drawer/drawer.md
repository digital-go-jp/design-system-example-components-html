[Left](./drawer.stories.ts?controls#Left)

## コンポーネントのガイドライン

[ドロワー（概要）｜デジタル庁デザインシステムβ版](https://design.digital.go.jp/dads/components/drawer/)

## ソースコード

<details>
<summary>HTML</summary>

[left.html](./left.html#body>*)

</details>

<details>
<summary>drawer.css</summary>

[drawer.css](./drawer.css)

</details>

### 依存ファイル

<details>
<summary>hamburger-menu-button.css</summary>

[hamburger-menu-button.css](../hamburger-menu-button/hamburger-menu-button.css)

</details>

## 仕様

### バリエーション

| 属性 | 値 | 説明 |
| --- | --- | --- |
| `data-placement` | `left`, `right` | ドロワーの表示位置 |

## 使い方

### インストール

#### 必要なファイル

- **共通**
  - `drawer.css`
- **追加で必要**
  - `hamburger-menu-button.css`（開閉ボタンを使用する場合）

### マークアップ

#### アクセシブルな名前

`<dialog>`要素には`aria-labelledby`属性を使用して、ドロワーにアクセシブルな名前を付与してください。視覚的に見出しが不要な場合は`dads-u-visually-hidden`クラスで非表示にできます。

```html
<dialog id="dads-drawer" class="dads-drawer" data-placement="right" aria-labelledby="dads-drawer-heading">
  <h2 id="dads-drawer-heading" class="dads-u-visually-hidden">メニュー</h2>
  ...
</dialog>
```

#### 表示位置

`data-placement`属性に`left`または`right`を指定して、ドロワーの表示位置を切り替えます。

##### 左側に表示する

[left.html](./left.html#body>*)

##### 右側に表示する

[right.html](./right.html#body>*)

#### スクロールおよびリフローの制御

本コードスニペットでは、ドロワーの実装に`<dialog>`要素によるモーダルダイアログを使用しています。モーダルダイアログを適切な形で提示するために、以下に対応する必要があります。

1. モーダルダイアログが表示されている間、メインコンテンツのスクロールを抑制する
2. モーダルダイアログの表示／非表示に伴うスクロールバーの有無の変化が引き起こすリフローを抑制する

具体的には、グローバルCSSに以下のようなスタイルを追加します。

```css
html {
  scrollbar-gutter: stable; /* 2 */
}

html:has(:modal) {
  overflow: clip; /* 1 */
  scrollbar-gutter: auto; /* 2 */
}

body:has(:modal) {
  overflow: auto; /* 1 */
  scrollbar-gutter: stable; /* 2 */
}
```

コードスニペット（HTML版）では上記のコードが含まれた状態のグローバルCSSを提供しています。プロダクトの状況に応じて適宜書き換えて使用してください。

#### Invoker Commands APIポリフィルを使用する

本コードスニペットでは、ドロワーの開閉にInvoker Commands APIを使用しています。このAPIを使用すると、ドロワーの開閉のためのJavaScriptコードが不要になります。提供時点でChromeおよびEdgeのみが対応しています。対応していないブラウザではドロワーを立ち上げることができませんが、ポリフィルライブラリを導入することで未対応ブラウザでも動作させることが可能です。

将来的に、未対応ブラウザを使用するユーザーが十分に少なくなったと判断できたタイミングで、ポリフィルの読み込みを削除して構いません。

以下に代表的なポリフィルの使用方法を記載します。

##### 1. パッケージをダウンロードし使用する

以下のコマンドでライブラリをダウンロードし、静的配信されるディレクトリに配置します。

```
curl -LO https://unpkg.com/invokers-polyfill/invoker.min.js
```

`<script>`タグでライブラリを読み込みます。

```html
<script src="path/to/invoker.min.js"></script>
```

##### 2. npmパッケージを使用する

以下のコマンドでライブラリをインストールします。

```sh
npm install invokers-polyfill
```

エントリーポイントのJavaScriptから読み込みます。

```js
import "invokers-polyfill";
```
