[Playground](./utility-link.stories.ts?controls#Playground)

## コンポーネントのガイドライン

[ユーティリティリンク（概要）｜デジタル庁デザインシステムβ版](https://design.digital.go.jp/dads/components/utility-link/)

## ソースコード

<details>
<summary>HTML</summary>

[basic.html](./basic.html#.dads-utility-link)

</details>

<details>
<summary>utility-link.css</summary>

[utility-link.css](./utility-link.css)

</details>

## 使い方

### リードアイコンの配置

リードアイコン（`dads-utility-link__lead-icon`）はリンクの内容を視覚的に補足するための装飾です。装飾的なアイコンのため`aria-hidden="true"`を設定してください。アイコンは必要に応じて追加できます。

[with-lead-icon.html](./with-lead-icon.html#.dads-utility-link)

### 外部リンクの実装

外部リンク（`target="_blank"`）の場合、末尾に外部リンクアイコン（`dads-utility-link__tail-icon`）を追加します。アイコンには`role="img"`と`aria-label="新規タブで開きます"`を設定し、スクリーンリーダーでリンクの動作を伝えます。

[playground.html](./playground.html#.dads-utility-link)
