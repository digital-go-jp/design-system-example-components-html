[Playground](./checkbox.stories.ts?controls#Playground)

## コンポーネントのガイドライン

[チェックボックス（概要）｜デジタル庁デザインシステムβ版](https://design.digital.go.jp/dads/components/checkbox/)

## ソースコード

<details>
<summary>HTML</summary>

#### 基本形（ラベル付き）

[playground.html](./playground.html#.dads-checkbox)

#### スタンドアロン（ラベルなし）

[standalone.html](./standalone.html#.dads-checkbox)

</details>

<details>
<summary>checkbox.css</summary>

[checkbox.css](./checkbox.css)

</details>

### 依存ファイル

<details>
<summary>form-control-label.css</summary>

[form-control-label.css](../form-control-label/form-control-label.css)

</details>

## 仕様

### バリエーション

| 属性 | 値 | 説明 |
| --- | --- | --- |
| `data-size` | `sm`, `md`, `lg` | チェックボックスのサイズ |

## 使い方

### 選択肢ラベルおよびチェックボックスのマークアップ

原則として`<label>`要素を使用してチェックボックスおよび選択肢ラベルを関連付けます。これにより、チェックボックスのアクセシブルな名前として選択肢ラベルのテキストが設定されます。また、選択肢ラベルのテキスト部分がクリック範囲に含まれるようになるため、チェックボックスのクリックしやすさが向上します。

[playground.html](./playground.html#.dads-checkbox)

### チェックボックスと選択肢ラベルを離して配置する場合

チェックボックスと選択肢ラベルを離して配置する場合、選択肢ラベルのみを`<label>`要素でマークアップし、チェックボックスに付与したIDを`for`属性に指定します。

```html
<tr>
  <td>
    <span class="dads-checkbox" data-size="sm">
      <span class="dads-checkbox__checkbox">
        <input id="article-1-checkbox" class="dads-checkbox__input" type="checkbox">
      </span>
    </span>
  </td>
  <td>
    <label for="article-1-checkbox">記事タイトル</label>
  </td>
  …
</tr>
```

### `<label>`要素が使えない場合のマークアップ

状況によっては`<label>`要素が使えない場合があります。例えば、選択肢ラベルに該当するテキストがリンクである場合です。その場合、選択肢ラベルに該当するテキストを含む要素に`aria-labelledby`属性を付与し、チェックボックスのアクセシブルな名前を指定します。

```html
<tr>
  <td>
    <span class="dads-checkbox" data-size="sm">
      <span class="dads-checkbox__checkbox">
        <input class="dads-checkbox__input" type="checkbox" aria-labelledby="article-1-title">
      </span>
    </span>
  </td>
  <td>
    <a id="article-1-title" href>記事タイトル</a>
  </td>
  …
</tr>
```

### 選択肢のグループ化

複数の選択肢をもつチェックボックスは、`<fieldset>`要素で囲んでグループ化し、グループのラベルを`<legend>`要素で提供します。

詳細は[フォームコントロールラベル](?path=/docs/components-フォームコントロールラベル--docs#複数のコントロールにラベルを付ける)を参照してください。

[stacked.html](./stacked.html#.dads-form-control-label)

### エラー状態の実装

エラー状態のチェックボックスには、`<input>`要素に`aria-invalid="true"`を設定します。

```html
<input class="dads-checkbox__input" type="checkbox" aria-invalid="true">
```

エラーメッセージを表示する場合は、`aria-describedby`属性を使用してエラーテキストを関連付けてください。

[errored.html](./errored.html#.dads-form-control-label)

### 不確定状態（indeterminate）の実装

チェックボックスの不確定状態（一部のみ選択されている状態）は、JavaScriptで`indeterminate`プロパティを設定することで実装できます。

```javascript
checkbox.indeterminate = true;
```

<details>
<summary>実装例</summary>

[indeterminate.html](./indeterminate.html#body>*)

</details>

## 参考情報

- [H71: fieldset 要素及び legend 要素を使用して、フォームコントロールのグループに関する説明を提供する [WCAG 2.1]](https://waic.jp/translations/WCAG21/Techniques/html/H71)
