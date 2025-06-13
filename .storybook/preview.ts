import type { Preview } from "@storybook/html-vite";

import "invokers-polyfill";
import "../src/global.css";
import "../src/components/markup/markup.css";
import "./markup-adjust.css";

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
            "ボタン",
            "マークアップ",
            "ユーティリティリンク",
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
