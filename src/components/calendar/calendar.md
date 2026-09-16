[Playground](./calendar.stories.ts?controls#Playground)

## コンポーネントのガイドライン

[日付ピッカー／カレンダー（概要）｜デジタル庁デザインシステムβ版](https://design.digital.go.jp/dads/components/date-picker/)

## ソースコード

<details>
<summary>HTML</summary>

[playground.html](./playground.html#.dads-calendar)

</details>

<details>
<summary>calendar.css</summary>

[calendar.css](./calendar.css)

</details>

<details>
<summary>calendar.js</summary>

[calendar.js](./calendar.js)

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

### 選択可能範囲

`min-date`および`max-date`属性を使用して、ユーザーが選択できる日付の範囲を制限できます。`YYYY-MM-DD`形式で指定します。

```html
<dads-calendar min-date="2023-01-01" max-date="2024-12-31">
  ...
</dads-calendar>
```

指定した日付はいずれも「選択可能」な日付として取り扱われます。日付を指定しない場合、デフォルトで1年前から1年後までの範囲が選択可能になります。

### イベント

`dads-calendar`は、日付が選択されたときに`date-selected`イベントを発火します。このイベントは、選択された日付を含むオブジェクトを`detail`プロパティに持ちます。

```javascript
const calendar = document.querySelector("dads-calendar");
calendar.addEventListener("date-selected", (e) => {
  const date = e.detail.date;
  if (date) {
    console.log("選択された日付:", date);
  } else {
    console.log("日付が削除されました");
  }
});
```

### キーボード操作

カレンダーグリッド内では、以下のキーボード操作がサポートされています。

| キー | 動作 |
| --- | --- |
| 矢印キー（上下左右） | 日付間を移動 |
| Enter / Space | 日付を選択 |

## 使い方

### インストール

#### 必要なファイル

- **共通**
  - `calendar.css`
  - `calendar.js`
- **追加で必要**
  - `button.css`
  - `select.css`

スクリプトを読み込む際は必ず、`<script type="module">`を使用しES Moduleとして読み込んでください。
