[Playground](./toc.stories.ts?controls#Playground)

## コンポーネントのガイドライン

[目次（概要）｜デジタル庁デザインシステムβ版](https://design.digital.go.jp/dads/components/toc/)

## ソースコード

<details>
<summary>HTML</summary>

[playground.html](./playground.html#.dads-toc)

</details>

<details>
<summary>toc.css</summary>

[toc.css](./toc.css)

</details>

### 依存ファイル

<details>
<summary>link.css</summary>

[link.css](../link/link.css)

</details>

<details>
<summary>list.css</summary>

[list.css](../list/list.css)

</details>

## 仕様

### バリエーション

| 属性 | 値 | 説明 |
| --- | --- | --- |
| `data-border` | なし（デフォルト）, `dotted`, `solid` | 枠線のスタイル |

## 使い方

### インストール

#### 必要なファイル

- `toc.css`
- `link.css`（リンクスタイル）
- `list.css`（リストスタイル）

### セクション階層をネストリストで表現する

ページのセクション階層を表現する場合は、リストをネストして使用できます。親リスト項目もリンクにすることができます。

[nested.html](./nested.html#.dads-toc)

### 枠線を表示する

デフォルトでは枠線は表示されません。枠線を表示するには、`.dads-toc`要素に`data-border`属性を追加します。値には`dotted`（点線）または`solid`（実線）を指定できます。

### マークアップ

#### `id`属性の重複を避ける

`aria-labelledby`属性によってナビゲーションのラベルを`id="toc-heading"`で指定しています。同一ページ内に複数の目次を配置する場合は、`id`値が重複しないようにユニークな値を付けてください。

```html
<!-- 例: 複数ある場合 -->
<nav class="dads-toc" aria-labelledby="toc-2-heading">
  <h2 id="toc-2-heading" class="dads-toc__heading">このページの目次</h2>
  …
</nav>
```

#### 見出しレベルを適切に設定する

`dads-toc__heading`は`font: inherit`でページのフォントを継承するため、どの見出しレベル（`h2`〜`h6`）でも同じ見た目になります。ページの見出し階層に合わせて適切なレベルを使用してください。

```html
<!-- h3を使う場合 -->
<h3 id="toc-heading" class="dads-toc__heading">このページの目次</h3>
```
