[WithoutMarker](./description-list.stories.ts?controls#WithoutMarker)

## コンポーネントのガイドライン

[説明リスト（概要）｜デジタル庁デザインシステムβ版](https://design.digital.go.jp/dads/components/description-list/)

## ソースコード

<details>
<summary>HTML</summary>

### マーカー無し

[without-marker.html](./without-marker.html#.dads-description-list)

### ビュレット付き

[bullet.html](./bullet.html#.dads-description-list)

### カスタムマーカー付き

[custom-marker.html](./custom-marker.html#.dads-description-list)

</details>

<details>
<summary>description-list.css</summary>

[description-list.css](./description-list.css)

</details>

## 仕様

### バリエーション

| 属性 | 値 | 説明 |
| --- | --- | --- |
| `data-marker` | `bullet`, `custom` | マーカーの種類 |

## 使い方

### テキストのスタイル

このコンポーネントは、フォントの種類・サイズ・行の高さを指定していません。テキストには配置先から継承したスタイルが適用されます。必要に応じて、配置先でこれらのスタイルを指定してください。

### 基本的な使い方

説明リストは`<dl>`、`<dt>`、`<dd>`要素を使用します。各項目を`<div>`要素で囲むことでグループ化できます。

[without-marker.html](./without-marker.html#.dads-description-list)

### ビュレット付き

マーカーとしてビュレット（丸点）を表示する場合は、`data-marker="bullet"`を指定します。

[Bullet](./description-list.stories.ts#Bullet)

### カスタムマーカー付き

独自のマーカー（連番、アイコンなど）を使用する場合は、`data-marker="custom"`を指定します。カスタムマーカーは`<dt>`要素の最初の`<span>`要素で指定します。

[CustomMarker](./description-list.stories.ts#CustomMarker)

アイコンをマーカーとして使用することもできます。

[CustomIconMarker](./description-list.stories.ts#CustomIconMarker)
