## Playground

[Playground](./step-navigation.stories.ts?controls#Playground)

## コンポーネントのガイドライン

[ステップナビゲーション（概要）｜デジタル庁デザインシステムβ版](https://design.digital.go.jp/dads/components/step-navigation/)

## ソースコード

<details>
<summary>HTML</summary>

#### 基本形

[playground.html](./playground.html#.dads-step-navigation)

#### リンク付き（ナビゲーションとして使用）

[as-navigation.html](./as-navigation.html#.dads-step-navigation)

</details>

<details>
<summary>step-navigation.css</summary>

[step-navigation.css](./step-navigation.css)

</details>

## 仕様

### バリエーション

| 属性 | 値 | 説明 |
| --- | --- | --- |
| `data-orientation` | `horizontal`, `vertical` | ステップナビゲーションの向き |
| `data-size` | `normal`, `small` | ステップナビゲーションのサイズ |

### ステップの位置属性

| 属性 | 説明 |
| --- | --- |
| `data-first` | 最初のステップであることを示す（上部/左部の接続線を非表示にする） |
| `data-last` | 最後のステップであることを示す（下部/右部の接続線を非表示にする） |

## 使い方

### 現在のステップを示す

現在のステップには`aria-current="true"`属性を設定します。

```html
<li class="dads-step-navigation__step" data-state="reached" aria-current="true">
  ...
</li>
```

### ステップの状態を変更する

ステップ（`.dads-step-navigation__step`）の状態に応じた各HTMLは次の通りです。

#### デフォルト状態（未到達）

`data-state`属性を設定しない状態です。

[step-default.html](./step-default.html#.dads-step-navigation__step)

#### 到達済み

`data-state="reached"`を設定します。

[step-reached.html](./step-reached.html#.dads-step-navigation__step)

#### 完了済み

`data-state="completed"`を設定し、アイコンを表示します。

[step-completed.html](./step-completed.html#.dads-step-navigation__step)

#### 編集中

`data-state="editing"`を設定し、アイコンを表示します。

[step-editing.html](./step-editing.html#.dads-step-navigation__step)

#### エラー

`data-state="error"`を設定し、アイコンを表示します。

[step-error.html](./step-error.html#.dads-step-navigation__step)

#### スキップ

`data-state="skipped"`を設定します。

[step-skipped.html](./step-skipped.html#.dads-step-navigation__step)

### ステップをリンクまたはボタンにする

過去のステップに戻れるようにする場合、ヘッダー要素を`<a>`または`<button>`に変更します。

#### リンクとして使用する場合

ルート要素を`<nav>`に変更し、`aria-label`を設定します。

[as-navigation.html](./as-navigation.html#.dads-step-navigation)

#### ボタンとして使用する場合

```html
<div class="dads-step-navigation" ...>
  <ul>
    <li class="dads-step-navigation__step" data-state="completed">
      <button class="dads-step-navigation__header" type="button">
        ...
      </button>
    </li>
  </ul>
</div>
```

### 番号のみで使用する

タイトルと説明を省略し、番号のみのステップナビゲーションにできます。

[number-only.html](./number-only.html#.dads-step-navigation)

### ステップ幅をカスタマイズする（水平方向のみ）

水平方向のステップナビゲーションでは、CSSカスタムプロパティでステップの幅を調整できます。

```html
<div class="dads-step-navigation" data-orientation="horizontal" data-size="normal" style="--_step-width: 200; --_step-min-width: 120;">
  ...
</div>
```

| プロパティ | デフォルト値 | 説明 |
| --- | --- | --- |
| `--_step-width` | `320` | ステップの幅（px単位の数値、単位なし） |
| `--_step-min-width` | `160` | ステップの最小幅（px単位の数値、単位なし） |

### アクセシビリティ

#### スクリーンリーダーが情報を得やすくする

全体の進捗状況をスクリーンリーダーに伝えるため、コンポーネント冒頭にある非表示テキストに、進捗状況の概要を記述してください。

```html
<p class="dads-u-visually-hidden">全3ステップ中、2ステップ目まで到達済み</p>
```
