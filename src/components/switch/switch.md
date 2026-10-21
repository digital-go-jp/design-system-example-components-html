### オン／オフスイッチ

[Playground (On/Off)](./switch.stories.ts?controls#PlaygroundOnOff)

### モードスイッチ

[Playground (Mode)](./switch.stories.ts?controls#PlaygroundMode)

## コンポーネントのガイドライン

[スイッチ（概要）｜デジタル庁デザインシステムβ版](https://design.digital.go.jp/dads/components/switch/)

## ソースコード

### オン／オフスイッチ

<details>
<summary>HTML</summary>

[playground-on-off.html](./playground-on-off.html#.dads-switch-on-off)

</details>

<details>
<summary>switch-on-off.css</summary>

[switch-on-off.css](./switch-on-off.css)

</details>

<details>
<summary>switch-on-off.js</summary>

[switch-on-off.js](./switch-on-off.js)

</details>

### モードスイッチ

<details>
<summary>HTML</summary>

[playground-mode.html](./playground-mode.html#.dads-switch-mode)

</details>

<details>
<summary>switch-mode.css</summary>

[switch-mode.css](./switch-mode.css)

</details>

<details>
<summary>switch-mode.js</summary>

[switch-mode.js](./switch-mode.js)

</details>

### 依存ファイル

<details>
<summary>form-control-label.css</summary>

[form-control-label.css](../form-control-label/form-control-label.css)

</details>

## 仕様

スイッチには用途が異なる2タイプがあります。

| タイプ | 説明 | 内部要素 |
| --- | --- | --- |
| オン／オフ（`dads-switch-on-off`） | オン・オフの2値を切り替える | `<button role="switch">` |
| モード（`dads-switch-mode`） | 2つの選択肢を左右のラベル付きで切り替える | `<button role="switch">` × 2 |

### 機能仕様

`<dads-switch-on-off>`・`<dads-switch-mode>` カスタム要素は以下の操作をサポートします：

- **クリック**: `role="switch"` の `<button>` をクリックすると状態が切り替わります。ネイティブの `<button>` 要素であるため、フォーカスした状態でのスペースキー・エンターキーによる操作も同様に機能します。
- **モードスイッチでは、どちらの選択肢をクリックしても状態がトグルします**（2択のため、選択中の側をクリックした場合も反対側に切り替わります）。

切り替え時は、クリックされた `<button>` から `change` イベントおよび `input` イベントが発火します（`bubbles: true`）。

## 使い方

### インストール

#### 必要なファイル

- **オン／オフスイッチ**
  - `switch-on-off.css`
  - `switch-on-off.js`
- **モードスイッチ**
  - `switch-mode.css`
  - `switch-mode.js`

スクリプトは必ず `<script type="module">` を使用して ES Module として読み込んでください。

```html
<script type="module" src="switch-on-off.js"></script>
<script type="module" src="switch-mode.js"></script>
```

### ラベルの関連付け

[フォームコントロールラベル](?path=/docs/components-フォームコントロールラベル--docs)と組み合わせてラベル、サポートテキスト、必須表示を追加できます。

#### オン／オフスイッチ

**必ずラベルを指定してください**。ラベルをコントロールに関連付けるために `<label for="...">` と `id` を使用します。`<button>` はラベル付け可能な要素のため、`<label for="...">` で関連付けできます。

[with-form-control-label-on-off.html](./with-form-control-label-on-off.html#.dads-form-control-label)

または、`<label>` 要素でオン／オフスイッチとラベルテキストを直接囲む方法も使用できます。

```html
<label>
  <dads-switch-on-off class="dads-switch-on-off">
    <button class="dads-switch-on-off__button" type="button" role="switch" aria-checked="false" data-js-toggle>
      <span class="dads-switch-on-off__track" aria-hidden="true">
        <span class="dads-switch-on-off__thumb">
          <svg class="dads-switch-on-off__icon" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
            <path d="m10.4 16.3-4.1-4.1 1.2-1.3 2.9 2.9 6-6.1 1.3 1.2z" fill="currentcolor"/>
          </svg>
        </span>
      </span>
    </button>
  </dads-switch-on-off>
  ラベル
</label>
```

#### モードスイッチ

モードスイッチは、各選択肢のラベルが設定済みのため、追加のラベル設定は必要ではありません。フォームコントロールラベルを使用する場合、`<fieldset>` と `<legend>` を使用し、各スイッチは `aria-describedby` でサポートテキストと関連付けます。

[with-form-control-label-mode.html](./with-form-control-label-mode.html#.dads-form-control-label)

### disabled 状態

disabled 状態は非推奨です。

やむを得ず disabled 状態にする場合、オン／オフスイッチ、モードスイッチともに、`role="switch"` の `<button>` に `disabled` 属性を付与することで無効状態になります。

モードスイッチを disabled 状態にする場合は、常に両方の `<button>` に `disabled` を付与してください。片方のみに付与すると、見た目は無効化されていてもその選択肢への切り替えができてしまいます。

```html
<!-- オン／オフスイッチ -->
<button class="dads-switch-on-off__button" type="button" role="switch" aria-checked="false" disabled data-js-toggle>...</button>

<!-- モードスイッチ（両方の button に付与） -->
<button class="dads-switch-mode__option" type="button" role="switch" aria-checked="true" disabled data-js-option>...</button>
<button class="dads-switch-mode__option" type="button" role="switch" aria-checked="false" disabled data-js-option>...</button>
```
