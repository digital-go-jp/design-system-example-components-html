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
            "カレンダー",
            "緊急時バナー",
            "ステップナビゲーション",
            "説明リスト",
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
            "見出し",
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
