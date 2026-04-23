import type { Preview } from "@storybook/html-vite";

import dadsTheme from "./dadsTheme";
import "invokers-polyfill";
import "../src/global.css";
import "./prose.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      theme: dadsTheme,
      codePanel: true,
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
    options: {
      storySort: {
        order: [
          "Documents",
          ["はじめに", "導入方法", "HTML版の開発方針"],
          "Foundations",
          ["カラー", "タイポグラフィ", "エレベーション"],
          "Components",
          [
            "アコーディオン",
            "インプットテキスト",
            "引用ブロック",
            "カード",
            "箇条書きリスト",
            "画像",
            "カルーセル",
            "カレンダー",
            "緊急時バナー",
            "グローバルメニュー",
            "検索ボックス",
            "ステップナビゲーション",
            "説明リスト",
            "セレクトボックス",
            "タブ",
            "チェックボックス",
            "チップラベル",
            "ディスクロージャー",
            "ディバイダー",
            "テーブル／データテーブル",
            "テキストエリア",
            "ドロワー",
            "ノティフィケーションバナー",
            "パンくずリスト",
            "ハンバーガーメニューボタン",
            "日付ピッカー",
            "ファイルアップロード／ドロップエリア",
            "フォームコントロールラベル",
            "プログレスインジケーター",
            "ページナビゲーション",
            "ボタン",
            "見出し",
            "メニューリスト",
            "メニューリストボックス",
            "ユーティリティーリンク",
            "ラジオボタン",
            "ランゲージセレクター",
            "リソースリスト",
            "リンク",
            "*",
          ],
        ],
      },
    },
  },
};

export default preview;
