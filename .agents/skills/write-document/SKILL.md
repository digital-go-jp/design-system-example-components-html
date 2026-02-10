---
name: write-document
description: コンポーネントのMDXドキュメントを作成・更新する
---

# コンポーネントドキュメント執筆スキル

デジタル庁デザインシステム（HTML版）のコンポーネントドキュメント（MDX）を作成・更新するためのガイドラインです。

## ドキュメントの配置場所

各コンポーネントのドキュメントは以下の場所に配置します：

```
src/components/<component-name>/<component-name>.mdx
```

## 新規作成と更新の方針

- **新規作成時**: 本スキルが規定する構成・順序に従います。
- **既存MDXの更新時**: 既存の構成がスキルの規定と異なる場合でも、スキルの規定に合わせて統一します。

## ドキュメント執筆の前提作業（必須）

ドキュメントを執筆する前に、以下のファイルを全て読み込んでコンポーネントの全体像を把握します：

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

5. **既存のMDXファイル（更新の場合）**
   - `src/components/<component-name>/<component-name>.mdx`
   - 既存の内容を確認した上で、スキルの規定に合わせて書き換える

これらを総合的に分析した上で、ドキュメントを執筆します。

### Storiesファイルの読み取りガイド

Storiesファイルから以下の情報を読み取ります：

- **`argTypes`**: どのようなオプション（選択肢）が使えるかを把握
- **`render`関数**: そのオプションがHTMLのどの属性・要素に反映されるかを確認
- **複数のPlaygroundストーリー**: 必要に応じてデモセクションで個別に`<Canvas>`+`<Controls>`を配置（ただし原則`<Primary />`を使用）

`argTypes`だけではHTMLへの反映方法はわからないため、**必ず`render`関数も確認**してください。

## ドキュメントの構成

MDXファイルは以下の構成に従います。セクションの順序を守ってください：

```mdx
import { Canvas, Controls, Description, Meta, Primary, Source, Stories, Subtitle, Title, Unstyled } from "@storybook/addon-docs/blocks";
 
import * as ComponentStories from "./component-name.stories";
import componentCss from "./component-name.css?raw";

<Meta of={ComponentStories} />

<Unstyled>
<div className="prose">

<Title />
<Subtitle />
<Description />

<Primary />
<Controls />

## ソースコード

## 仕様（該当する場合）

### バリエーション（該当する場合）
### 機能仕様（該当する場合）

## 使い方（該当する場合）

### インストール（該当する場合）
### （バリエーションのガイド：該当する場合）
### マークアップ（該当する場合）
### アクセシビリティ（該当する場合）

<Stories title="デモ" includePrimary={false} />

## 参考情報（該当する場合）

</div>
</Unstyled>
```

**重要**: `<Primary />`と`<Controls />`は常にドキュメントの最上部（`<Description />`の直後）に配置します。

### 最小構成（シンプルなコンポーネントの場合）

data属性によるバリエーションやJavaScriptがなく、特筆すべき注意点もないシンプルなコンポーネント（blockquote等）では、「仕様」「使い方」セクションを省略した最小構成が許容されます：

```mdx
import { Canvas, Controls, Description, Meta, Primary, Source, Stories, Subtitle, Title, Unstyled } from "@storybook/addon-docs/blocks";
 
import * as ComponentStories from "./component-name.stories";
import componentCss from "./component-name.css?raw";

<Meta of={ComponentStories} />

<Unstyled>
<div className="prose">

<Title />
<Subtitle />
<Description />
<Primary />
<Controls />

## ソースコード

<details>
  <summary>HTML</summary>

（HTMLマークアップ）

</details>

<details>
  <summary>component-name.css</summary>
  <Source code={componentCss} language="css" />
</details>

<Stories title="デモ" includePrimary={false} />

</div>
</Unstyled>
```

**最小構成の判断基準:**
- CSSのみで完結し、JavaScriptファイルがない
- data属性によるバリエーションがない、またはごく少数で自明
- マークアップ上の特別な注意点がない
- 他のコンポーネントに依存していない

### 例外: 作例集型コンポーネント

card（カード）のように、単一のコンポーネントではなく複数の作例を提示する性質のコンポーネントでは、通常のテンプレートに従わない構成が許容されます。各作例ごとに`<Canvas>`+`<Controls>`とCSSソースコードを配置する形式を取ります。

### 追加セクション

上記テンプレートに含まれないセクションを必要に応じて追加できます。例：

- **カスタマイズ**: カスタムプロパティの上書き方法、ブレークポイント変更、多言語化など
- **使用例**: 具体的な使用パターンを示す場合

追加セクションは「使い方」の後、「デモ」の前に配置してください。

## 必須のインポート

### Storybook Docs Blocks

`@storybook/addon-docs/blocks`から、以下のコンポーネントをインポートします。効率化のため、未使用のものがあっても常に全てインポートします。

```mdx
import { Canvas, Controls, Description, Meta, Primary, Source, Stories, Subtitle, Title, Unstyled } from "@storybook/addon-docs/blocks";
```

### その他のインポート

1. Storiesファイル: `./component-name.stories`
2. CSSファイル: `./component-name.css?raw`（`?raw`でソースを文字列として取得）
3. JavaScriptファイル（存在する場合）: `./component-name.js?raw`
4. 依存コンポーネントのCSS/JSファイル（存在する場合）: `../other-component/other-component.css?raw`
5. 画像ファイル（存在する場合）: `./docs/image.webp`

### 画像のインポートと表示

スクリーンショット等の画像をドキュメントに含める場合、画像ファイルをインポートして`<img>`要素で表示します：

```mdx
import screenshot from "./docs/screenshot.webp";
import screenshotAt2x from "./docs/screenshot@2x.webp";

<div class="border-image">
  <img src={screenshot} srcSet={`${screenshotAt2x} 2x`} alt="スクリーンショットの説明" width="768" height="320" style={{ maxWidth: '100%', height: 'auto' }} />
</div>
```

画像ファイルは`src/components/<component-name>/docs/`ディレクトリに配置します。

## ソースコードセクション

コンポーネントのHTML、CSS、JS、依存ファイルのソースコードを`<details>`要素で折りたたんで記載します。

### `<details>`のsummaryテキスト

- **HTML**: `<summary>HTML</summary>`（「HTML」と表記）
- **CSS/JSファイル**: `<summary>component-name.css</summary>`（ファイル名を使用）
- **依存ファイル**: `<summary>button.css</summary>`（ファイル名を使用）

````mdx
## ソースコード

<details>
  <summary>HTML</summary>

```html
<button class="dads-button" data-size="md" data-type="solid-fill">ボタン</button>
```

</details>

<details>
  <summary>component-name.css</summary>
  <Source code={componentCss} language="css" />
</details>

<details>
  <summary>component-name.js</summary>
  <Source code={componentJs} language="javascript" />
</details>

### 依存ファイル

<details>
  <summary>button.css</summary>
  <Source code={buttonCss} language="css" />
</details>
````

### HTMLソースコード

コンポーネントの「型」を示す完全なHTMLマークアップを記載します。

#### ソースコードに記載するもの

- **基本形**：コンポーネントの標準的なマークアップ
- **要素の選択肢**：同じコンポーネントを異なる要素で実装できる場合（例：`<button>` / `<a>`）

#### ソースコードに記載しないもの（使い方セクションで説明）

- **状態**：disabled、loading、error などの状態変化
- **構造の拡張**：アイコンの追加、バッジの追加など
- **コンテンツのバリエーション**：テキスト、段落数、含まれる要素などの違い
- **属性値の違い**：`data-type`や`data-size`の値が異なるだけのもの（仕様セクションの表で説明）

#### 参考にするファイル

- **Storiesファイルの先頭のストーリーで読み込まれているHTMLファイル**を基本とする
- コンポーネントディレクトリ内の全HTMLファイルを確認し、必要に応じて複数の型を記載
- フルHTMLを記載する（省略しない）

#### バリエーションの差分が小さい場合

複数のバリエーションがあっても、マークアップの差分が小さい場合（クラス名の違い、アイコンの追加程度）は、ソースコードセクションには**基本形のみ**を記載し、差分は「使い方」セクションで説明します。

**例**: パンくずリストで「ラベル表示」「ホームアイコン付き」などのバリエーションがある場合

- ソースコード: 基本形のフルHTMLのみ
- 使い方: 「ラベルを表示する」「ホームアイコンを追加する」などの見出しで、差分となるコードスニペットを提示

````mdx
## 使い方

### ラベルを表示する

ラベルを視覚的に表示する場合は、`dads-u-visually-hidden`の代わりに`dads-breadcrumb__label`クラスを使用します。

```html
<span id="breadcrumb-label" class="dads-breadcrumb__label">現在位置</span>
```

### ホームアイコンを追加する

リンクテキストの前にアイコンを追加できます。

```html
<a class="dads-breadcrumb__link" href="#">
  <svg class="dads-breadcrumb__link-icon" ...>...</svg>
  ホーム
</a>
```
````

#### バリエーションの差分が大きい場合

マークアップの構造自体が異なる場合は、ソースコードセクションに複数のパターンを記載します：

````mdx
<details>
  <summary>HTML</summary>

#### 基本形

```html
<label class="dads-checkbox" data-size="sm">
  <span class="dads-checkbox__checkbox">
    <input class="dads-checkbox__input" type="checkbox">
  </span>
  <span class="dads-checkbox__label">ラベル</span>
</label>
```

#### スタンドアロン（ラベルなし）

```html
<span class="dads-checkbox" data-size="sm">
  <span class="dads-checkbox__checkbox">
    <input id="article-1-checkbox" class="dads-checkbox__input" type="checkbox">
  </span>
</span>
```

</details>
````

### 依存ファイル

他のコンポーネントのCSS/JSに依存している場合は、ソースコードセクション内に「### 依存ファイル」見出しを設けて記載します：

```mdx
### 依存ファイル

<details>
  <summary>button.css</summary>
  <Source code={buttonCss} language="css" />
</details>

<details>
  <summary>calendar.css</summary>
  <Source code={calendarCss} language="css" />
</details>

<details>
  <summary>calendar.js</summary>
  <Source code={calendarJs} language="javascript" />
</details>
```

## 仕様セクション

コンポーネントが備える静的な性質を記載します。data属性によるバリエーションがなく、JavaScriptによる複雑な機能もないコンポーネントでは、このセクション全体を省略できます。

**記載しないもの:**
- コンポーネントの構造（クラス名と要素の対応表など）：HTMLソースコードを見れば分かるため不要

### バリエーション（該当する場合）

data属性によるバリエーションがある場合、Markdownテーブルで記載します。

data属性によるバリエーションがないコンポーネントでは、このセクションは省略します。

```mdx
### バリエーション

| 属性 | 値 | 説明 |
| --- | --- | --- |
| `data-type` | `solid-fill`（デフォルト）, `outline`, `text` | ボタンのスタイル |
| `data-size` | `lg`, `md`, `sm`, `xs` | ボタンのサイズ |
```

### 機能仕様（該当する場合）

JavaScriptを含む複雑なコンポーネントの場合、機能の詳細仕様を記載します：

- バリエーションの説明（`data-type`属性の値ごとの動作の違い）
- JavaScriptの機能説明（キーボードナビゲーション、イベント、カスタム要素のAPI）
- 制約事項

## 使い方セクション

コンポーネントを正しく使うための情報を記載します。特筆すべき情報がないシンプルなコンポーネントでは、このセクション全体を省略できます。

このセクションでは、ソースコードセクションの「型」に対する**差分**を説明します：

- **状態の実装**：disabled、loading、error などの状態をどう実装するか
- **構造の拡張**：アイコンやバッジなどを追加する方法
- **要素の選択指針**：どの要素をいつ使うべきか

コード例を含めて具体的に説明します。

### インストール（該当する場合）

コンポーネントを導入する際に必要な情報を記載します。

**記載する場合:**
- JavaScriptファイルが必要な場合
- 他のコンポーネントに依存している場合

**記載しない場合:**
- CSSファイルのみで完結するシンプルなコンポーネントの場合

```mdx
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

ソースコードセクションで基本形のみを記載した場合、バリエーションの適用方法をここで説明します。各バリエーションごとに見出しを設け、差分となるコードスニペットを提示します。

````mdx
### ラベルを表示する

ラベルを視覚的に表示する場合は、`dads-u-visually-hidden`の代わりに`dads-breadcrumb__label`クラスを使用します。

```html
<span id="breadcrumb-label" class="dads-breadcrumb__label">現在位置</span>
```
````

### マークアップ

コンポーネントを正しく使用するための情報を記載します：

- 特定のHTML構造が必要な場合
- ラベルの付け方、グループ化の方法
- ポリフィルの使用方法（最新APIを使用している場合）

### アクセシビリティ（該当する場合）

**記載する場合:**
- コンポーネント利用者がカスタマイズ時に留意すべき事項がある場合
- 利用者が適切に設定する必要があるARIA属性がある場合
- `<label>`と`<fieldset>`の使い分けなど、利用者の判断が必要な場合
- エラー表示時の`aria-invalid`や`aria-describedby`など、状況に応じて利用者が設定する属性がある場合

**記載しない場合:**
- コンポーネント側で既に配慮済みの事項（アイコンの`aria-hidden`、キーボード操作対応、スクリーンリーダー対応など）
- HTMLソースコードをそのまま使えばアクセシビリティが担保される場合

つまり、「コンポーネントが既に対応していること」ではなく、「利用者が正しく使うために知っておくべきこと」のみを記載します。

## デモセクション

Storybookのインタラクティブなデモを配置します。`title`属性でh2見出しを指定します。

```mdx
<Stories title="デモ" includePrimary={false} />
```

**注意**: `<Primary />`と`<Controls />`はドキュメント最上部に配置するため、デモセクションでは`<Stories title="デモ" includePrimary={false} />`のみを配置します。

### `<Primary />`の使い分け

原則として`<Primary />`と`<Controls />`をドキュメント最上部に配置します。

Storiesに複数のPlaygroundがある場合でも、先頭のPlaygroundストーリーを`<Primary />`で表示し、追加のPlaygroundはデモセクション内に個別配置します：

```mdx
### Separatedタイプ

<Canvas of={DatePickerStories.PlaygroundSeparated} meta={DatePickerStories} />
<Controls of={DatePickerStories.PlaygroundSeparated} meta={DatePickerStories} />

<Stories title="デモ" includePrimary={false} />
```

## 参考情報セクション

外部リソースへのリンクを提供します（該当する場合）：

```mdx
## 参考情報

- [H71: fieldset 要素及び legend 要素を使用して... [WCAG 2.1]](https://waic.jp/translations/WCAG21/Techniques/html/H71)
```

## コンポーネント間の相互参照リンク

他のコンポーネントのドキュメントへリンクする場合、以下の書式を使用します：

```mdx
詳細は[フォームコントロールラベル](?path=/docs/components-フォームコントロールラベル--docs)を参照してください。
```

特定のセクションにリンクする場合：

```mdx
[フォームコントロールラベル](?path=/docs/components-フォームコントロールラベル--docs#複数のコントロールにラベルを付ける)
```

**リンクパスの規則:**
- 形式: `?path=/docs/components-{Storiesのtitleのスラッシュ以降}--docs`
- Storiesの`title`が`"Components/フォームコントロールラベル"`の場合: `?path=/docs/components-フォームコントロールラベル--docs`
- セクションアンカーはMarkdownの見出しテキストをそのまま使用

## 言語

- ドキュメントは**日本語**で記述します
- 技術用語（CSS、HTML、JavaScript、ARIA属性名など）は英語のままで構いません
- コンポーネント名は日本語のStoriesタイトルに合わせます（例：「ボタン」「チェックボックス」）

## チェックリスト

ドキュメント作成時に確認すること：

### 事前調査

- [ ] コンポーネントディレクトリ内の全HTMLファイルを読み込んだ
- [ ] Storiesファイルを読み込み、各ストーリーがどのHTMLを使用しているか把握した
- [ ] CSSファイルからバリエーション（data属性セレクタ）を把握した
- [ ] JSファイル（存在する場合）からカスタム要素のAPIを把握した
- [ ] 既存のMDXファイル（更新の場合）を読み込んだ

### MDXファイル

- [ ] Storiesファイルのインポートパスが正しい
- [ ] CSSファイルを`?raw`付きでインポートしている
- [ ] JSファイルがある場合は`?raw`付きでインポートしている
- [ ] 依存するコンポーネントのCSS/JSもインポートしている
- [ ] Storybook Docs Blocksは全てインポートしている（使用しないものも含む）
- [ ] `<Unstyled>`と`<div className="prose">`で全体を囲んでいる
- [ ] `<Primary />`と`<Controls />`がドキュメント最上部（`<Description />`直後）に配置されている

### ソースコードセクション

- [ ] HTML、CSS、JSを`<details>`で折りたたんで記載
- [ ] HTMLのsummaryテキストは「HTML」、CSS/JSのsummaryテキストはファイル名
- [ ] HTMLソースコードはフルで記載（省略なし）
- [ ] バリエーションの差分が小さい場合は基本形のみ記載し、差分は「使い方」セクションで説明
- [ ] バリエーションの差分が大きい場合は複数のHTMLパターンを記載
- [ ] 依存ファイルは「### 依存ファイル」見出しの下に記載

### 仕様セクション（該当する場合）

- [ ] バリエーション（data属性がある場合のみ、Markdownテーブル形式で記載）
- [ ] 機能仕様（JSを含むコンポーネントの場合）
- [ ] 構造の説明は記載しない（HTMLソースコードで十分）

### 使い方セクション（該当する場合）

- [ ] インストール方法（JSや依存ファイルがある場合のみ）
- [ ] バリエーションのガイド（ソースコードで基本形のみ記載した場合、差分をここで説明）
- [ ] マークアップ
- [ ] アクセシビリティ（利用者がカスタマイズ時に留意すべき事項がある場合のみ。コンポーネント側で配慮済みの事項は記載しない）

### その他

- [ ] デモセクションに`<Stories title="デモ" includePrimary={false} />`を配置している
- [ ] 参考情報（該当する場合）を記載している
- [ ] セクション順序: ソースコード → 仕様 → 使い方 → (追加セクション) → デモ → 参考情報
- [ ] 相互参照リンクの書式が正しい（`?path=/docs/components-{名前}--docs`）
