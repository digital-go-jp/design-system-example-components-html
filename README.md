# デジタル庁デザインシステム コードスニペット（HTML版）

[デジタル庁デザインシステム](https://design.digital.go.jp/)をプレーンなHTML/CSS/JavaScriptで実装したサンプル集です。

[Storybook](https://design.digital.go.jp/dads/html/)で最新版を公開しています。各コンポーネントの動作やスタイル、使用方法や実装上の注意点等をご確認いただけます。

## 特長

- アクセシビリティファースト
- フレームワーク非依存
- カスタマイズ可能
- 後付け可能
- シンプルな実装
- デジタル庁デザインシステムチームによる優先サポート

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
├── components/         # 各コンポーネント
│   ├── button/
│   ├── input-text/
│   └── ...
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

本コードスニペットに関する不具合や機能要望は、Issueを作成して報告してください。Pull Requestは現時点では受け付けておりません。

## 求人情報

デジタル庁デザインシステムのチームメンバーを募集しています。行政のデジタル環境を支える基盤づくりに、あなたのスキルや経験を活かしてみませんか？　求人ページからご応募ください。

- [プロダクトデザイナー](https://herp.careers/v1/digitalsaiyo/IjQ4ovK9BFPl)
- [プロダクトデザイナー（アソシエイト）](https://herp.careers/v1/digitalsaiyo/yzcCCZJ9UY-f)
