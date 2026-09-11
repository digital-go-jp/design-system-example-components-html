---
name: write-document
description: コンポーネントのMDXドキュメントを作成・更新する
---

# コンポーネントドキュメント執筆スキル

デジタル庁デザインシステム（HTML版）のコンポーネントドキュメント（MDX / Markdown）を作成・更新するためのガイドラインです。

## ドキュメントの配置場所とファイルの役割分担

各コンポーネントのドキュメントは、`.mdx`と`.md`の2ファイルに分かれています。

```
src/components/<component-name>/<component-name>.mdx  # Storybookにインデックスさせるための薄いスタブ（4〜5行）
src/components/<component-name>/<component-name>.md   # ドキュメント本文（素のMarkdown）
```

- **`.mdx`（スタブ）**: Storiesのimportと`<Meta>`・`<Content>`だけを書く。本文は一切書かない。
- **`.md`（本文）**: 実際のドキュメント内容を素のMarkdownで書く。`.storybook/dads-md/`にあるカスタムViteプラグインが、ビルド時にこの`.md`を完全なMDXへ自動変換する。

**執筆対象は`.md`ファイルのみ**です。`.mdx`は新規作成時に1度だけ雛形通りに書けば、以降触る必要はありません。

## `.mdx`スタブのテンプレート

新規コンポーネント作成時は、以下の5行をコンポーネント名を置換した上でそのまま書きます。

```mdx
import * as ComponentNameStories from "./component-name.stories";
import Content from "./component-name.md";

<Meta of={ComponentNameStories} />
<Content />
```

**注意:**
- `@storybook/addon-docs/blocks`の`import`文は書かない（プラグインが自動注入する）
- `Title`/`Subtitle`/`Description`等のブロックもここには書かない（`.md`側にも書かない。自動生成される）

## ドキュメントシステムの仕組み（`.md`を書く前に理解すること）

`.storybook/dads-md/`のViteプラグイン（`index.mjs` + `transform.mjs`）が、`.md`の内容を以下のように自動的に完全なMDXへ変換します。

1. **ヘッダーの自動生成**: `@storybook/addon-docs/blocks`の一括import、Storiesの自動import（同ディレクトリの`*.stories.ts`を自動検出）、`<Unstyled><div className="prose"><Title /><Subtitle /><Description />`を自動的に先頭へ挿入する
2. **本文の変換**: `.md`内の「行全体がMarkdownリンクだけで構成されている行」（例: `[playground.html](./playground.html#.dads-component)`）を検出し、後述の特殊リンク構文としてHTML埋め込み・Canvas/Controls埋め込みに変換する。それ以外の行（通常の文章、見出し、テーブル、コードフェンス内）はそのままMarkdownとして扱われる
3. **フッターの自動生成**: `</div></Unstyled>`を自動的に末尾へ追加する

このため、**次の要素は`.md`に一切書いてはいけません（自動生成されるため）**:

- `Title` / `Subtitle` / `Description`
- `<Unstyled>` / `<div className="prose">`
- Storybook Docs Blocksの`import`文
- Storiesファイルの`import`文

## 特殊リンク構文

`.md`内で「その行全体がMarkdownリンクだけ」（前後にテキストがない行）になっている場合のみ、以下のルールで変換されます。文章中に埋め込まれたリンク（例: 「詳細は[こちら](...)を参照」）やコードフェンス内のリンクは通常のMarkdownリンクとしてそのまま残ります。

### Storiesファイルへのリンク（Canvas / Controls埋め込み）

| 記法 | 変換結果 |
| --- | --- |
| `[表示名](./x.stories.ts#StoryName)` | `<Canvas of={...StoryName} withToolbar />` |
| `[表示名](./x.stories.ts?controls#StoryName)` | `<Canvas .../>` + `<Controls of={...StoryName} />` |
| `[表示名](./x.stories.ts?no-toolbar#StoryName)` | `<Canvas of={...StoryName} />`（ツールバーなし） |
| `[表示名](./x.stories.ts?source#StoryName)` | `<Canvas ... sourceState="shown" />`（ソースパネルを最初から展開） |
| `#StoryName`を省略 | `Playground`ストーリーとみなされる（例: `[Playground](./x.stories.ts?controls)`） |

**ドキュメント冒頭には、原則としてPlaygroundストーリーへの`?controls`付きリンクを1行だけ書きます。** これがドキュメント最上部のCanvas+Controlsになります。

```md
[Playground](./component-name.stories.ts?controls#Playground)
```

`?no-toolbar`は、ツールバーでの切り替えが意味を持たないデモ（例: デスクトップ/モバイル別々のプレビューを並べる場合）で使用します。

### HTML/CSS/JS/TSファイルへのリンク（ソース埋め込み）

| 記法 | 変換結果 |
| --- | --- |
| `[file.html](./file.html)` | `<Source code={...} language="html" />`（ファイル全文） |
| `[file.html](./file.html#セレクタ)` | 指定したCSSセレクタに一致する要素だけを`HtmlFragment`で抽出して`<Source>`表示 |
| `[file.css](./file.css)` | `<Source code={...} language="css" />` |
| `[file.js](./file.js)` | `<Source code={...} language="javascript" />` |
| `[file.ts](./file.ts)` | `<Source code={...} language="typescript" />` |

`?raw`インポート文やHtmlFragmentのインポート文は自動生成されるため、`.md`側で書く必要はありません。`#セレクタ`はCSSセレクタそのもの（複数要素にマッチする複合セレクタも可、例: `body>*`）で、`HtmlFragment`が対象HTMLファイルから該当箇所を抽出します。ただし変換側は「行全体が空白を含まないMarkdownリンクである」ことを条件に検出するため、**セレクタに半角スペースや`)`を含めることはできません**（例: `body>*`は可、`body > *`や`.foo .bar`（子孫結合子）、`:is(.a,.b)`のように空白や`)`を含むセレクタは変換されず通常のリンクのまま残ります）。

画像ファイル（`.webp`等）はこの変換対象外です。次の「画像の埋め込み」を参照してください。

## ドキュメントの構成

`.md`ファイルは以下の構成に従います。セクションの順序を守ってください。

```md
[Playground](./component-name.stories.ts?controls#Playground)

## コンポーネントのガイドライン（該当する場合）

<a class="sbdocs-a" href="https://design.digital.go.jp/dads/components/component-name/" target="_blank">コンポーネント名（概要）｜デジタル庁デザインシステムβ版</a>

## ソースコード

<details>
<summary>HTML</summary>

[playground.html](./playground.html#.dads-component-name)

</details>

<details>
<summary>component-name.css</summary>

[component-name.css](./component-name.css)

</details>

<details>
<summary>component-name.js</summary>

[component-name.js](./component-name.js)

</details>

### 依存ファイル（該当する場合）

<details>
<summary>button.css</summary>

[button.css](../button/button.css)

</details>

## 仕様（該当する場合）

### バリエーション（該当する場合）

### 機能仕様（該当する場合）

## 使い方（該当する場合）

### インストール（該当する場合）

### （バリエーションのガイド：該当する場合）

### マークアップ（該当する場合）

### アクセシビリティ（該当する場合）

## 参考情報（該当する場合）
```

### 最小構成（シンプルなコンポーネントの場合）

data属性によるバリエーションやJavaScriptがなく、特筆すべき注意点もないシンプルなコンポーネント（`link`、`utility-link`等）では、「仕様」セクションを省略し「使い方」だけの最小構成が許容されます。

```md
[Playground](./component-name.stories.ts?controls#Playground)

## コンポーネントのガイドライン（該当する場合）

<a class="sbdocs-a" href="https://design.digital.go.jp/dads/components/component-name/" target="_blank">コンポーネント名（概要）｜デジタル庁デザインシステムβ版</a>

## ソースコード

<details>
<summary>HTML</summary>

[playground.html](./playground.html#.dads-component-name)

</details>

<details>
<summary>component-name.css</summary>

[component-name.css](./component-name.css)

</details>

## 使い方

### （差分の説明）

（説明文）

[variation.html](./variation.html#.dads-component-name)
```

**最小構成の判断基準:**
- CSSのみで完結し、JavaScriptファイルがない
- data属性によるバリエーションがない、またはごく少数で自明
- マークアップ上の特別な注意点がない
- 他のコンポーネントに依存していない

### 例外: 作例集型コンポーネント

`card`（カード）のように、単一のコンポーネントではなく複数の作例を提示する性質のコンポーネントでは、冒頭に単一のPlaygroundリンクを置く構成を取らず、作例ごとに見出し・説明・Canvas+Controls・ソースコードのセットを繰り返します。

```md
## コンポーネントのガイドライン（該当する場合）

<a class="sbdocs-a" href="https://design.digital.go.jp/dads/components/card/" target="_blank">カード（概要）｜デジタル庁デザインシステムβ版</a>

## カード作例1

（説明文。実装上のポイントを箇条書きで示すことが多い）

[カード作例1](./card.stories.ts?controls#Example1)

### ソースコード

<details>
<summary>HTML</summary>

[example-1.html](./example-1.html#.dads-card-example-1-list)

</details>

<details>
<summary>card-example-1.css</summary>

[card-example-1.css](./card-example-1.css)

</details>

#### 依存ファイル（該当する場合）

<details>
<summary>button.css</summary>

[button.css](../button/button.css)

</details>

## カード作例2

（以下、作例の数だけ繰り返す）
```

依存ファイルがある作例では見出しレベルを1段深く（`#### 依存ファイル`）します。

### 複数のPlaygroundがある場合（タイプ違いのコンポーネント）

`tab`（Tabキーナビゲーション/矢印キーナビゲーション/リンクリスト）や`date-picker`（統合型/分離型）のように、実装方式が大きく異なる複数のタイプを持つコンポーネントでは、以下の構成を取ります。

- ドキュメント冒頭には、代表的な（最初に案内したい）タイプのPlaygroundへの`?controls`付きリンクを1行だけ配置する
- タイプごとに`##`見出しを立て、各見出しの直下に、そのタイプ専用のPlaygroundストーリーへのリンク（表示名を`Playground (タイプ名)`のように変えてもよい）を配置し、続けて`### 仕様`・`### 使い方`をタイプごとに記載する
- `hamburger-menu-button`のように「スタイルの異なる2つのコンポーネント」を1ページで扱う場合も同様に、各バリエーションの見出し内に個別のCanvas+Controlsリンクを配置する

```md
[Playground (Tab key navigation)](./tab.stories.ts?controls#Playground)

## タイプ概要

| タイプ | カスタム要素 | 説明 |
| --- | --- | --- |
| ... | ... | ... |

## コンポーネントのガイドライン（該当する場合）

<a class="sbdocs-a" href="https://design.digital.go.jp/dads/components/tab/" target="_blank">タブ（概要）｜デジタル庁デザインシステムβ版</a>

## ソースコード

### Tabキーナビゲーションタイプ

<details>
<summary>HTML</summary>

[basic.html](./basic.html#body>*)

</details>

...

## Tabキーナビゲーションタイプ

[Playground (Tab key navigation)](./tab.stories.ts?controls#Playground)

### 仕様
...
### 使い方
...

## 矢印キーナビゲーションタイプ

[Playground (Arrow key navigation)](./tab.stories.ts?controls#PlaygroundAria)

### 仕様
...
```

## ドキュメント執筆の前提作業（必須）

ドキュメントを執筆する前に、以下のファイルを全て読み込んでコンポーネントの全体像を把握します。

1. **コンポーネントディレクトリ内の全HTMLファイル**
   - `src/components/<component-name>/*.html`
   - 各HTMLファイルには異なるバリエーションや使用例が含まれている場合がある

2. **Storiesファイル**
   - `src/components/<component-name>/<component-name>.stories.ts`
   - どのHTMLファイルがどのストーリーで使用されているか確認
   - `argTypes`からバリエーション（data属性の値）を把握
   - `render`関数内で動的に設定される属性を確認
   - 複数のPlaygroundストーリーがあるか確認

3. **CSSファイル**
   - `src/components/<component-name>/<component-name>.css`
   - data属性セレクタからバリエーションを把握できる場合がある

4. **JavaScriptファイル（存在する場合）**
   - `src/components/<component-name>/<component-name>.js`
   - カスタム要素のAPI、イベント、動的な振る舞いを把握

5. **既存の`.md`ファイル（更新の場合）**
   - `src/components/<component-name>/<component-name>.md`
   - 既存の内容を確認した上で、スキルの規定に合わせて書き換える

これらを総合的に分析した上で、ドキュメントを執筆します。

### Storiesファイルの読み取りガイド

Storiesファイルから以下の情報を読み取ります。

- **`argTypes`**: どのようなオプション（選択肢）が使えるかを把握
- **`render`関数**: そのオプションがHTMLのどの属性・要素に反映されるかを確認
- **複数のPlaygroundストーリー**: 各タイプ用の見出し内に個別のCanvas+Controlsリンクを配置する（前述「複数のPlaygroundがある場合」を参照）

`argTypes`だけではHTMLへの反映方法はわからないため、**必ず`render`関数も確認**してください。

## コンポーネントのガイドラインセクション

`design.digital.go.jp/dads`配下の対応するコンポーネントページへのリンクを配置するセクションです。「ソースコード」セクション（作例集型コンポーネントでは最初の作例見出し）の直前に配置します。

```md
## コンポーネントのガイドライン

<a class="sbdocs-a" href="https://design.digital.go.jp/dads/components/component-name/" target="_blank">コンポーネント名（概要）｜デジタル庁デザインシステムβ版</a>
```

- **リンクテキスト**: `{dadsページのタイトル}｜デジタル庁デザインシステムβ版`（dadsサイトの`<title>`をそのまま使用）
- **`class="sbdocs-a"`**: 必ず付与します
- **`target="_blank"`**: 必ず付与します（新規タブで開く）
- 素のMarkdownリンク記法（`[text](url)`）ではなく、`<a>`タグを直接書きます（`target`属性と`class`属性を指定するため）

**該当する場合のみ記載**: 対応するコンポーネントページが`design.digital.go.jp/dads`配下に存在しない場合は、このセクションごと省略します。

## ソースコードセクション

コンポーネントのHTML・CSS・JS・依存ファイルのソースコードを`<details>`要素で折りたたんで記載します。中身は生のコードではなく、対象ファイルへの単独行リンクだけを書きます。

### `<details>`のsummaryテキスト

- **HTML**: `<summary>HTML</summary>`（「HTML」と表記）
- **CSS/JSファイル**: `<summary>component-name.css</summary>`（ファイル名を使用）
- **依存ファイル**: `<summary>button.css</summary>`（ファイル名を使用）

```md
## ソースコード

<details>
<summary>HTML</summary>

[playground.html](./playground.html#.dads-component-name)

</details>

<details>
<summary>component-name.css</summary>

[component-name.css](./component-name.css)

</details>

<details>
<summary>component-name.js</summary>

[component-name.js](./component-name.js)

</details>

### 依存ファイル

<details>
<summary>button.css</summary>

[button.css](../button/button.css)

</details>
```

### HTMLソースコード

コンポーネントの「型」を示す完全なHTMLマークアップへのリンクを記載します。`#セレクタ`で、ファイル内の該当部分だけを抽出します（`.dads-component-name`のようなルートクラス、`body>*`のようなbody直下全体等）。

#### ソースコードに記載するもの

- **基本形**: コンポーネントの標準的なマークアップ
- **要素の選択肢**: 同じコンポーネントを異なる要素で実装できる場合（例: `<button>` / `<a>`）。この場合`#### 基本形`のように見出しを分けて複数のリンクを並べる

#### ソースコードに記載しないもの（使い方セクションで説明）

- **状態**: disabled、loading、error などの状態変化
- **構造の拡張**: アイコンの追加、バッジの追加など
- **コンテンツのバリエーション**: テキスト、段落数、含まれる要素などの違い
- **属性値の違い**: `data-type`や`data-size`の値が異なるだけのもの（仕様セクションの表で説明）

#### 参考にするファイル

- **Storiesファイルの先頭のストーリーで読み込まれているHTMLファイル**を基本とする
- コンポーネントディレクトリ内の全HTMLファイルを確認し、必要に応じて複数の型を記載

#### バリエーションの差分が小さい場合

複数のバリエーションがあっても、マークアップの差分が小さい場合（クラス名の違い、アイコンの追加程度）は、ソースコードセクションには**基本形のみ**を記載し、差分は「使い方」セクションで説明します。差分の説明方法は次の2通りがあり、どちらを使うかは差分の大きさで判断します。

- **該当HTMLファイルへのリンク**: 差分を示すための専用HTMLファイル（`with-label.html`等）が既にある場合、または差分がやや大きい場合
- **コードフェンスでの断片表示**: 差分がごく小さい場合（1つの要素・属性の追加/変更/削除程度）は、専用HTMLファイルを用意せず、差分となる断片だけをMarkdownのコードフェンスに直接書く

````md
## 使い方

### ラベルを表示する

ラベルを視覚的に表示する場合は、`dads-u-visually-hidden`の代わりに`dads-breadcrumb__label`クラスを使用します。

[with-label.html](./with-label.html#.dads-breadcrumb)

### 必須/任意の表示

`.dads-form-control-label__requirement`要素で必須・任意を表示します。テキストと`data-required`属性の両方を設定してください。

```html
<span class="dads-form-control-label__requirement" data-required="true">※必須</span>
```
````

#### バリエーションの差分が大きい場合

マークアップの構造自体が異なる場合は、ソースコードセクションに複数のパターンを記載します。

```md
<details>
<summary>HTML</summary>

#### 基本形

[basic.html](./basic.html#.dads-checkbox)

#### スタンドアロン（ラベルなし）

[standalone.html](./standalone.html#.dads-checkbox)

</details>
```

### 依存ファイル

他のコンポーネントのCSS/JSに依存している場合は、ソースコードセクション内に「### 依存ファイル」見出し（作例集型の入れ子構成では`#### 依存ファイル`）を設けて記載します。パスは相対パス（`../button/button.css`）にします。

```md
### 依存ファイル

<details>
<summary>button.css</summary>

[button.css](../button/button.css)

</details>

<details>
<summary>calendar.js</summary>

[calendar.js](../calendar/calendar.js)

</details>
```

## 仕様セクション

コンポーネントが備える静的な性質を記載します。data属性によるバリエーションがなく、JavaScriptによる複雑な機能もないコンポーネントでは、このセクション全体を省略できます。

**記載しないもの:**
- コンポーネントの構造（クラス名と要素の対応表など）: HTMLソースコードを見れば分かるため不要

### バリエーション（該当する場合）

data属性によるバリエーションがある場合、Markdownテーブルで記載します。

```md
### バリエーション

| 属性 | 値 | 説明 |
| --- | --- | --- |
| `data-type` | `solid-fill`（デフォルト）, `outline`, `text` | ボタンのスタイル |
| `data-size` | `lg`, `md`, `sm`, `xs` | ボタンのサイズ |
```

data属性によるバリエーションがないコンポーネントでは、このセクションは省略します。

### 機能仕様（該当する場合）

JavaScriptを含む複雑なコンポーネントの場合、機能の詳細仕様を記載します。

- バリエーションの説明（`data-type`属性の値ごとの動作の違い）
- JavaScriptの機能説明（キーボードナビゲーション、イベント、カスタム要素のAPI）
- 制約事項

イベントの説明にはコードブロックを使用します（コードブロックの中身は特殊リンク構文の対象外なので、通常のコード例をそのまま書けます）。

````md
#### イベント

タブが切り替わったときに `tab-change` イベントを発火します。

```javascript
const tab = document.querySelector("dads-tab");
tab.addEventListener("tab-change", (e) => {
  console.log("選択されたタブ:", e.detail.selectedTab);
});
```
````

## 使い方セクション

コンポーネントを正しく使うための情報を記載します。特筆すべき情報がないシンプルなコンポーネントでは、このセクション全体を省略できます。

このセクションでは、ソースコードセクションの「型」に対する**差分**を、対応するHTMLファイルへのリンクとともに説明します。

- **状態の実装**: disabled、loading、error などの状態をどう実装するか
- **構造の拡張**: アイコンやバッジなどを追加する方法
- **要素の選択指針**: どの要素をいつ使うべきか

### インストール（該当する場合）

コンポーネントを導入する際に必要な情報を記載します。

**記載する場合:**
- JavaScriptファイルが必要な場合
- 他のコンポーネントに依存している場合

**記載しない場合:**
- CSSファイルのみで完結するシンプルなコンポーネントの場合

```md
### インストール

#### 必要なファイル

- **共通**
  - `component-name.css`
  - `component-name.js`
- **追加で必要**
  - `button.css`（ボタンを使用する場合）

スクリプトを読み込む際は必ず、`<script type="module">`を使用しES Moduleとして読み込んでください。
```

### バリエーションのガイド（該当する場合）

ソースコードセクションで基本形のみを記載した場合、バリエーションの適用方法をここで説明します。各バリエーションごとに見出しを設け、差分の説明とともに、対応するHTMLファイルへのリンク、または差分のみのコードフェンスを記載します。

```md
### ラベルを表示する

ラベルを視覚的に表示する場合は、`dads-u-visually-hidden`の代わりに`dads-breadcrumb__label`クラスを使用します。

[with-label.html](./with-label.html#.dads-breadcrumb)
```

````md
### 必須/任意の表示

`.dads-form-control-label__requirement`要素で必須・任意を表示します。

```html
<span class="dads-form-control-label__requirement" data-required="true">※必須</span>
```
````

### マークアップ

コンポーネントを正しく使用するための情報を記載します。

- 特定のHTML構造が必要な場合
- ラベルの付け方、グループ化の方法
- ポリフィルの使用方法（最新APIを使用している場合）

### アクセシビリティ（該当する場合）

**記載する場合:**
- コンポーネント利用者がカスタマイズ時に留意すべき事項がある場合
- 利用者が適切に設定する必要があるARIA属性がある場合
- `<label>`と`<fieldset>`の使い分けなど、利用者の判断が必要な場合
- エラー表示時の`aria-invalid`や`aria-describedby`など、状況に応じて利用者が設定する属性がある場合
- 既知の不具合や制約事項（ブラウザ・支援技術の組み合わせによる問題など）

**記載しない場合:**
- コンポーネント側で既に配慮済みの事項（アイコンの`aria-hidden`、キーボード操作対応、スクリーンリーダー対応など）
- HTMLソースコードをそのまま使えばアクセシビリティが担保される場合

つまり、「コンポーネントが既に対応していること」ではなく、「利用者が正しく使うために知っておくべきこと」のみを記載します。既知の不具合を記載する場合は、確認環境・再現手順・回避策（ある場合）を`<dl>`要素等で構造化して記載できます。

## 参考情報セクション

外部リソースへのリンクを提供します（該当する場合）。

```md
## 参考情報

- [H71: fieldset 要素及び legend 要素を使用して... [WCAG 2.1]](https://waic.jp/translations/WCAG21/Techniques/html/H71)
```

見出しレベルは文脈に応じて調整します（アクセシビリティの小節内に配置する場合は`##### 参考情報`のように1段深くすることがあります）。

## コンポーネント間の相互参照リンク

他のコンポーネントのドキュメントへリンクする場合、旧来から変更なく以下の書式を使用します。これは文章中に埋め込まれるリンクのため、特殊リンク構文の変換対象にはなりません。

```md
詳細は[フォームコントロールラベル](?path=/docs/components-フォームコントロールラベル--docs)を参照してください。
```

特定のセクションにリンクする場合:

```md
[フォームコントロールラベル](?path=/docs/components-フォームコントロールラベル--docs#複数のコントロールにラベルを付ける)
```

Story（Docsページではなくキャンバス単体）を直接指す場合:

```md
[各Story](?path=/story/components-カルーセル--container)
```

**リンクパスの規則:**
- 形式: `?path=/docs/components-{Storiesのtitleのスラッシュ以降}--docs`
- Storiesの`title`が`"Components/フォームコントロールラベル"`の場合: `?path=/docs/components-フォームコントロールラベル--docs`
- セクションアンカーはMarkdownの見出しテキストをそのまま使用

## 画像の埋め込み

`.md`は実質的にMDXとしてコンパイルされるため、画像はJSXのimport文と`<img>`要素をそのまま`.md`内に書けます（拡張子`.webp`等は特殊リンク構文の変換対象外のため、素通しされます）。

```mdx
import carousel1024 from "./docs/carousel-1024.webp";
import carousel1024At2x from "./docs/carousel-1024@2x.webp";

<div class="border-image">
  <img src={carousel1024} srcSet={`${carousel1024At2x} 2x`} alt="Normalカルーセルのスクリーンショット" width="768" height="320" style={{ maxWidth: '100%', height: 'auto' }} />
</div>
```

画像ファイルは`src/components/<component-name>/docs/`ディレクトリに配置します。

## 言語

- ドキュメントは**日本語**で記述します
- 技術用語（CSS、HTML、JavaScript、ARIA属性名など）は英語のままで構いません
- コンポーネント名は日本語のStoriesタイトルに合わせます（例: 「ボタン」「チェックボックス」）

## チェックリスト

ドキュメント作成時に確認すること。

### 事前調査

- [ ] コンポーネントディレクトリ内の全HTMLファイルを読み込んだ
- [ ] Storiesファイルを読み込み、各ストーリーがどのHTMLを使用しているか把握した
- [ ] CSSファイルからバリエーション（data属性セレクタ）を把握した
- [ ] JSファイル（存在する場合）からカスタム要素のAPIを把握した
- [ ] 既存の`.md`ファイル（更新の場合）を読み込んだ

### `.mdx`スタブ

- [ ] Storiesのimportと`Content`（`.md`）のimportのみが書かれている（本文を書いていない）
- [ ] `<Meta of={...} />`と`<Content />`のみが記述されている
- [ ] Storybook Docs Blocksのimportを書いていない（自動注入されるため）

### `.md`本文

- [ ] `Title`/`Subtitle`/`Description`を書いていない（自動生成されるため）
- [ ] 冒頭にPlayground（またはそれに相当する代表ストーリー）への`?controls`付きリンクを1行だけ配置している（作例集型コンポーネントは冒頭リンクを持たないため対象外。ツールバーでの切り替えが意味を持たない場合は`?controls`の代わりに`?no-toolbar`を使ってよい）
- [ ] dads（design.digital.go.jp/dads）に対応するコンポーネントページが存在する場合、「ソースコード」の直前（作例集型は最初の作例見出しの直前）に「## コンポーネントのガイドライン」セクションを配置し、`class="sbdocs-a"`・`target="_blank"`付きのリンクを記載している
- [ ] ソースコードは生のコードをベタ書きせず、対象ファイルへの単独行リンク（`[file](./file)`または`[file](./file#セレクタ)`）で記載している
- [ ] HTMLのsummaryテキストは「HTML」、CSS/JSのsummaryテキストはファイル名
- [ ] バリエーションの差分が小さい場合は基本形のみ記載し、差分は「使い方」セクションでリンクまたはコードフェンス断片として説明
- [ ] バリエーションの差分が大きい場合は複数のHTMLパターンを見出しを分けて記載
- [ ] 依存ファイルは「### 依存ファイル」（入れ子の場合は`####`）見出しの下に相対パスのリンクで記載

### 仕様セクション（該当する場合）

- [ ] バリエーション（data属性がある場合のみ、Markdownテーブル形式で記載）
- [ ] 機能仕様（JSを含むコンポーネントの場合）
- [ ] 構造の説明は記載しない（HTMLソースコードで十分）

### 使い方セクション（該当する場合）

- [ ] インストール方法（JSや依存ファイルがある場合のみ）
- [ ] バリエーションのガイド（ソースコードで基本形のみ記載した場合、差分をリンクまたはコードフェンス断片で説明）
- [ ] マークアップ
- [ ] アクセシビリティ（利用者がカスタマイズ時に留意すべき事項がある場合のみ。コンポーネント側で配慮済みの事項は記載しない）

### 複数Playground・作例集型（該当する場合）

- [ ] 複数タイプがある場合、タイプごとに見出しを立て、専用のPlayground（Canvas+Controls）リンクを個別配置している
- [ ] 作例集型コンポーネントでは、冒頭の単一Playgroundを持たず、作例ごとに見出し・説明・Canvas+Controls・ソースコードのセットを繰り返している

### その他

- [ ] 参考情報（該当する場合）を記載している
- [ ] セクション順序: (コンポーネントのガイドライン) → ソースコード → 仕様 → 使い方 → (追加セクション) → 参考情報
- [ ] 相互参照リンクの書式が正しい（`?path=/docs/components-{名前}--docs`）
- [ ] 画像を使う場合、JSXのimportと`<img>`をそのまま`.md`に書いている
