フォームコントロールラベルは、インプットテキストやセレクトボックス等のコントロールや、チェックボックス等をまとめたグループにラベルを付与するコンポーネントです。

[Single](./form-control-label.stories.ts?controls#Single)

## ソースコード

<details>
<summary>HTML</summary>

#### 単一のコントロール

[single.html](./single.html#.dads-form-control-label)

#### 複数のコントロール（グループ）

[multiple.html](./multiple.html#.dads-form-control-label)

</details>

<details>
<summary>form-control-label.css</summary>

[form-control-label.css](./form-control-label.css)

</details>

## 仕様

### バリエーション

| 属性 | 値 | 説明 |
| --- | --- | --- |
| `data-size` | `sm`, `md`, `lg` | ラベルのサイズ |

## 使い方

### 単一のコントロールにラベルを付ける

ラベルを付与する対象が単一のコントロールの場合、`<label>`要素を使用します。`<label>`要素には、`for`属性を使用してラベルがどのコントロールに関連付けられているかを指定します。これにより、支援技術はコントロールが持つ情報にアクセスできるようになります。

[single.html](./single.html#.dads-form-control-label)

### 複数のコントロールにラベルを付ける

チェックボックス、ラジオボタンまたは日付ピッカー等、複数のコントロールをまとめたグループにラベルを付ける場合、`<fieldset>`要素でグループを明示し、`<legend>`要素を使用してグループのラベルを指定します。

[multiple.html](./multiple.html#.dads-form-control-label)

### 必須/任意の表示

`.dads-form-control-label__requirement`要素で必須・任意を表示します。テキストと`data-required`属性の両方を設定してください。`data-required="true"`の場合、テキストが赤色で表示されます。

```html
<!-- 必須 -->
<label class="dads-form-control-label__label" for="input-id">
  ラベル
  <span class="dads-form-control-label__requirement" data-required="true">※必須</span>
</label>

<!-- 任意 -->
<label class="dads-form-control-label__label" for="input-id">
  ラベル
  <span class="dads-form-control-label__requirement" data-required="false">※任意</span>
</label>
```

### エラーテキストの配置

エラーテキストは、フォームコントロールラベルが提供するパーツ（`.dads-form-control-label__error-text`）を使用できますが、各コントロールが提供するパーツを使用しても構いません。

### 項目ラベルとコントロールを水平方向に並べる

`data-direction="horizontal"`属性を使用して、項目ラベルとコントロールを水平方向に並べることができます。

[horizontal.html](./horizontal.html#.dads-form-control-label)

### アクセシビリティ

#### サポートテキストとエラーテキストの関連付け

- サポートテキストがある場合、サポートテキストに`id`属性を付与し、`aria-describedby`属性を使用してコントロールまたはグループを関連付けます。
- エラーテキストがある場合、エラーテキストに`id`属性を付与し、`aria-describedby`属性を使用してコントロールまたはグループを関連付けます。
- サポートテキストおよびエラーテキストがある場合、両方の`id`をスペースで区切って`aria-describedby`属性に指定します。

#### チェックボックスと`<fieldset>`要素の組み合わせにおける読み上げについて

チェックボックスを`<fieldset aria-describedby="...">`要素に含める場合において、ブラウザ、支援技術、またはそれらの組み合わせによっては、サポートテキストおよびエラーテキストを適切に読み上げない問題が確認されています。

現時点で回避策はありません。各チェックボックスに`aria-describedby`属性を使用してサポートテキストおよびエラーテキストのIDを指定することで、支援技術がチェックボックスに関連付けられたサポートテキストおよびエラーテキストを読み上げることができますが、フォーカスを移動するたびに同一のテキストが読み上げられ冗長であるため、この方法は推奨していません。

<dl>
  <dt>問題を確認した環境</dt>
  <dd>NVDA日本語版 2024.4.2 + Chrome 137</dd>
  <dt>再現手順</dt>
  <dd>
    1. 当ページで提供しているコードスニペットを使用する。サポートテキストおよびチェックボックスを含む`<fieldset>`要素を作成し、`<fieldset>`要素に`aria-describedby="{サポートテキストのID}"`を付与する。<br />
    2. Tabキーを押してチェックボックスにフォーカスを移動する。<br />
    3. `<fieldset>`要素に紐づくサポートテキストが読み上げられないことを確認する。
  </dd>
</dl>

なお、ラジオボタンやその他のフォームコントロールにおいては、上記の問題は確認されていません。

##### 参考情報

- [aria-describedby not reported for group in browse mode - Issue #12718 - nvaccess/nvda](https://github.com/nvaccess/nvda/issues/12718)
