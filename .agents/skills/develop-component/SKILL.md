---
name: develop-component
description: コンポーネントを新規作成・更新する。CSS、HTML、Storybook Stories、テスト、JavaScript（Custom Elements）の実装を含む。
---

# コンポーネント開発スキル

コンポーネントを開発するためのガイドライン。CSS、HTML、Stories、テストファイル、および必要に応じてJavaScriptの実装を対象とする。

## コンポーネントのファイル構成

各コンポーネントは `src/components/<component-name>/` ディレクトリに以下のファイルで構成する。

```
src/components/<component-name>/
├── <component-name>.css           # 必須: スタイル
├── playground.html                # 必須: Playground用の基本HTML
├── <variation>.html               # 任意: 使い方が異なるバリエーション用HTML
├── <component-name>.stories.css   # 任意: Storybookストーリー専用のスタイル調整
├── <component-name>.stories.ts    # 必須: Storybookストーリー
├── <component-name>.vrt.js        # 必須: VRT（Visual Regression Test、Playwright）
├── <component-name>.test.js       # 任意: 機能テスト（Vitest browser mode、JSを含むコンポーネント）
├── <component-name>.unit.js       # 任意: ユニットテスト（Vitest jsdom、純粋関数のロジック検証）
├── <component-name>.mdx           # 必須: ドキュメント（write-documentスキルを使用）
└── <component-name>.js            # 任意: Custom Element（インタラクティブな場合）
```

### ファイル名規則

- ケバブケースを使用する（例: `date-picker`、`chip-label`）
- ディレクトリ名とファイル名のプレフィックスを一致させる

## 開発の前提作業（必須）

コンポーネントを新規作成・更新する前に、以下を確認する。

### 新規作成時

1. **既存のコンポーネント一覧を確認**: src/components/ ディレクトリ直下の各コンポーネントディレクトリを把握する
2. **類似の既存コンポーネントを確認**: 同種の既存コンポーネントの全ファイルを読み、パターンを把握する
3. **`src/global.css`を確認**: 使用可能なデザイントークン（カラー、フォント、エレベーション）とユーティリティクラスを把握する

### 更新時

1. **対象コンポーネントの全ファイルを読み込む**: CSS、全HTML、Stories、テスト、JS（存在する場合）
2. **既存のパターンを維持**: 既存コンポーネントのコーディングスタイルに合わせる

## CSS

### クラス命名規則

BEMをベースにした命名規則を使用する。

```
.dads-<block-name>__<element-name>[data-<modifier-name>="<value>"]
```

**規則:**
- 接頭辞 `dads-` を必ず付ける
- 単語はケバブケース
- Block-Elementの区切りはアンダースコア2つ `__`
- ModifierはBEM記法（`--`）ではなくdata属性を使用
- 真偽値Modifierは値を省略（例: `[data-disabled]`）
- ARIAステートをスタイリングに使用することを許容（例: `[aria-invalid="true"]`、`[aria-disabled="true"]`）

```css
/* DO: data属性でModifier */
.dads-button[data-type="solid-fill"] { }
.dads-button[data-size="lg"] { }

/* DO: ARIAステートでスタイリング */
.dads-button[aria-disabled="true"] { }
.dads-input-text__input[aria-invalid="true"] { }

/* DON'T: BEMのModifier記法 */
.dads-button_solid-fill { }
```

### 単位の規則

原則として、rem単位を基本とし、px単位は使用しない。`calc(px / 16 * 1rem)` のパターンを必ず使用し、px値から計算する。ただし、`border-width` にはpx単位を使用してもよい（境界線として使用する場合はpx単位、オブジェクトを構成する一要素として使用する場合はrem単位の使用を推奨）。

```css
/* フォントサイズ・余白・サイズ: rem（calc(px / 16 * 1rem)パターン） */
.dads-component {
  font-size: calc(16 / 16 * 1rem);
  padding: calc(8 / 16 * 1rem) calc(16 / 16 * 1rem);
  border-radius: calc(8 / 16 * 1rem);
  min-height: calc(48 / 16 * 1rem);
  gap: calc(4 / 16 * 1rem);
}

/* 線の太さ: px */
.dads-component {
  border: 1px solid currentcolor;
}
```

### コンポーネントルートで継承プロパティをリセットする

リセットCSSの有無を問わず動作させるため、コンポーネントのルート要素で継承されるプロパティをリセットする。

```css
.dads-component {
  color: var(--color-neutral-solid-gray-800);
  font-weight: normal;
  font-size: calc(16 / 16 * 1rem);
  line-height: 1.7;
  font-family: var(--font-family-sans);
  letter-spacing: 0.02em;
}
```

全てのプロパティが毎回必要なわけではなく、コンポーネントの性質に応じて適切なものを選択する。

### box-sizingの初期化

`border`または`padding`と、`width`または`height`が共存する要素には `box-sizing: border-box` を明示的に指定する。

```css
.dads-component__input {
  box-sizing: border-box;
  width: 100%;
  padding: calc(12 / 16 * 1rem);
  border: 1px solid var(--color-neutral-solid-gray-600);
}
```

### marginの初期化

UAスタイルシートやリセットCSSによって異なるmarginが適用される可能性がある要素（`<hr>`、`<p>`、`<ul>`等）は `margin: 0` でリセットする。

```css
.dads-divider {
  margin: 0;
  /* ... */
}
```

### セレクタの詳細度

- セレクタは原則としてクラス名を使用する。IDセレクタや要素セレクタは使用しない
- 詳細度を最小限にするための過度な工夫（`:where()`の多用等）は避ける
- 記述が多くの開発者にとって理解しやすいことを優先する

```css
/* DO: 直感的で読みやすい */
.dads-button[data-type="solid-fill"]:hover {
  background-color: var(--button-hover-color);
}

/* DON'T: 詳細度を下げるための過剰な :where() */
.dads-button:where([data-type="solid-fill"]:hover) {
  background-color: var(--button-hover-color);
}
```

### デザイントークンの使用

`src/global.css` で定義されたCSS Custom Propertiesを使用する。

```css
/* カラー */
var(--color-primitive-blue-900)       /* プリミティブカラー */
var(--color-neutral-solid-gray-800)   /* ニュートラルカラー */
var(--color-neutral-white)
var(--color-neutral-black)
var(--color-semantic-error-1)         /* セマンティックカラー */

/* フォント */
var(--font-family-sans)               /* Noto Sans JP */
var(--font-family-mono)               /* Noto Sans Mono */

/* エレベーション */
var(--elevation-1) 〜 var(--elevation-5)
```

### コンポーネントスコープのCustom Properties

コンポーネント内で再利用する値は、コンポーネントスコープのCustom Propertiesとして定義できる。ただし、過度な抽象化は避ける。

**プレフィックスの使い分け:**
- `--_` プレフィックス: プライベート（コンポーネント内部でのみ使用、外部から設定されることを想定しない）
- `--` プレフィックス（`_`なし）: パブリックAPI（コンポーネント利用者が外部から上書きできる）

```css
/* プライベート: サイズバリエーションの内部値 */
.dads-checkbox[data-size="sm"] {
  --_gap: calc(4 / 16 * 1rem);
  --_checkbox-size: calc(24 / 16 * 1rem);
}
.dads-checkbox[data-size="md"] {
  --_gap: calc(8 / 16 * 1rem);
  --_checkbox-size: calc(32 / 16 * 1rem);
}

/* パブリック: 利用者がテーマカラーを変更できるAPI */
.dads-button {
  --button-color: var(--color-primitive-blue-900);
  --button-hover-color: var(--color-primitive-blue-1000);
}

/* DON'T: 全プロパティをCustom Propertiesに間接化 */
.dads-button {
  --dads-button-bg-color: var(--color-primitive-blue-900);
  --dads-button-text-decoration: none;
  background-color: var(--dads-button-bg-color);
  text-decoration: var(--dads-button-text-decoration);
}
```

### フォーカススタイル

フォーカスが可視な要素には統一的なフォーカスリングを適用する。

```css
.dads-component:focus-visible {
  outline: calc(4 / 16 * 1rem) solid var(--color-neutral-black);
  outline-offset: calc(2 / 16 * 1rem);
  box-shadow: 0 0 0 calc(2 / 16 * 1rem) var(--color-primitive-yellow-300);
}
```

### 無効状態

`disabled`属性と`aria-disabled`属性の両方に対応する。

```css
.dads-component:disabled,
.dads-component[aria-disabled="true"] {
  /* 無効スタイル */
}
```

### エラー状態

`:user-invalid`擬似クラスと`aria-invalid`属性に対応する。

```css
.dads-component:is(:user-invalid, [aria-invalid="true"]) {
  border-color: var(--color-semantic-error-1);
}
```

### メディアクエリ

#### レスポンシブ（モバイルファースト）

```css
.dads-component { /* モバイルスタイル */ }

@media (min-width: 48rem) {
  .dads-component { /* デスクトップスタイル */ }
}
```

#### ホバー

タッチ端末でホバーが発動しないよう、ホバースタイルは `@media (hover: hover)` で囲む。

```css
@media (hover: hover) {
  .dads-component:hover {
    /* ホバースタイル */
  }
}
```

#### 強制カラーモード

Windowsのコントラストテーマに対応する。

```css
@media (forced-colors: active) {
  .dads-component {
    /* 強制カラーモード用のスタイル調整 */
  }
}
```

使用できるシステムカラー: `GrayText`、`Canvas`、`ButtonText`、`Highlight`、`HighlightText` 等。

#### 視覚効果低減モード

フェード以外のアニメーションがある場合に対応する。

```css
@media (prefers-reduced-motion: reduce) {
  .dads-component {
    transition: none;
  }
}
```

### 論理的プロパティの不使用

`margin-block`、`padding-inline`等の論理的プロパティは使用しない。`margin-top`、`padding-left` 等の物理的プロパティを使用する。

### カスケードレイヤーの不使用

`@layer` は使用しない。

### CSSプリプロセッサの不使用

標準的なCSSのみで記述する。Sass、Less等は使用しない。

## HTML

### HTMLファイルのテンプレート

全てのHTMLファイルは以下のテンプレートに従う。

```html
<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Component Name</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../../global.css">
<link rel="stylesheet" href="<component-name>.css">
</head>
<body>

<!-- コンポーネントのHTML -->

</body>
</html>
```

**注意:**
- 他コンポーネントに依存する場合、その CSS も `<link>` で読み込む（例: `<link rel="stylesheet" href="../button/button.css">`）
- JSファイルがある場合は `<script type="module" src="<component-name>.js"></script>` を `</body>` の前に配置する

### HTMLファイルの種類と用意の判断基準

#### playground.html（必須）

Storybookの Playground ストーリーで使用する基本的なHTMLファイル。コンポーネントの代表的な構成を1つだけ含む。

```html
<body>

<button class="dads-button" data-size="md" data-type="solid-fill">ボタン</button>

</body>
```

**playground.htmlのみで十分な場合:**
- data属性の値を変えるだけでバリエーションが表現できる
- 要素の足し引き（アイコン追加等）で拡張できる
- StoriesのPlaygroundコントロールでパラメータを調整すれば全パターンが確認できる

#### 追加のHTMLファイルが必要な場合

コンポーネントの**使い方**や**HTML構造自体**が大きく異なるバリエーションがある場合に、追加のHTMLファイルを用意する。

**追加HTMLが必要な例:**
- `with-form-control-label.html`: フォームコントロールラベルと組み合わせた使用例
- `with-existing-files.html`: 既存ファイルが事前に設定された状態のファイルアップロード
- `readonly.html`: 読み取り専用状態（構造や表示が大きく変わる場合）
- `stacked.html`: 複数のコンポーネントを積み重ねた表示

**追加HTMLが不要な例:**
- サイズ違い（`data-size="sm"` vs `data-size="lg"`）→ playgroundのコントロールで対応
- タイプ違い（`data-type="solid-fill"` vs `data-type="outline"`）→ playgroundのコントロールで対応
- disabled状態 → playgroundのコントロールで対応

### セマンティックマークアップ

- HTML要素は目的に沿って使用する（見た目のためではなく意味のために）
- ネイティブHTML要素で実現できる機能はARIAよりHTML要素を優先する

### 多言語対応の配慮

JavaScriptやCSSにインラインで言語依存情報を含めず、HTMLの`data`属性で言語情報を提供する。

**作例（file-upload）:**

```html
<!-- エラーメッセージをdata属性で提供 -->
<dads-file-upload
  class="dads-file-upload"
  max-files="5"
  max-total-size="10MB"
  max-file-size="5MB"
  data-error-invalid-type="PNG/JPEG/GIF形式の画像、Excel/Word/PowerPoint/PDF形式のドキュメントだけが選択できます。"
>
  <!-- ... -->
</dads-file-upload>
```

```javascript
// JavaScript側ではdata属性からメッセージを取得
#getMessage(category, key, variables = {}) {
  const datasetKey = `${category}${key.charAt(0).toUpperCase()}${key.slice(1)}`;
  let template = this.dataset[datasetKey];

  // data属性になければデフォルトメッセージを使用
  if (!template) {
    template = FileUpload.defaultMessages[category]?.[key] || "";
  }

  return template.replace(/\{(\w+)\}/g, (match, variable) => {
    return variables[variable] !== undefined ? variables[variable] : match;
  });
}
```

**ポイント:**
- デフォルトのメッセージはJavaScript内に定義しておく
- HTMLの`data-*`属性でメッセージを上書きできるようにする
- テンプレート変数（`{count}`、`{max}`等）で動的な値を埋め込み可能にする

## JavaScript（Custom Elements）

インタラクティブなコンポーネントでは Custom Elements を使用する。

### 基本構造

```javascript
export class ComponentName extends HTMLElement {
  #abort = null;

  connectedCallback() {
    this.#abort = new AbortController();
    this.#setupEventListeners();
  }

  disconnectedCallback() {
    this.#abort.abort();
  }

  #setupEventListeners() {
    const signal = this.#abort.signal;

    this.#triggerButton.addEventListener(
      "click",
      (e) => this.#handleClick(e),
      { signal },
    );

    this.#someInput.addEventListener(
      "change",
      (e) => this.#handleChange(e),
      { signal },
    );

    // イベントデリゲーション
    this.addEventListener(
      "click",
      ({ target }) => {
        if (!target.closest("[data-js-remove-button]")) return;
        this.#handleRemove(target);
      },
      { signal },
    );
  }

  #handleClick(e) {
    // ...
  }

  #handleChange(e) {
    // ...
  }

  #handleRemove(target) {
    // ...
  }

  // DOM要素へのアクセスはgetterで定義
  get #triggerButton() {
    return this.querySelector("[data-js-trigger-button]");
  }

  get #someInput() {
    return this.querySelector("[data-js-input]");
  }
}

customElements.define("dads-component-name", ComponentName);
```

### 規則

- **Shadow DOMは使用しない**
- **`AbortController`の`signal`でイベントリスナーを管理する**: `addEventListener`の第3引数に`{ signal }`を渡すことで、`abort()`呼び出し時に自動的にリスナーが解除される
- **`disconnectedCallback`で`abort()`を呼ぶ**: メモリリークを防止する
- **DOM要素へのアクセスはgetterで定義する**: `data-js-*` 属性をセレクタに使用する
- **カスタムイベントは`CustomEvent`を使用する**: `detail`プロパティでデータを伝搬する（例: `new CustomEvent("date-selected", { detail: { date }, bubbles: true })`）
- **ES Moduleとしてエクスポートする**: `export class` でクラスをエクスポートする
- **プライベートフィールドは`#`を使用する**: `#abort`、`#timers` 等

### 公開インターフェースの設計

Custom Elementの公開APIは最小限に絞り、内部実装は `#` でprivate化する。

#### 公開API（public）として残すもの

以下のみを公開APIとして扱う。

1. **Web Components仕様のライフサイクルメソッド（必須）**:
   - `connectedCallback`、`disconnectedCallback`、`attributeChangedCallback`
   - `static observedAttributes`
2. **他のコンポーネントや外部スクリプトから呼び出されるメソッド**:
   - 別のコンポーネントクラスから `element.method()` として呼び出される
   - `focus()` のようにHTMLElement標準メソッドのオーバーライド
   - 例: `Calendar.setSelectedDate()`/`setDisplayMonth()`/`focus()` → DatePickerから呼ばれる
   - 例: `CarouselStepNav.setSelectedIndex()` → Carouselから呼ばれる
3. **インテグレーター向けの状態アクセスAPI**（状態を外部に公開する必要がある場合）:
   - 例: `FileUpload.files`（ファイル一覧）、`FileUpload.errors`（エラー一覧）
   - 例: `FileUpload.addFiles()`、`removeFile()`（プログラムからのファイル操作）
4. **静的メソッド・プロパティ**（外部カスタマイズのエントリポイント）:
   - 例: `FileUpload.defaultMessages`（デフォルトメッセージの上書き）

#### privateにするもの（`#` プレフィックス）

以下はすべて `#` でprivate化する。

- **イベントハンドラ**: `#handleClick`、`#handleKeydown` 等
- **初期化・更新メソッド**: `#setupEventListeners`、`#renderCalendar`、`#update` 等
- **内部ロジックメソッド**: `#navigateToDate`、`#validateFiles`、`#formatJapaneseYear` 等
- **DOMアクセスゲッター**: `#calendarTable`、`#fallbackInput`、`#opener` 等
- **状態計算ゲッター**: `#isPreviousMonthAvailable`、`#isOpen`、`#currentIndex` 等

#### 判断の基準

> 「クラスの外から呼ぶ必要があるか？」「外部から使用できることでコンポーネントの有用性が高まるか？」を問う。クラス内部だけで使われるものはすべてprivate。

```javascript
// ✅ public: DatePickerから this.calendar.setSelectedDate(date) と呼ばれる
setSelectedDate(date) { ... }

// ✅ public: 標準APIのオーバーライド（DatePickerから this.calendar.focus() と呼ばれる）
focus() { ... }

// ❌ private: イベントリスナー内で this.#renderCalendar() と呼ぶだけ
#renderCalendar() { ... }

// ❌ private: 同クラスの別インスタンスから呼ぶ場合もprivate化可能
// （JSではprivateフィールドは同クラスの他インスタンスからもアクセス可能）
#setExpandedDropArea(expanded) { ... }
// → activeExpandedComponent.#setExpandedDropArea(false) と呼べる
```

### `data-js-*` 属性

JavaScriptからDOM要素を取得するためのセレクタには `data-js-*` 属性を使用する。CSSのスタイリング用 `data-*` 属性とは区別する。

```html
<button data-js-calendar-button>カレンダー</button>
<div data-js-calendar-popover>...</div>
<input data-js-input type="file">
```

```javascript
get #calendarButton() {
  return this.querySelector("[data-js-calendar-button]");
}
```

### 外部ライブラリ

原則として使用しない。使用する場合は以下を満たす必要がある:

- アクセシブルであること
- HTML中心の開発スタイルと合致すること
- スコープが明確で、一つのことをうまくやること
- 実装の複雑さが著しく、メンテナンスコストが正当化されること

将来的に標準化が見込まれるAPIのpolyfillは使用できる。

## Storybook Stories（.stories.ts）

### 基本構造

```typescript
import type { Meta, StoryObj } from "@storybook/html-vite";
import { HtmlFragment } from "../../helpers/html-fragment";

// CSSインポート（Storybookでのスタイル適用用）
import "./component-name.css";
// 依存コンポーネントのCSSもインポート
import "../button/button.css";

// HTMLファイルのインポート（?rawで文字列として取得）
import playground from "./playground.html?raw";
import withFormControlLabel from "./with-form-control-label.html?raw";

const meta = {
  title: "Components/コンポーネント名（日本語）",
} satisfies Meta;

export default meta;
```

### metaオブジェクト

- `title`: `"Components/<日本語コンポーネント名>"` の形式（例: `"Components/ボタン"`、`"Components/インプットテキスト"`）
- 他のメタ情報（`component`、`decorators`等）は原則不要

### Playgroundストーリー

インタラクティブなコントロールを持つメインのストーリー。

```typescript
interface ComponentPlaygroundProps {
  variant: string;
  size: string;
  disabled: boolean;
  // ...
}

export const Playground: StoryObj<ComponentPlaygroundProps> = {
  render: (args) => {
    const fragment = new HtmlFragment(playground, ".dads-component");
    const component = fragment.root;
    
    // 必要な要素の取得と確認
    const input = component.querySelector(".dads-component__input");
    const errorText = component.querySelector(".dads-component__error-text");
    if (!input) throw new Error();
    if (!errorText) throw new Error();

    // data属性の設定
    component.setAttribute("data-type", args.variant);
    component.setAttribute("data-size", args.size);

    // 子要素の操作
    if (args.disabled) {
      input.setAttribute("disabled", "");
    }

    // 条件付きの要素削除
    if (!args.errored) {
      errorText.remove();
    }

    return fragment.toString({ trimBlankLines: true });
  },
  argTypes: {
    variant: {
      control: { type: "radio" },
      options: ["solid-fill", "outline", "text"],
    },
    size: {
      control: { type: "radio" },
      options: ["lg", "md", "sm"],
    },
    disabled: { control: "boolean" },
  },
  args: {
    variant: "solid-fill",
    size: "md",
    disabled: false,
  },
};
```

### HtmlFragmentの使い方

`HtmlFragment` はHTMLファイルから特定のセレクタに一致する要素を抽出するユーティリティ。

```typescript
// 第1引数: HTMLファイルの文字列（?rawインポート）
// 第2引数: 抽出するセレクタ（省略可）
const fragment = new HtmlFragment(playground, ".dads-component");

// rootプロパティで抽出した要素にアクセス
const component = fragment.root;

// 属性の操作
component.setAttribute("data-size", "lg");
component.removeAttribute("data-disabled");

// 子要素のクエリ
const input = component.querySelector(".dads-component__input");

// 文字列として出力
fragment.toString();
fragment.toString({ trimBlankLines: true });
```

**セレクタの選択:**
- コンポーネントのルートクラス: `.dads-component`
- body直下のラッパー: `"body > div"`
- 親コンポーネントのクラス: `.dads-form-control-label`（別コンポーネントとの組み合わせ表示時）

### 追加ストーリー（バリエーション表示等）

```typescript
// シンプルな表示のみのストーリー
export const WithFormControlLabel = () =>
  new HtmlFragment(withFormControlLabel, ".dads-form-control-label").toString();

export const Readonly = () =>
  new HtmlFragment(readonly, ".dads-form-control-label").toString();
```

### JSを含むコンポーネントのStories

JavaScriptを使用するコンポーネントでは、Storiesファイル内でJSもインポートする。

```typescript
import "./component-name.css";
import "./component-name.js"; // Custom Elementを登録

import playground from "./playground.html?raw";
```

## テスト

テストは3種類に分かれる。

- **VRT（Visual Regression Test）**: `.vrt.js` — Playwrightで実行。リセットCSS適用時にコンポーネントの見た目が変わらないことを検証する
- **機能テスト**: `.test.js` — Vitest browser modeで実行。JSを含むインタラクティブなコンポーネントの動作を検証する
- **ユニットテスト**: `.unit.js` — Vitest（jsdom）で実行。JSからエクスポートされた純粋関数のロジックを検証する

### VRT（.vrt.js）

#### 基本形（CSS-onlyコンポーネント）

```javascript
import path from "node:path";
import { resetCssVrt } from "../../../tests/helpers/reset-css-vrt";

const { dirname } = import.meta;

resetCssVrt("component-name", path.join(dirname, "playground.html"));
```

#### 複数のHTMLをテスト

各HTMLファイルに対して `resetCssVrt` を呼び出す。

```javascript
import path from "node:path";
import { resetCssVrt } from "../../../tests/helpers/reset-css-vrt";

const { dirname } = import.meta;

resetCssVrt(
  "input-text-playground",
  path.join(dirname, "playground.html"),
);

resetCssVrt(
  "input-text-with-form-control-label",
  path.join(dirname, "with-form-control-label.html"),
);
```

#### ignoreElementsオプション

テスト結果に影響を与えるが本質的な差異ではない要素（例: アコーディオンの開閉コンテンツ）をVRTテストから除外する。

```javascript
resetCssVrt("stacked", path.join(dirname, "stacked.html"), {
  ignoreElements: [".dads-accordion__content"],
});
```

#### resetCssVrtの仕組み

`resetCssVrt` は以下のテストを自動生成する:

1. Normalize.css適用時の表示に変化がないこと
2. Bootstrap Reboot適用時の表示に変化がないこと
3. Tailwind Preflight適用時の表示に変化がないこと
4. Eric Meyer's Reset CSS適用時の表示に変化がないこと
5. kiso.css適用時の表示に変化がないこと
6. 継承プロパティやグローバルスタイルが定義済みの時の表示に変化がないこと

各テスト内でベースライン（リセットCSS未適用）のスクリーンショットを取得し、リセットCSS適用後のスクリーンショットと pixelmatch で比較する。スナップショットファイルは生成されないため、`--update-snapshots` は不要。

#### テスト名

`resetCssVrt` の第1引数はテスト名。コンポーネント内で一意にする。

### 機能テスト（.test.js）

JSを含むインタラクティブなコンポーネントでは、Vitest browser modeで機能テストを記述する。

#### 設計原則

1. **決定的なテスト**: `new Date()` 等の現在時刻に依存する処理がある場合、`vi.useFakeTimers({ toFake: ["Date"] })` で時刻を固定し、実行日によって結果が変わらないようにする
2. **具体的なアサーション**: 「変わったこと」ではなく「何に変わったか」を検証する。`not.toBe(initialValue)` ではなく `toBe("期待値")` を使う
3. **playground.html から独立したHTML**: テスト用のHTMLをテストファイル内にインラインで定義し、playground.html のデモ用変更がテストに影響しないようにする。必要な `data-js-*` 属性・ARIA属性・構造のみを含む最小限のHTMLにする
4. **1テスト1振る舞い**: 各テストは1つのアクションと、それに対する具体的な期待結果を検証する
5. **不変条件の検証**: 「tabindex="0" のボタンが常に1つだけ存在する」のような不変条件を、状態変更のたびに検証する

#### 基本構造

```javascript
import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import "./component-name.js";

// 「今日」を固定する（時刻依存のコンポーネントの場合）
const FAKE_NOW = new Date(2025, 5, 15, 12, 0, 0);

// テスト用の最小限のHTML（playground.html から独立）
const componentHTML = (extraAttrs = "") => `
<dads-component class="dads-component" ${extraAttrs}>
  <button data-js-trigger-button>開く</button>
  <div data-js-content>コンテンツ</div>
</dads-component>`;

beforeEach(() => {
  // 時刻依存のコンポーネントの場合のみ
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(FAKE_NOW);
});

afterEach(() => {
  vi.useRealTimers();
  document.body.innerHTML = "";
});

/**
 * コンポーネントをDOMにマウントして返す。
 * 属性はHTML文字列に直接埋め込み、connectedCallback で1回だけ初期化させる。
 */
const mountComponent = async (options = {}) => {
  const attrs = [];
  if (options.minDate) attrs.push(`min-date="${options.minDate}"`);
  if (options.maxDate) attrs.push(`max-date="${options.maxDate}"`);
  document.body.innerHTML = componentHTML(attrs.join(" "));
  return document.querySelector("dads-component");
};

// DOM helpers — テスト対象のコンポーネントに合わせて定義
const enabledButtons = () =>
  [...document.querySelectorAll("[data-js-button]:not(:disabled)")];

const selectedButton = () =>
  document.querySelector('[data-selected="true"]');

describe("ComponentName", () => {
  test("ボタンクリックで開閉する", async () => {
    await mountComponent();
    await page.getByRole("button", { name: "開く" }).click();
    await expect
      .element(page.getByRole("button", { name: "開く" }))
      .toHaveAttribute("aria-expanded", "true");
  });
});
```

#### 時刻固定（`vi.useFakeTimers`）

`new Date()` に依存するコンポーネント（カレンダー等）では、テスト結果が実行日によって変わる問題がある。`vi.useFakeTimers({ toFake: ["Date"] })` を使い、`Date` コンストラクタのみをフェイクにする。`setTimeout` や `requestAnimationFrame` はそのまま動作する。

```javascript
beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date(2025, 5, 15, 12, 0, 0)); // 2025-06-15 に固定
});

afterEach(() => {
  vi.useRealTimers();
  document.body.innerHTML = "";
});
```

**注意:**
- `toFake: ["Date"]` を指定しないと `setTimeout` もフェイクになり、`await new Promise(resolve => setTimeout(resolve, 0))` が永遠に解決しなくなる
- `afterEach` で `vi.useRealTimers()` を必ず呼び、他のテストに影響しないようにする
- テストファイルの冒頭に、固定した日付でのカレンダー等の想定状態をコメントで書いておくと可読性が上がる

#### インラインHTMLによるセットアップ

テスト用HTMLをテストファイル内に文字列として定義し、`playground.html` への依存を排除する。

```javascript
// HTMLを関数にして、属性を動的に埋め込めるようにする
const calendarHTML = (extraAttrs = "") => `
<dads-calendar class="dads-calendar" role="application" ${extraAttrs}>
  <!-- data-js-* 属性とARIA属性を含む最小限の構造 -->
</dads-calendar>`;

const mountCalendar = async (options = {}) => {
  // 属性はHTML文字列に埋め込み、connectedCallback の1回の初期化で反映させる
  const attrs = [];
  if (options.minDate) attrs.push(`min-date="${options.minDate}"`);
  if (options.maxDate) attrs.push(`max-date="${options.maxDate}"`);
  document.body.innerHTML = calendarHTML(attrs.join(" "));
  return document.querySelector("dads-calendar");
};
```

**ポイント:**
- 属性は `innerHTML` に直接埋め込むことで、`connectedCallback` → `attributeChangedCallback` の二重初期化を避ける
- CSS クラスやSVG の装飾的属性は、JS の動作に影響しない限り省略してよい

#### 要素の取得方法

- **セマンティッククエリ（Vitest locator）**: ロール・ラベルで取得できる要素に使用する。テスト内で変数に入れて使い回せる（locatorは毎回最新のDOMを参照する）
  - `page.getByRole("button", { name: "送信" })`
  - `page.getByRole("combobox", { name: "年" })`
  - `page.getByRole("menuitem", { name: "項目1" })`
  - `page.getByText("メッセージ")`
- **`document.querySelector`**: `data-js-*` 属性やCSSセレクタでの取得が必要な場合に使用する。Vitest browser modeには `page.locator()` のようなCSSセレクタlocatorは存在しない
- **DOMヘルパー関数**: テスト全体で繰り返し使うクエリは、ファイル上部にヘルパー関数として定義する

```javascript
// セマンティッククエリ — locatorを変数に入れて使い回す
const opener = page.getByRole("button", { name: "メニュー" });
await opener.click();
await expect.element(opener).toHaveAttribute("aria-expanded", "true");

// DOM直接参照 — data-js-* 属性や内部状態の検証
const currentMonth = document.querySelector("[data-js-current-month]");
expect(currentMonth.textContent).toBe("6月");

// DOMヘルパー — 繰り返し使うクエリを関数化
const enabledButtons = () =>
  [...document.querySelectorAll("[data-js-date-button]:not(:disabled)")];
const buttonFor = (day) =>
  enabledButtons().find((b) => b.textContent === String(day));
const selectedButton = () =>
  document.querySelector('[data-selected="true"]');
```

#### アサーション

- **`expect.element(locator)`**: locatorに対するリトライ付きアサーション（非同期DOM更新の待機が必要な場合）
- **`expect(value)`**: 同期的な値の検証（即座に反映されるDOM変更の場合）
- **具体的な期待値を使う**: `not.toBe(initialValue)` ではなく `toBe("5月")` のように、何に変わるかを明示する

```javascript
// DO: 具体的な期待値
await page.getByRole("button", { name: "前の月" }).click();
expect(currentMonth()).toBe("5月");

// DON'T: 「変わった」だけの検証
const initial = currentMonth();
await page.getByRole("button", { name: "前の月" }).click();
expect(currentMonth()).not.toBe(initial);

// DO: イベント detail の具体的な値を検証
const date = handler.mock.calls[0][0].detail.date;
expect(date.getFullYear()).toBe(2025);
expect(date.getMonth()).toBe(5);
expect(date.getDate()).toBe(20);

// DON'T: detail が存在するかだけの検証
expect(handler.mock.calls[0][0].detail.date).toBeTruthy();
```

#### ユーザー操作

`userEvent`（CDPベースの実キーストローク）を使用する。

```javascript
import { userEvent } from "vitest/browser";

// キーボード操作
await userEvent.keyboard("{ArrowDown}");
await userEvent.keyboard("{Escape}");
await userEvent.keyboard("{Enter}");
await userEvent.keyboard("{ }");  // Spaceキー

// クリック
await opener.click();                    // locator経由
await userEvent.click(dateButton);       // DOM要素直接

// タブ
await userEvent.tab();
await userEvent.tab({ shift: true });
```

**注意:**
- Playwright locator の `click()` は `aria-disabled="true"` の要素でタイムアウトする（enabled になるのを待つため）。disabled 状態でのクリックをテストする場合は `element.click()` を使う
- カレンダーなどDOM再描画が行われるコンポーネントでは、クリック後にボタン参照が古くなる。再描画後は `document.querySelector` で再取得する

#### イベントハンドラの検証

`vi.fn()` を使用し、イベントの `detail` の具体的な値まで検証する。

```javascript
const handler = vi.fn();
cal().addEventListener("date-selected", handler);

await userEvent.click(buttonFor(20));

expect(handler).toHaveBeenCalledOnce();
const date = handler.mock.calls[0][0].detail.date;
expect(date.getFullYear()).toBe(2025);
expect(date.getMonth()).toBe(5);
expect(date.getDate()).toBe(20);
```

#### テストのカテゴリ

機能テストでは以下のカテゴリを網羅的にカバーする。

| カテゴリ | 検証内容の例 |
|---|---|
| 初期表示 | デフォルト状態での表示内容、属性値、範囲 |
| 描画 | 要素の数、enabled/disabled状態、行数 |
| ユーザー操作 | クリック、キーボードナビゲーション、選択/解除 |
| イベント | CustomEvent の発火、detail の値、bubbles |
| ナビゲーション制約 | 範囲外への移動が無視されること |
| 外部API | public メソッドの正常系・異常系 |
| 属性の動的変更 | `attributeChangedCallback` による再描画 |
| アクセシビリティ | aria-label、aria-selected、tabindex管理、ライブリージョン |
| エッジケース | 無効な入力、境界値、うるう年、DOM再接続 |

### ユニットテスト（.unit.js）

JSからエクスポートされた純粋関数（DOM操作を伴わないロジック）を検証する。jsdom環境で実行される。

```javascript
import { describe, test, expect } from "vitest";
import { parseSize, formatSize } from "./component-name.js";

describe("parseSize", () => {
  test("MB単位を正しくパースするべき", () => {
    expect(parseSize("10MB")).toBe(10 * 1024 * 1024);
  });

  test("不正な文字列の場合はnullを返すべき", () => {
    expect(parseSize("abc")).toBe(null);
  });
});
```

## アクセシビリティ

### 目標

WCAG 2.2のレベルAおよびレベルAA達成基準を全て満たすことを目標とする。

### 実装上の注意

- ネイティブHTML要素の機能を優先する（ARIAより）
- 必要最小限のARIA属性を使用する
- アイコンには適切な `aria-hidden="true"` または `role="img"` + `aria-label` を付与する
- フォームコントロールには必ずラベルを関連付ける
- 強制カラーモード（`forced-colors: active`）に対応する
- 視覚効果低減モード（`prefers-reduced-motion: reduce`）に対応する
- キーボード操作を確保する
- スクリーンリーダーでの動作を確認する

### SVGアイコンのアクセシビリティ

```html
<!-- 装飾的アイコン（テキストラベルと併用） -->
<svg aria-hidden="true">...</svg>

<!-- 意味を持つアイコン -->
<svg role="img" aria-label="新規タブで開きます">...</svg>
```

## 開発コマンド

```bash
# Storybookの起動（開発サーバー）
npm run storybook

# 全VRTテストの実行（Playwright）
npm test

# 特定のコンポーネントのVRTテスト
npx playwright test src/components/<component-name>/<component-name>.vrt.js

# VRTスナップショットの更新
npx playwright test --update-snapshots

# 全機能テストの実行（Vitest browser mode）
npm run test:browser

# 特定のコンポーネントの機能テスト
npx vitest run --project browser src/components/<component-name>/<component-name>.test.js

# ユニットテストの実行（Vitest jsdom）
npx vitest run --project unit

# 特定のコンポーネントのユニットテスト
npx vitest run --project unit src/components/<component-name>/<component-name>.unit.js

# フォーマット
npx @biomejs/biome format --write src/components/<component-name>/
```

## チェックリスト

コンポーネント開発時に確認すること:

### CSS

- [ ] `dads-` プレフィックスを使用している
- [ ] BEM + data属性Modifierの命名規則に従っている
- [ ] 単位は `calc(px / 16 * 1rem)` パターンを使用している（borderの `px` を除く）
- [ ] コンポーネントルートで継承プロパティ（color、font-*、line-height、letter-spacing）をリセットしている
- [ ] `box-sizing: border-box` を必要な要素（border/paddingとwidth/heightが共存）に指定している
- [ ] margin等のブラウザデフォルトスタイルをリセットしている
- [ ] フォーカススタイルを統一パターンで実装している
- [ ] 無効状態に `disabled` と `aria-disabled` の両方で対応している
- [ ] ホバースタイルを `@media (hover: hover)` で囲んでいる
- [ ] 強制カラーモード（`forced-colors: active`）に対応している
- [ ] 論理的プロパティを使用していない
- [ ] カスケードレイヤーを使用していない
- [ ] デザイントークン（CSS Custom Properties）を使用している

### HTML

- [ ] `playground.html` がHTMLテンプレートに従っている
- [ ] Google Fontsの読み込みを含んでいる
- [ ] `global.css` を読み込んでいる
- [ ] `lang="ja"` を指定している
- [ ] セマンティックなマークアップを使用している
- [ ] アクセシビリティ属性が適切に設定されている
- [ ] 追加HTMLは使い方が大きく異なる場合のみ用意している

### Stories

- [ ] `Meta` の `title` が `"Components/<日本語名>"` の形式
- [ ] CSS（および依存CSS）を正しくインポートしている
- [ ] HTMLファイルを `?raw` 付きでインポートしている
- [ ] `HtmlFragment` を正しく使用している
- [ ] `argTypes` でコントロール可能なバリエーションを定義している
- [ ] Playgroundの `render` 関数でHTMLを正しく操作している

### テスト

- [ ] `resetCssVrt` で全HTMLのVRTテストを `.vrt.js` ファイルに定義している
- [ ] VRTテスト名がコンポーネント内で一意である
- [ ] 必要に応じて `ignoreElements` オプションを使用している
- [ ] JSを含むコンポーネントでは `.test.js` ファイルにVitest browser modeで機能テストを記述している
- [ ] テスト用HTMLをテストファイル内にインラインで定義し、playground.html から独立させている
- [ ] `new Date()` 等に依存する場合は `vi.useFakeTimers({ toFake: ["Date"] })` で時刻を固定している
- [ ] アサーションには具体的な期待値を使い、「変わった」ではなく「何に変わったか」を検証している
- [ ] イベントの `detail` の具体的な値まで検証している
- [ ] `page.getByRole` 等のセマンティッククエリを優先し、`data-js-*` 属性には `document.querySelector` を使用している
- [ ] 純粋関数をエクスポートしている場合は `.unit.js` ファイルにユニットテストを記述している

### JavaScript（該当する場合）

- [ ] Custom Elements（`extends HTMLElement`）を使用している
- [ ] Shadow DOMを使用していない
- [ ] `AbortController`の`signal`でイベントリスナーを管理している
- [ ] `disconnectedCallback`で`abort()`を呼んでいる
- [ ] DOM要素アクセスはgetterで定義し、`data-js-*` 属性をセレクタに使用している
- [ ] ES Moduleとしてエクスポートしている
- [ ] `customElements.define` でカスタム要素を登録している
- [ ] 言語依存のメッセージはdata属性で上書き可能にしている
- [ ] 公開APIは最小限に絞り、内部メソッド・ゲッターは `#` でprivate化している
- [ ] 他クラスから呼ばれる、または有用なプロパティおよびメソッドのみをpublicとして残している

### フォーマット

- [ ] `npx @biomejs/biome format --write src/components/<component-name>/` を実行してBiomeでフォーマットしている
