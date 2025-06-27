import type { Meta, StoryObj } from "@storybook/html-vite";
import { HtmlFragment } from "../../helpers/html-fragment";

import "../checkbox/checkbox.css";
import "../link/link.css";
import "../list/list.css";
import "./scroll-shadow";
import "./table.css";

import playground from "./playground.html?raw";
import plain from "./plain.html?raw";
import firstRowAsHeaderCell from "./first-row-as-header-cell.html?raw";
import firstColumnAsHeaderCell from "./first-column-as-header-cell.html?raw";
import firstRowAndColumnAsHeaderCell from "./first-row-and-column-as-header-cell.html?raw";
import condensedTable from "./condensed-table.html?raw";
import borderOnRowAndColumn from "./border-on-row-and-column.html?raw";
import tableHeaderWithColspan from "./table-header-with-colspan.html?raw";
import tableHeaderWithRowspan from "./table-header-with-rowspan.html?raw";
import indentedRows from "./indented-rows.html?raw";
import stripeTable from "./stripe-table.html?raw";
import highlightHoveredRow from "./highlight-hovered-row.html?raw";
import selectableTable from "./selectable-table.html?raw";
import sortableHeader from "./sortable-header.html?raw";
import sortableHeaderDense from "./sortable-header-dense.html?raw";
import linkedTextInCell from "./linked-text-in-cell.html?raw";
import withCaption from "./with-caption.html?raw";
import overflowOnMobile from "./overflow-on-mobile.html?raw";

interface TablePlaygroundProps {
  tableBorder: boolean;
  tableBorderValue: string[];
  tableCellBorder: boolean;
  tableCellBorderValue: string[];
  theadCellBorder: boolean;
  theadCellBorderValue: string[];
  tbodyCellBorder: boolean;
  tbodyCellBorderValue: string[];
  tdBorder: boolean;
  tdBorderValue: string[];
  dense: boolean;
  fullWidth: boolean;
  fixedWidth: boolean;
  rowStripe: boolean;
  hoverHighlight: boolean;
}

const meta = {
  title: "Components/テーブル／データテーブル",
} satisfies Meta<TablePlaygroundProps>;

export default meta;

export const Playground: StoryObj<TablePlaygroundProps> = {
  render(args) {
    const fragment = new HtmlFragment(playground, ".dads-table");
    const table = fragment.root.querySelector("table");
    const thead = fragment.root.querySelector("thead");
    const tbody = fragment.root.querySelector("tbody");
    const td = fragment.root.querySelector(
      "tbody > tr:nth-child(2) > td:nth-child(2)",
    );

    if (!table) throw new Error();
    if (!thead) throw new Error();
    if (!tbody) throw new Error();
    if (!td) throw new Error();

    if (args.dense) {
      fragment.root.setAttribute("data-size", "dense");
    }
    if (args.fullWidth) {
      table.setAttribute("data-width", "full");
    }
    if (args.fixedWidth) {
      table.setAttribute("data-layout", "fixed");
    }
    if (args.rowStripe) {
      fragment.root.setAttribute("data-row-stripe", "");
    }
    if (args.hoverHighlight) {
      fragment.root.setAttribute("data-row-hover-highlight", "");
    }

    if (args.tableBorder) {
      table.setAttribute("data-border", args.tableBorderValue.join(" "));
    }
    if (args.tableCellBorder) {
      table.setAttribute(
        "data-cell-border",
        args.tableCellBorderValue.join(" "),
      );
    }
    if (args.theadCellBorder) {
      thead.setAttribute(
        "data-cell-border",
        args.theadCellBorderValue.join(" "),
      );
    }
    if (args.tbodyCellBorder) {
      tbody.setAttribute(
        "data-cell-border",
        args.tbodyCellBorderValue.join(" "),
      );
    }
    if (args.tdBorder) {
      td.setAttribute("data-border", args.tdBorderValue.join(" "));
    }
    td.textContent = "長いテキスト長いテキスト長いテキスト";

    return fragment.toString();
  },
  argTypes: {
    tableBorder: {
      name: "table[data-border]",
      description: "`<table>`にボーダーを表示する",
      control: "boolean",
      table: { category: "ボーダー" },
    },
    tableBorderValue: {
      name: 'table[data-border="?"]',
      description:
        "`<table>`にボーダーを表示する。`hidden`を指定すると、以降の指定にかかわらず`<table>`のボーダーを非表示にする",
      if: { arg: "tableBorder" },
      control: "inline-check",
      options: ["hidden"],
      table: { category: "ボーダー" },
    },
    tableCellBorder: {
      name: "table[data-cell-border]",
      description: "全ての`<td>`および`<th>`にボーダーを表示する",
      control: "boolean",
      table: { category: "ボーダー" },
    },
    tableCellBorderValue: {
      name: 'table[data-cell-border="?"]',
      description: "全ての`<td>`および`<th>`のボーダーを指定する",
      if: { arg: "tableCellBorder" },
      control: "inline-check",
      options: ["top", "bottom", "left", "right"],
      table: { category: "ボーダー" },
    },
    theadCellBorder: {
      name: "thead[data-cell-border]",
      description: "`<thead>`以下の`<td>`および`<th>`にボーダーを表示する",
      control: "boolean",
      table: { category: "ボーダー" },
    },
    theadCellBorderValue: {
      name: 'thead[data-cell-border="?"]',
      description: "`<thead>`以下の`<td>`および`<th>`のボーダーを指定する",
      if: { arg: "theadCellBorder" },
      control: "inline-check",
      options: ["top", "bottom", "left", "right"],
      table: { category: "ボーダー" },
    },
    tbodyCellBorder: {
      name: "tbody[data-cell-border]",
      description: "`<tbody>`以下の`<td>`および`<th>`にボーダーを表示する",
      control: "boolean",
      table: { category: "ボーダー" },
    },
    tbodyCellBorderValue: {
      name: 'tbody[data-cell-border="?"]',
      description: "`<tbody>`以下の`<td>`および`<th>`のボーダーを指定する",
      if: { arg: "tbodyCellBorder" },
      control: "inline-check",
      options: ["top", "bottom", "left", "right"],
      table: { category: "ボーダー" },
    },
    tdBorder: {
      name: "td[data-border]",
      description: "任意のセルにボーダーを表示する",
      control: "boolean",
      table: { category: "ボーダー" },
    },
    tdBorderValue: {
      name: 'td[data-border="?"]',
      description:
        "任意のセルのボーダーを指定する。`hidden`または`*-hidden`を指定すると、以上の指定にかかわらず任意のセルのボーダーを非表示にする",
      if: { arg: "tdBorder" },
      control: "inline-check",
      options: [
        "top",
        "bottom",
        "left",
        "right",
        "hidden",
        "top-hidden",
        "bottom-hidden",
        "left-hidden",
        "right-hidden",
      ],
      table: { category: "ボーダー" },
    },
    dense: {
      description: "テーブルの行の高さを小さくし、データテーブルの表示にする",
      control: "boolean",
      table: { category: "その他" },
    },
    fullWidth: {
      description: "テーブルの幅をコンテナ幅まで広げる",
      control: "boolean",
      table: { category: "その他" },
    },
    fixedWidth: {
      description:
        "テーブルレイアウトを固定（`table-layout: fixed`）に設定する",
      if: { arg: "fullWidth" },
      control: "boolean",
      table: { category: "その他" },
    },
    rowStripe: {
      description: "偶数行に背景色を付けてストライプ表示にする",
      control: "boolean",
      table: { category: "その他" },
    },
    hoverHighlight: {
      description: "行にホバーした際のハイライト表示を有効にする",
      control: "boolean",
      table: { category: "その他" },
    },
  },
  args: {
    tableBorder: true,
    tableBorderValue: ["hidden"],
    tableCellBorder: true,
    tableCellBorderValue: [],
    theadCellBorder: false,
    theadCellBorderValue: [],
    tbodyCellBorder: false,
    tbodyCellBorderValue: [],
    tdBorder: false,
    tdBorderValue: [],
    dense: false,
    fullWidth: false,
    fixedWidth: false,
    rowStripe: false,
    hoverHighlight: false,
  },
};

export const Plain = () => new HtmlFragment(plain, ".dads-table").toString();

export const FirstRowAsHeaderCell = () =>
  new HtmlFragment(firstRowAsHeaderCell, ".dads-table").toString();

export const FirstColumnAsHeaderCell = () =>
  new HtmlFragment(firstColumnAsHeaderCell, ".dads-table").toString();

export const FirstRowAndColumnAsHeaderCell = () =>
  new HtmlFragment(firstRowAndColumnAsHeaderCell, ".dads-table").toString();

export const CondensedTable = () =>
  new HtmlFragment(condensedTable, ".dads-table").toString();

export const BorderOnRowAndColumn = () =>
  new HtmlFragment(borderOnRowAndColumn, ".dads-table").toString();

export const TableHeaderWithColspan = () =>
  new HtmlFragment(tableHeaderWithColspan, ".dads-table").toString();

export const TableHeaderWithRowspan = () =>
  new HtmlFragment(tableHeaderWithRowspan, ".dads-table").toString();

export const IndentedRows = () =>
  new HtmlFragment(indentedRows, ".dads-table").toString();

export const StripeTable = () =>
  new HtmlFragment(stripeTable, ".dads-table").toString();

export const HighlightHoveredRow = () =>
  new HtmlFragment(highlightHoveredRow, ".dads-table").toString();

export const SelectableTable = () =>
  new HtmlFragment(selectableTable, "body > *").toString();

export const SortableHeader = () =>
  new HtmlFragment(sortableHeader, "body > *").toString();

export const SortableHeaderDense = () =>
  new HtmlFragment(sortableHeaderDense, "body > *").toString();

export const LinkedTextInCell = () =>
  new HtmlFragment(linkedTextInCell, ".dads-table").toString();

export const WithCaption = () =>
  new HtmlFragment(withCaption, ".dads-table").toString();

export const OverflowOnMobile = () =>
  new HtmlFragment(overflowOnMobile, "dads-scroll-shadow").toString();
