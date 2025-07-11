import type { Preview } from "@storybook/html-vite";

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
    options: {
      storySort: {
        order: [
          "Documents",
          ["はじめに", "導入方法", "HTML版の開発方針"],
          "Components",
          [
            "アコーディオン",
            "インプットテキスト",
            "カレンダー",
            "緊急時バナー",
            "セレクトボックス",
            "チェックボックス",
            "ディスクロージャー",
            "ディバイダー",
            "テーブル／データテーブル",
            "テキストエリア",
            "ドロワー",
            "ノティフィケーションバナー",
            "パンくずリスト",
            "ハンバーガーメニューボタン",
            "日付ピッカー",
            "フォームコントロールラベル",
            "ボタン",
            "マークアップ",
            "メニューリスト",
            "メニューリストボックス",
            "ユーティリティーリンク",
            "ラジオボタン",
            "ランゲージセレクター",
            "リスト",
            "リンク",
            "*",
          ],
        ],
      },
    },
  },
};

export default preview;
