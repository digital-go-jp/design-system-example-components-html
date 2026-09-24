[Playground](./link.stories.ts?controls#Playground)

## ソースコード

<details>
<summary>HTML</summary>

[playground.html](./playground.html#.dads-link)

</details>

<details>
<summary>link.css</summary>

[link.css](./link.css)

</details>

## 使い方

### テキストのスタイル

このコンポーネントは、フォントの種類・サイズ・行の高さを指定していません。テキストには配置先から継承したスタイルが適用されます。必要に応じて、配置先でこれらのスタイルを指定してください。

### 新規タブで開く場合

`target="_blank"`を指定したリンクには、新規タブで開くことを示すアイコンを追加してください。アイコンには`role="img"`と`aria-label`で代替テキストを提供し、支援技術のユーザーにもリンクの動作が伝わるようにします。

[new-tab.html](./new-tab.html#.dads-link)
