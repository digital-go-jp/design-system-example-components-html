[Playground](./horizontal-menu.stories.ts?controls#Playground)

## コンポーネントのガイドライン

[水平メニュー（概要）｜デジタル庁デザインシステムβ版](https://design.digital.go.jp/dads/components/horizontal-menu/)

## ソースコード

<details>
<summary>HTML</summary>

#### リンクのみ

[links-only.html](./links-only.html#.dads-horizontal-menu)

#### サブメニューを開くボタン

[submenu-button.html](./submenu-button.html#.dads-horizontal-menu)

</details>

<details>
<summary>horizontal-menu.css</summary>

[horizontal-menu.css](./horizontal-menu.css)

</details>

## 仕様

### 機能仕様

- **リンク項目**: `<a>`要素を使用し、`href`属性で遷移先を指定します
- **サブメニュー付き項目**: `<button>`要素を使用し、`aria-expanded`属性でサブメニューの開閉状態を示します
- **現在地表示**: `aria-current`属性を設定すると、現在のページであることを視覚的に示します

## 使い方

### アイコンを追加する

メニュー項目の先頭にアイコンを追加できます。

```html
<a class="dads-horizontal-menu__item-inner" href="#">
  <svg class="dads-horizontal-menu__front-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentcolor" aria-hidden="true">
    <!-- アイコンのパス -->
  </svg>
  <span class="dads-horizontal-menu__label">メニュー1</span>
</a>
```

### 現在のページを示す

現在表示中のページに対応するメニュー項目には`aria-current`属性を設定します。

```html
<a class="dads-horizontal-menu__item-inner" href="#" aria-current="true">メニュー1</a>
```
