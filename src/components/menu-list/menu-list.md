[Playground](./menu-list.stories.ts?controls#Playground)

## コンポーネントのガイドライン

[メニューリスト（概要）｜デジタル庁デザインシステムβ版](https://design.digital.go.jp/dads/components/menu-list/)

## ソースコード

<details>
<summary>HTML</summary>

#### 基本形

[basic.html](./basic.html#body>.dads-menu-list)

#### アイコン付き

[playground.html](./playground.html#body>.dads-menu-list)

#### 子メニュー付き

[has-children.html](./has-children.html#body>.dads-menu-list)

</details>

<details>
<summary>menu-list.css</summary>

[menu-list.css](./menu-list.css)

</details>

## 仕様

### バリエーション

| 属性 | 値 | 説明 |
| --- | --- | --- |
| `data-type` | `standard`, `box` | メニュー項目のスタイル。`standard`は角丸、`box`は矩形 |
| `data-size` | `regular`, `small` | メニュー項目のサイズ |

### 状態属性

| 属性 | 説明 |
| --- | --- |
| `data-current` | 現在選択中のメニュー項目を示す |
| `data-expanded` | 子メニューが展開されていることを示す（エンドアイコンが180度回転） |

### CSSカスタムプロパティ

| プロパティ | 説明 |
| --- | --- |
| `--menu-list-indentation` | インデントレベル（子メニューに`1`、孫メニューに`2`など） |

## 使い方

### メニュー項目の要素

メニュー項目には`<button>`要素または`<a>`要素を使用できます。

- ナビゲーションリンクの場合: `<a>`要素を使用
- アクションの場合: `<button>`要素を使用

```html
<!-- リンクの場合 -->
<a class="dads-menu-list__item" href="/page" data-type="standard" data-size="regular">
  <span class="dads-menu-list__label">ページへ移動</span>
</a>

<!-- ボタンの場合 -->
<button class="dads-menu-list__item" type="button" data-type="standard" data-size="regular">
  <span class="dads-menu-list__label">アクションを実行</span>
</button>
```

### アイコンの追加

メニュー項目には3種類のアイコンを配置できます。

| クラス | 位置 |
| --- | --- |
| `dads-menu-list__front-icon` | 項目の先頭 |
| `dads-menu-list__tail-icon` | ラベルの末尾 |
| `dads-menu-list__end-icon` | 項目の末尾 |

### 現在位置の表示

現在選択中・表示中の項目を示すには、`data-current`属性を追加します。注意点として、後述するARIA属性も併用する必要があります。

```html
<a class="dads-menu-list__item" href="/current-page" data-type="standard" data-size="regular" data-current>
  <span class="dads-menu-list__label">現在のページ</span>
</a>
```

`data-current`が設定された項目の親メニュー項目は自動的に薄いハイライトが適用されます。

#### アクセシビリティ属性の併用

`data-current`属性は視覚的なスタイルのみを制御し、スクリーンリーダーには状態が伝わりません。支援技術に現在の状態を伝えるため、用途に応じて適切なARIA属性を併用してください。

| 用途 | 使用する属性 | 説明 |
| --- | --- | --- |
| 現在のページ/位置 | `aria-current="page"` | ナビゲーション内で現在表示中のページを示す |
| 現在のステップ | `aria-current="step"` | ウィザードやプロセス内の現在のステップを示す |
| 選択状態 | `aria-selected="true"` | リストボックスで選択中の項目を示す |
| チェック状態 | `aria-checked="true"` | メニュー内のチェック可能な項目の状態を示す |

```html
<!-- ナビゲーションで現在のページを示す場合 -->
<a class="dads-menu-list__item" href="/current-page" data-type="standard" data-size="regular" data-current aria-current="page">
  <span class="dads-menu-list__label">現在のページ</span>
</a>
```

### 子メニューのインデント

子メニューにはCSSカスタムプロパティ`--menu-list-indentation`でインデントレベルを設定します。

```html
<ul class="dads-menu-list" style="--menu-list-indentation: 1;">
  <!-- 子メニュー項目 -->
</ul>
```

- `data-type="standard"`: 項目全体が左にインデントされる
- `data-type="box"`: `padding-left`が増加してインデントされる

複数の項目・展開状態を含むより詳しい例は下記を参照してください。

[HasChildren](./menu-list.stories.ts?controls#HasChildren)

### 展開状態の表示

子メニューを持つ項目が展開されている場合、`data-expanded`属性を追加します。これにより`dads-menu-list__end-icon`が180度回転します。

```html
<button class="dads-menu-list__item" type="button" data-type="standard" data-size="regular" data-expanded>
  <span class="dads-menu-list__label">展開中のメニュー</span>
  <svg class="dads-menu-list__end-icon" ...>...</svg>
</button>
```

#### アクセシビリティ属性の併用

`data-expanded`属性は視覚的なスタイルのみを制御し、スクリーンリーダーには展開状態が伝わりません。動的に開閉する場合は、`aria-expanded`属性を併用してスクリーンリーダーに展開状態を伝えてください。

```html
<!-- 展開時 -->
<button class="dads-menu-list__item" type="button" data-type="standard" data-size="regular" data-expanded aria-expanded="true">
  <span class="dads-menu-list__label">メニュー項目</span>
  <svg class="dads-menu-list__end-icon" ...>...</svg>
</button>

<!-- 折りたたみ時 -->
<button class="dads-menu-list__item" type="button" data-type="standard" data-size="regular" aria-expanded="false">
  <span class="dads-menu-list__label">メニュー項目</span>
  <svg class="dads-menu-list__end-icon" ...>...</svg>
</button>
```
