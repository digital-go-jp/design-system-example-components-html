import type { Meta, StoryObj } from "@storybook/html-vite";
import { HtmlFragment } from "../../helpers/html-fragment";

import "../checkbox/checkbox.css";
import "../link/link.css";
import "../list/list.css";
import "./scroll-shadow";
import "./table.css";

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

const meta = {
  title: "Components/テーブル／データテーブル",
} satisfies Meta;

export default meta;

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
