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
            "カード",
            "カルーセル",
            "カレンダー",
            "緊急時バナー",
            "グローバルメニュー",
            "検索ボックス",
            "ステップナビゲーション",
            "説明リスト",
            "セレクトボックス",
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
            "ボタン",
            "見出し",
            "メニューリスト",
            "メニューリストボックス",
            "ユーティリティーリンク",
            "ラジオボタン",
            "ランゲージセレクター",
            "リスト",
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
