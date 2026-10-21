[Success](./notification-banner.stories.ts?controls#Success)

## コンポーネントのガイドライン

[ノティフィケーションバナー（概要）｜デジタル庁デザインシステムβ版](https://design.digital.go.jp/dads/components/notification-banner/)

## ソースコード

<details>
<summary>HTML</summary>

[success.html](./success.html#.dads-notification-banner)

</details>

<details>
<summary>notification-banner.css</summary>

[notification-banner.css](./notification-banner.css)

</details>

### 依存ファイル

<details>
<summary>button.css</summary>

[button.css](../button/button.css)

</details>

## 仕様

### バリエーション

| 属性 | 値 | 説明 |
| --- | --- | --- |
| `data-style` | `standard`, `color-chip` | バナーのスタイル。`standard`は角丸とボーダー、`color-chip`は左側にカラーチップを表示 |
| `data-type` | `success`, `error`, `warning`, `info-1`, `info-2` | バナーのタイプ。メッセージの種類に応じた色とアイコンを表示 |

### タイプ別の用途

| タイプ | 用途 |
| --- | --- |
| `success` | 操作が正常に完了したことを伝える |
| `error` | エラーや問題が発生したことを伝える |
| `warning` | 注意が必要な状況を伝える |
| `info-1` | 情報を伝える（プライマリーカラー） |
| `info-2` | 情報を伝える（グレー） |

## 使い方

### インストール

#### 必要なファイル

- **共通**
  - `notification-banner.css`
- **追加で必要**
  - `button.css`（アクションボタンを使用する場合）

### タイプ

`.dads-notification-banner`要素の`data-type`属性の値に応じて、アイコン・色・見出しテキストを切り替えます。アイコンには`role="img"`と`aria-label`を付与し、支援技術でアイコンの意味が伝わるようにしてください。

#### success（サクセス）

操作が正常に完了したことを伝えます。

[success.html](./success.html#.dads-notification-banner)

#### error（エラー）

エラーや問題が発生したことを伝えます。

[error.html](./error.html#.dads-notification-banner)

#### warning（警告）

注意が必要な状況を伝えます。

[warning.html](./warning.html#.dads-notification-banner)

#### info-1（情報・プライマリーカラー）

情報を伝えます（プライマリーカラー）。

[info-1.html](./info-1.html#.dads-notification-banner)

#### info-2（情報・グレー）

情報を伝えます（グレー）。アイコンは`info-1`と同じで、色のみグレーに変わります。

[info-2.html](./info-2.html#.dads-notification-banner)

### スタイルを切り替える

バナーのスタイルには2種類あります。デフォルトは角丸とボーダーで囲む`standard`で、左側にカラーチップを表示するスタイルにするには、`.dads-notification-banner`要素の`data-style`属性に`color-chip`を指定します。

[color-chip.html](./color-chip.html#.dads-notification-banner)

### 閉じるボタンを非表示にする

バナーを閉じる必要がない場合は、閉じるボタン（`.dads-notification-banner__close`）を削除します。

### アクションボタンを非表示にする

アクションボタンが不要な場合は、アクションエリア（`.dads-notification-banner__actions`）を削除します。

### モバイル向けコンパクト閉じるボタン

テキストが長くなる場合、モバイル表示ではコンパクトな閉じるボタンを使用できます。通常の閉じるボタンの代わりに、`.dads-notification-banner__mobile-close`を使用します。

[mobile-compact.html](./mobile-compact.html#.dads-notification-banner)

```html
<button class="dads-notification-banner__mobile-close" type="button">
  <svg class="dads-notification-banner__mobile-close-icon" width="44" height="44" viewBox="0 0 44 44" role="img" aria-label="閉じる">
    <path d="m13 26-2-2 9-9-9-9 2-2 9 9 9-9 2 2-9 9 9 9-2 2-9-9-9 9ZM11.8 30v3.6H9v5.3H8V30h3.8ZM9 32.1v.7h1.7V32H9Zm0-.7h1.7v-.6H9v.6ZM16.4 30v7.6c0 .5 0 1-.5 1.1-.4.2-1 .2-2 .2 0-.3-.1-.7-.3-1h1.5c.2 0 .2-.1.2-.3v-4h-2.8V30h4Zm-2.8 2.1v.7h1.7v-.7h-1.7Zm0-1.3v.6h1.7v-.6h-1.7ZM13.3 34.6h1.4v.9h-1.4v2.2c0 .5 0 .7-.4.8-.3.2-.7.2-1.3.2l-.3-.9h.9l.1-.1v-1.5a8 8 0 0 1-2.3 1.9l-.6-.8c1-.4 1.8-1 2.5-1.8H9.7v-1h2.6v-.7h1v.8ZM23 31l1 1.6-.9.4c-.2-.6-.5-1.1-.9-1.6l.8-.3Zm1.3-.5 1 1.6-.8.4-1-1.6.8-.4Zm-4-.3c-.2 2-.1 4-.2 6 0 .3 0 .6.2.8.3.4.7.5 1.3.5 1.7 0 2.7-1 3.4-2l.9 1a5.3 5.3 0 0 1-4.3 2.2c-1 0-2-.3-2.3-1-.3-.3-.3-.6-.3-1.2v-6.3h1.4ZM28.8 30.5H31a60.3 60.3 0 0 0 2.8-.1l.6.8c-1.1.6-2 1.5-3 2.3l1-.1c1.5 0 3 .9 3 2.4 0 1.1-.6 2-1.6 2.4-.5.3-1.2.4-2 .4-1 0-2.3-.4-2.3-1.6 0-.9.8-1.5 1.7-1.5a2 2 0 0 1 2.1 2l-1 .2c0-.7-.4-1.3-1.1-1.3-.3 0-.7.2-.7.5 0 .6.7.7 1.1.7 1.7 0 2.6-.7 2.6-1.8 0-1-1.2-1.6-2-1.6-.9 0-1.5.2-2 .6-.7.3-1.2.8-1.8 1.5l-.8-.9 2.6-2.1 2.1-1.8c-1.1 0-2.2 0-3.3.2v-1.2Z" fill="currentcolor"/>
  </svg>
</button>
```

### 見出しレベル

バナーの見出しはデフォルトで`<h2>`を使用していますが、ページ内の見出し構造に応じて適切なレベルに変更してください。
