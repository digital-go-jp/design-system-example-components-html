[Consolidated](./date-picker.stories.ts?controls#Consolidated)

## コンポーネントのガイドライン

[日付ピッカー／カレンダー（概要）｜デジタル庁デザインシステムβ版](https://design.digital.go.jp/dads/components/date-picker/)

## ソースコード

<details>
<summary>HTML</summary>

#### Consolidated（統合型）

[playground-consolidated.html](./playground-consolidated.html#.dads-date-picker)

#### Separated（分割型）

[playground-separated.html](./playground-separated.html#.dads-date-picker)

#### Consolidated with Calendar（統合型＋カレンダー）

[playground-consolidated-with-calendar.html](./playground-consolidated-with-calendar.html#.dads-date-picker)

#### Separated with Calendar（分割型＋カレンダー）

[playground-separated-with-calendar.html](./playground-separated-with-calendar.html#.dads-date-picker)

</details>

<details>
<summary>date-picker.css</summary>

[date-picker.css](./date-picker.css)

</details>

<details>
<summary>date-picker.js</summary>

[date-picker.js](./date-picker.js)

</details>

<details>
<summary>calendar.css</summary>

[calendar.css](../calendar/calendar.css)

</details>

<details>
<summary>calendar.js</summary>

[calendar.js](../calendar/calendar.js)

</details>

### 依存ファイル

<details>
<summary>button.css</summary>

[button.css](../button/button.css)

</details>

<details>
<summary>select.css</summary>

[select.css](../select/select.css)

</details>

## 仕様

### バリエーション

| 属性 | 値 | 説明 |
| --- | --- | --- |
| `data-type` | `consolidated`, `separated` | 日付ピッカーの表示タイプ |
| `data-size`（controls要素） | `sm`, `md`, `lg` | コントロールのサイズ |

### 2タイプの日付ピッカー

#### Consolidated（統合型）

年、月、日の3つの入力欄がひとつのまとまった操作領域として表示されます。キーボードの左右キーによるフィールド間のナビゲーションをサポートしています。

[Consolidated](./date-picker.stories.ts#Consolidated)

#### Separated（分割型）

年、月、日の各フィールドが視覚的に分割されて表示されます。キーボードの左右キーによるフィールド間のナビゲーションは行えません。

[Separated](./date-picker.stories.ts#Separated)

### カレンダー機能

カレンダーアイコンをクリックして開くポップアップから日付を選択できます。カレンダー機能は任意で追加できる機能のため、ConsolidatedおよびSeparatedそれぞれに、カレンダー付きのバリエーションを用意しています。

[ConsolidatedWithCalendar](./date-picker.stories.ts#ConsolidatedWithCalendar)

[SeparatedWithCalendar](./date-picker.stories.ts#SeparatedWithCalendar)

### date-picker.js の機能

- カスタム要素 `<dads-date-picker>` を定義
- Consolidatedタイプでキーボードナビゲーション（←→キーによるフィールド間移動）を実装
- カレンダーアイコンのクリックでポップアップを開閉
- カレンダーで日付を選択すると各入力欄に値を反映
- `Esc`キーによる閉じる操作、`Tab`キーによるフォーカストラップをサポート
- バリデーション機構は含まない

### calendar.js の機能

- カスタム要素 `<dads-calendar>` を定義
- `min-date` / `max-date` 属性で日付範囲を設定可能
- 日付選択時に `date-selected` カスタムイベントを発火
- 「前月／次月」「今日」「削除」ボタンをサポート
- カレンダーUIにおける標準的なキーボードナビゲーションをサポート

## 使い方

### インストール

#### 必要なファイル

- **共通（どちらのタイプでも必要）**
  - `date-picker.css`
  - `date-picker.js`
- **カレンダー機能を使う場合に追加で必要**
  - `button.css`
  - `calendar.css`
  - `calendar.js`
  - `select.css`

スクリプトを読み込む際は必ず、`<script type="module">`を使用しES Moduleとして読み込んでください。

### ラベルのマークアップ

日付ピッカーは複数の入力フィールドから成ります。日付ピッカーにラベルを付与する際は、`<fieldset>`要素で囲んでグループ化し、グループのラベルを`<legend>`要素で提供します。

スクリーンリーダーは、グループに含まれるフィールドを読み上げる際、グループ名もあわせて読み上げます。これにより、スクリーンリーダーユーザーは入力対象について素早く理解できるようになります。

また、サポートテキストおよびエラーテキストは`aria-describedby`属性を使用して`<fieldset>`要素と紐付けを行います。サポートテキストおよびエラーテキストの`id`属性はページ内で一意にする必要があります。

[with-form-control-label.html](./with-form-control-label.html#.dads-form-control-label)

#### 参考情報

- [H71: fieldset 要素及び legend 要素を使用して、フォームコントロールのグループに関する説明を提供する [WCAG 2.1]](https://waic.jp/translations/WCAG21/Techniques/html/H71)

### エラー状態の実装

エラーをユーザーに表示する場合は、各入力フィールドに以下の属性を設定します。

- `aria-invalid="true"`: 入力が不正であることをスクリーンリーダーに伝える
- `aria-describedby="<エラーテキストのid>"`: エラーメッセージ要素のIDを参照

Consolidatedタイプの場合は、外側のコンテナに`data-error`属性を追加してスタイルを変更します。

[error.html](./error.html#.dads-form-control-label)


### 読み取り専用状態

読み取り専用にする場合は、各入力フィールドに`readonly`属性を追加し、コンテナに`data-readonly`属性を設定します。

[readonly.html](./readonly.html#.dads-form-control-label)

### 無効状態

無効にする場合は、各入力フィールドに`disabled`属性を追加し、コンテナに`data-disabled`属性を設定します。

[disabled.html](./disabled.html#.dads-form-control-label)

### バリデーション

`date-picker.js`には入力値のバリデーション機構を含みません。すべての入力チェック（数値であること、妥当な範囲であることなど）は、開発者側でスクリプトをカスタマイズするか、サーバーサイドで行う必要があります。
