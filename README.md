# デジタル庁デザインシステム コードスニペット（HTML版）

[デジタル庁デザインシステム](https://design.digital.go.jp/)のコンポーネントの一部をプレーンなHTML、CSS、JavaScriptで実装したサンプル集です。

[Storybook](https://digital-go-jp.github.io/design-system-example-components-html/)で最新版を公開しています。各コンポーネントの動作やスタイル、使用方法や実装上の注意点等をご確認いただけます。

## 特徴

- **アクセシビリティファースト**  
  WCAG等のアクセシビリティガイドラインを最大限に取り込んだデジタル庁デザインシステムのガイドラインを基に作られており、アクセシビリティの専門家によるチェックも受けています。
- **フレームワーク非依存**  
  ReactやVue.jsなど、特定のフレームワークに依存せず、どんな技術スタックでも利用可能です。
- **カスタマイズ可能**  
  HTML、CSS、JavaScriptすべてのコードが改変可能で、プロジェクトのニーズに合わせて調整できます。
- **後付け可能**  
  リセットCSSの有無を問わず動作し、既存のウェブサイトに後から組み込むことができます。
- **シンプルな実装**  
  複雑な抽象化や高度なCSS機能を避け、シンプルで理解しやすいコードで構成されています。

## クイックスタート

### 1. リポジトリのクローン

任意の方法でリポジトリをクローンしてください。

<https://github.com/digital-go-jp/design-system-example-components-html>

### 2. 依存関係のインストール

```bash
npm install
```

### 3. Storybookでコンポーネントを確認

```bash
npm run storybook
```

ブラウザで `http://localhost:6006` にアクセスすると、すべてのコンポーネントを確認できます。

## プロジェクト構成

```
src/
├── components/         # UIコンポーネント
│   ├── button/         # ボタンコンポーネント
│   ├── input-text/     # 入力フィールドコンポーネント
│   └── ...             # その他のコンポーネント
├── docs/               # ドキュメント
├── helpers/            # ユーティリティ関数
└── global.css          # グローバルスタイル
```

各コンポーネントフォルダには以下のファイルが含まれています：

- `*.css` - スタイルシート
- `*.html` - HTMLサンプル
- `*.js` - JavaScript（必要な場合）
- `*.stories.ts` - Storybookストーリー
- `*.mdx` - ドキュメント

## スクリプト

```bash
# Storybookを起動（開発用）
npm run storybook

# Storybookをビルド
npm run build-storybook

# テストを実行
npm test

# コードフォーマット
npm run format
```

## ライセンス

このプロジェクトのライセンスについては、デジタル庁の利用規約に従います。

## 不具合報告・機能要望について

HTML版コードスニペットに関する不具合や機能要望は、Issueを作成して報告してください。Pull Requestは現時点では受け付けておりません。

## 求人情報

デジタル庁デザインシステムのチームメンバーを募集しています。行政のデジタル環境を支える基盤づくりに、あなたのスキルや経験を活かしてみませんか？　求人ページからご応募ください。

- [プロダクトデザイナー](https://herp.careers/v1/digitalsaiyo/IjQ4ovK9BFPl)
- [プロダクトデザイナー（アソシエイト）](https://herp.careers/v1/digitalsaiyo/yzcCCZJ9UY-f)
