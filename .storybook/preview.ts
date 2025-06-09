import type { Preview } from "@storybook/html";

import "invokers-polyfill";
import "../src/global.css";

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
