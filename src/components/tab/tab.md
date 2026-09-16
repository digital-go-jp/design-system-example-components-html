[Playground](./tab.stories.ts?controls#Playground)

## コンポーネントのガイドライン

[タブ（概要）｜デジタル庁デザインシステムβ版](https://design.digital.go.jp/dads/components/tab/)

## タイプ概要

タブコンポーネントには3つのタイプがあります。

| タイプ | カスタム要素 | 説明 |
| --- | --- | --- |
| **Tabキーナビゲーション** | `<dads-tab>` | ARIAタブロールを使わず、リンクのクリックでパネルを切り替える。情報提供サイトや行政サービスサイトで使用する |
| **矢印キーナビゲーション** | `<dads-tab-aria>` | ARIA Authoring Practices GuideのTabsパターンに準拠したタブ。ウェブアプリケーションや管理画面で使用する |
| **リンクリスト** | （JSなし） | ページ遷移型のリンクリスト。各タブがページに別れている場合に使用する |

## ソースコード

### Tabキーナビゲーションタイプ

<details>
<summary>HTML</summary>

[basic.html](./basic.html#body>*)

</details>

<details>
<summary>tab.css</summary>

[tab.css](./tab.css)

</details>

<details>
<summary>tab.js</summary>

[tab.js](./tab.js)

</details>

### 矢印キーナビゲーションタイプ

<details>
<summary>HTML</summary>

[basic-aria.html](./basic-aria.html#.dads-tab)

</details>

<details>
<summary>tab.css</summary>

[tab.css](./tab.css)

</details>

<details>
<summary>tab-aria.js</summary>

[tab-aria.js](./tab-aria.js)

</details>

### リンクリストタイプ

<details>
<summary>HTML</summary>

[basic-static.html](./basic-static.html#.dads-tab)

</details>

<details>
<summary>tab.css</summary>

[tab.css](./tab.css)

</details>

## Tabキーナビゲーションタイプ

[Playground (Tab key navigation)](./tab.stories.ts?controls#Playground)

### 仕様

#### バリエーション

| 属性 | 値 | 説明 |
| --- | --- | --- |
| `data-position` | `top`（デフォルト）, `bottom`, `left`, `right` | タブリストの位置を指定。`bottom`の場合、HTML上のタブリストの位置も変更する必要があります（「使い方」を参照）。 |

#### イベント

タブが切り替わったときに `tab-change` イベントを発火します。

```javascript
const tab = document.querySelector("dads-tab");
tab.addEventListener("tab-change", (e) => {
  console.log("選択されたタブ:", e.detail.selectedTab);
  console.log("選択されたタブのラベル", e.detail.selectedTabLabel);
  console.log("選択されたパネル:", e.detail.selectedPanel);
  console.log("選択されたインデックス:", e.detail.selectedIndex);
});
```

#### 見出しの自動挿入

JavaScriptが各パネルの先頭に、タブラベルと同じテキストの見出しを自動で挿入します。見出しレベルは、タブ全体の見出しレベルに+1したものになります（例：タブ全体の見出しに `<h2>` を使用した場合、`<h3>` が挿入されます）。挿入された見出しは視覚的には非表示になりますが、スクリーンリーダーには読み上げられます。

### 使い方

#### インストール

必要なファイル：

- `tab.css`
- `tab.js`

スクリプトを読み込む際は必ず、`<script type="module">` を使用しES Moduleとして読み込んでください。

#### タブリストの位置

`data-position` 属性でタブリストの位置を変更できます。デフォルトは `top`（上）です。

`data-position="bottom"` の場合、HTMLでもタブリストをパネルの後に配置してください。

```html
<dads-tab class="dads-tab" data-position="bottom">
  <div class="dads-tab__panels">...</div>
  <ul class="dads-tab__list" aria-labelledby="...">...</ul>
</dads-tab>
```

#### 見出し要素

- タブ全体にかかる見出し（`<h1>`〜`<h5>`）が必要です
- `ul.dads-tab__list` には `aria-labelledby` 属性で、タブ全体の見出し要素のIDを指定してください
- タブパネルの先頭には見出しが自動で挿入されるため、パネル内で使用する見出しは、タブ全体の見出しレベルよりも2つ大きいレベルを使用してください（例：タブ全体の見出しが `<h2>` の場合、自動挿入されるパネル内見出しは `<h3>` となります）

#### タブ要素とパネルのID

タブには `href` 属性で対応するパネルのIDを指定します。パネルには `id` 属性を設定し、タブの `href` 属性と一致させてください。

```html
<li><a class="dads-tab__tab" href="#panel-1" data-js-tab aria-current="true"><span>タブラベル</span></a></li>
```

```html
<div id="panel-1" class="dads-tab__panel">
  タブパネルの内容
</div>
```

#### 現在のタブ

表示中のパネルに対応するタブリンクには `aria-current="true"` を付けてください。JavaScriptが初期化時に読み取り、最初に表示するパネルを決定します。

```html
<li><a class="dads-tab__tab" href="#panel-1" data-js-tab aria-current="true"><span>タブラベル</span></a></li>
```

#### 読み込み時のちらつきを抑制する

JavaScriptの読み込みが完了するまでの間、全パネルが一瞬縦に表示されてしまうことがあります。これを避けたい場合は、最初から非表示にしたいパネルに `hidden` 属性をHTMLに記載してください。

```html
<div id="panel-2" class="dads-tab__panel" hidden>
  タブパネルの内容（2番目）
</div>
```

ただし、`hidden` を記載するとJavaScriptが無効な環境では該当パネルが表示されなくなります。JavaScriptの利用が前提であるウェブサイトやウェブアプリケーション以外では、原則として `hidden` 属性は使用しないでください。

## 矢印キーナビゲーションタイプ

[Playground (Arrow key navigation)](./tab.stories.ts?controls#PlaygroundAria)

### 仕様

#### バリエーション

| 属性 | 値 | 説明 |
| --- | --- | --- |
| `data-position` | `top`（デフォルト）, `bottom`, `left`, `right` | タブリストの位置を指定。`bottom`の場合、HTML上のタブリストの位置も変更する必要があります（「使い方」を参照）。 |
| `data-activation` | `auto`（デフォルト）, `manual` | タブの選択方式。`auto`はフォーカス追従型、`manual`は手動確認型 |

#### キーボード操作

フォーカスと選択の挙動を `data-activation` 属性で切り替えることができます。原則として `auto`（フォーカス追従型）を推奨しますが、タブ選択と同時に内容の読み込み等の重い処理が走る場合などは、`manual` を使用してください。

##### `data-activation="auto"`（デフォルト：フォーカス追従型）

| キー | 動作 |
| --- | --- |
| 上下左右矢印キー | タブを移動して選択 |
| Home | 最初のタブに移動して選択 |
| End | 最後のタブに移動して選択 |

##### `data-activation="manual"`（手動型）

| キー | 動作 |
| --- | --- |
| 上下左右矢印キー | フォーカスを移動 |
| Home | 最初のタブにフォーカスを移動 |
| End | 最後のタブにフォーカスを移動 |
| Enter | フォーカス中のタブを選択 |
| Space | フォーカス中のタブを選択 |

#### イベント

タブが切り替わったときに `tab-change` イベントを発火します。

```javascript
const tab = document.querySelector("dads-tab-aria");
tab.addEventListener("tab-change", (e) => {
  console.log("選択されたタブ:", e.detail.selectedTab);
  console.log("選択されたタブのラベル", e.detail.selectedTabLabel);
  console.log("選択されたパネル:", e.detail.selectedPanel);
  console.log("選択されたインデックス:", e.detail.selectedIndex);
});
```

### 使い方

#### インストール

必要なファイル：

- `tab.css`
- `tab-aria.js`

スクリプトを読み込む際は必ず、`<script type="module">` を使用しES Moduleとして読み込んでください。

#### タブリストの位置

`data-position` 属性でタブリストの位置を変更できます。デフォルトは `top`（上）です。

`data-position="bottom"` の場合、HTMLでもタブリストをパネルの後に配置してください。

```html
<dads-tab-aria class="dads-tab" data-position="bottom">
  <div class="dads-tab__panels">...</div>
  <div class="dads-tab__list" role="tablist">...</div>
</dads-tab-aria>
```

左・右にタブリストを配置する場合、`[role="tablist"]` に `aria-orientation="vertical"` を追加してください。

```html
<dads-tab-aria class="dads-tab" data-position="left">
  <div class="dads-tab__list" role="tablist" aria-orientation="vertical">
    ...
  </div>
  <div class="dads-tab__panels">...</div>
</dads-tab-aria>
```

#### タブ要素

タブには `<a>` 要素を使用し、`href` 属性で対応するパネルのIDを指定します。

```html
<a class="dads-tab__tab" href="#panel-1" role="tab" aria-selected="true">
  <span>タブラベル</span>
</a>
```

#### パネルのID

パネルには必ず `id` 属性を設定し、タブの `href` 属性と一致させてください。

```html
<div id="panel-1" class="dads-tab__panel" role="tabpanel" tabindex="0">
  タブパネルの内容
</div>
```

#### 読み込み時のちらつきを抑制する

JavaScriptの読み込みが完了するまでの間、全パネルが一瞬縦に表示されてしまうことがあります。これを避けたい場合は、最初から非表示にしたいパネルに `hidden` 属性をHTMLに記載してください。

```html
<div id="panel-2" class="dads-tab__panel" role="tabpanel" tabindex="0" hidden>
  タブパネルの内容（2番目）
</div>
```

ただし、`hidden` を記載するとJavaScriptが無効な環境では該当パネルが表示されなくなります。JavaScriptの利用が前提であるウェブサイトやウェブアプリケーション以外では、原則として `hidden` 属性は使用しないでください。

## リンクリストタイプ

[Playground (Classic link list)](./tab.stories.ts?controls#PlaygroundStatic)

### 仕様

#### バリエーション

| 属性 | 値 | 説明 |
| --- | --- | --- |
| `data-position` | `top`（デフォルト）, `bottom`, `left`, `right` | タブリストの位置を指定。`bottom`の場合、HTML上のタブリストの位置も変更する必要があります（「使い方」を参照）。 |

### 使い方

#### インストール

必要なファイル：

- `tab.css`

#### タブリストの位置

`data-position` 属性でタブリストの位置を変更できます。デフォルトは `top`（上）です。

`data-position="bottom"` の場合、HTMLでもタブリストをパネルの後に配置してください。

```html
<div class="dads-tab" data-position="bottom">
  <div class="dads-tab__panels">...</div>
  <ul class="dads-tab__list">...</ul>
</div>
```

#### 現在のタブ

現在表示中のページに対応するタブには `aria-current="page"` を付け、`href` 属性は**省略**してください。

```html
<a class="dads-tab__tab" aria-current="page">
  <span>タブラベル</span>
</a>
```

#### その他のタブ

他のページへ遷移するタブは通常のリンクとして `href` 属性に遷移先URLを指定します。

```html
<a class="dads-tab__tab" href="/other-page">
  <span>タブラベル</span>
</a>
```
