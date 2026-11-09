# コンポーネントマニフェスト

`component-manifest.json` は、コードスニペット（HTML版）のコンポーネント、Markdown、HTMLサンプル、アセット、Storybookを機械可読な形で公開するカタログです。AIエージェントによる利用、コンポーネントのファイル取得、DADSウェブサイトからのStorybookリンク生成を想定しています。

## 公開先とパス

- リポジトリルートの [`component-manifest.json`](../component-manifest.json)
- Storybookと同じビルドで公開される <https://design.digital.go.jp/dads/html/component-manifest.json>
- 公開JSON Schema: <https://design.digital.go.jp/dads/html/component-manifest.schema.json>

JSON内のファイルパスはリポジトリルート相対で記述されています。

## 値の意味

代表的な値の意味は下記のとおりです。型や必須項目は[JSON Schema](../component-manifest.schema.json)を参照してください。

| フィールド                      | 用途・意味                                            |
| ------------------------------- | ----------------------------------------------------- |
| `shared`                        | 全コンポーネントに共通のCSS・JS・アセット             |
| `github.baseUrl`                | 公開GitHubリポジトリのディレクトリ基底URL（末尾 `/`） |
| `storybook.baseUrl`             | 公開Storybookの基底URL（末尾 `/`）                    |
| `components.<id>.sourceDir`     | リポジトリルート相対のコンポーネントディレクトリ      |
| `components.<id>.files`         | コンポーネントに付属するCSS・JS・アセット             |
| `components.<id>.dependencies`  | 動作に必須の直接依存コンポーネントID                  |
| `components.<id>.examples`      | HTMLサンプルの一覧                                    |
| `components.<id>.documentation` | ドキュメントとその参照先                              |
| `components.<id>.storybook`     | Docs・ストーリーと代表エントリーのID・遷移先          |

`components.<id>.storybook` の `defaultEntryId` は代表エントリーの識別子、`defaultEntryPath` は遷移先です。後者はURLのパス部分ではなく、Storybookの `?path=` に渡す未URLエンコードの値です。

`examples.<id>` は次の値を持ちます。

- `html`: 元HTMLのパス
- `dependencies`: サンプルで追加利用するコンポーネントID
- `additionalFiles`: 本体および依存コンポーネントに含まれない追加CSS・JS・アセット
- `externalResources`: 外部CSS・JSの読み込み情報。`css` / `js` の配列を持ち、対象がなければ空配列

`externalResources.css` の各要素は `href`（外部URL）、`externalResources.js` の各要素は `src`（外部URL）を持ちます。

`documentation` は次の値を持ちます。

- `markdown`: 最初に読む
- `assets`: 説明用画像など
- `references`: サンプルやStorybookへの参照
  - `type: "example"`: `exampleId` でサンプルを指定。`selector` はHTMLの抽出範囲を示すCSSセレクター
  - `type: "story"`: `entryId` でストーリーを指定。`parameters` は表示用のクエリパラメーター
  - `type: "storybook"`: `entryId` でDocsまたはストーリーを指定。`fragment` は見出しへのリンク

## GitHub・Storybookリンクの生成例

```js
const component = manifest.components.accordion;

const githubUrl = new URL(component.sourceDir, manifest.github.baseUrl);

const storybookUrl = new URL(manifest.storybook.baseUrl);
storybookUrl.searchParams.set("path", component.storybook.defaultEntryPath);
```

`defaultEntryPath` の生成例:

- Docs: `/docs/components-アコーディオン--docs`
- ストーリー（`defaultStory: "Playground"`）: `/story/components-アコーディオン--playground`

## コンポーネントの取得

1. 共通の `shared` を取得します。
2. 本体の `dependencies` を再帰的に解決し、本体と依存先の `files` を取得します。
3. サンプルを使う場合は、`examples` の `html`、`dependencies` を再帰解決したファイル、`additionalFiles` も取得します。
4. HTMLの一部を抽出して使う場合は、`externalResources` の外部CSS・JSの読み込みも組み込んでください。

依存IDとファイルは重複を除き、依存の再帰解決では訪問済みのIDを管理してください。

## コンポーネントのドキュメントを取得する

1. `documentation.markdown` と `documentation.assets` の説明用画像などを取得します。
2. `documentation.references` をたどり、参照先のHTMLやStorybookでサンプルを確認します。HTMLは `exampleId` に対応する `examples.<id>.html` から取得します。

---

## 開発者向け

### メタデータの更新

各コンポーネントのメタデータは `src/components/<id>/component.json` で管理します。

- `files.css` / `files.js` はコンポーネント内のファイル名、`files.assets` はコンポーネントディレクトリ相対で指定します。付属実装をすべて列挙します。`*.stories.css` / `*.stories.js` は含めません。
- `dependencies` は動作に必須の直接依存だけを指定します。サンプルで併用するだけのコンポーネントは含めません。
- `defaultStory` は代表リンク先のストーリーexport名です。省略時はDocsになります。

共通ファイルとGitHub・Storybook基底URLは[生成スクリプト](../scripts/manifest/generate.mjs)で定義します。

### 自動抽出と記述上の制約

- サンプル依存は、HTMLが直接読み込むCSS・JSを `component.json` の `files` に照合して判定します。ディレクトリ名では判定しません。
- サンプルの追加ファイルは、HTMLの直接参照から、共通ファイルおよび本体・必須依存・サンプル依存の提供ファイルを除いたものです。
- 外部リソースは、HTMLの `<link rel="stylesheet">` / `<script src="…">` が直接参照するHTTP(S) URL（`//` 始まりを含む）から抽出します。Google FontsのCSS（ホスト名が `fonts.googleapis.com`）と `preconnect` は対象外です。各配列は出現順を保持し、URLと保持属性がすべて同じ参照は重複を除きます。
- CSSの `@import`・`url()`、JSのimport・動的URL、インラインCSS・JSは抽出しません。必要な実装ファイルや必須依存は `files`、`dependencies` に明示し、サンプル固有のファイルはHTMLから直接参照してください。
- Markdownの説明用アセットは、文書冒頭の一行の静的importで指定します（例: `import screenshot from "./docs/screenshot.webp";`）。本文開始後のimportや `<img>`・JSX内の参照は抽出しません。
- 文書の参照は `[ラベル](参照先)` で記述します。HTMLの `#` 以降は抽出用CSSセレクターです。参照形式リンク・複雑な入れ子・複数行importを導入する場合は生成処理も変更してください。
- StorybookのIDは同じビルドの `index.json` から取得します。タイトルやexportを変更したら再ビルドし、外部リンクへの影響も確認してください。
- `defaultEntryId` と `defaultEntryPath` は同じ代表エントリーから生成します。パスのプレフィックスはindexの `type` で決まり、エントリーの欠落・不明な種別・IDの不整合は生成エラーになります。

### コマンドとCI

```bash
# Storybookをビルドし、ルートのJSONと公開用JSON・Schemaを生成
npm run build-storybook

# ビルド済みのstorybook-static/index.jsonから再生成
npm run manifest:generate

# 生成ロジックのテスト
npm run test:manifest
```

オプションは `npm run manifest:generate -- <options>` で指定します。

| オプション              | 用途                                                           |
| ----------------------- | -------------------------------------------------------------- |
| `--index <path>`        | Storybook indexの入力先（既定: `storybook-static/index.json`） |
| `--output <path>`       | JSONの出力先（既定: `component-manifest.json`）                |
| `--publish <directory>` | 公開用JSONとSchemaの配置先                                     |

CIでテスト・ビルド・検証を実行します。PRでは生成JSONの更新は必須ではなく、developへのpush時に差分があればbotが更新します。
