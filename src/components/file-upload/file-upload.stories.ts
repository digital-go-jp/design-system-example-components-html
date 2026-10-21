import type { Meta, StoryObj } from "@storybook/html-vite";
import type { HTMLElement } from "node-html-parser";
import { HtmlFragment } from "../../helpers/html-fragment";

import "./file-upload";
import "../button/button.css";
import "../checkbox/checkbox.css";
import "./file-upload.css";
import "../form-control-label/form-control-label.css";
import "../heading/heading.css";
import "./file-upload.stories.css";
import "../input-text/input-text.css";
import "../date-picker/date-picker.css";
import "../date-picker/date-picker";
import nonExpandable from "./non-expandable.html?raw";
import playground from "./playground.html?raw";
import singleFile from "./single-file.html?raw";
import withError from "./with-error.html?raw";
import withExistingFiles from "./with-existing-files.html?raw";
import withFormControlLabel from "./with-form-control-label.html?raw";
import withoutDropArea from "./without-drop-area.html?raw";

const meta = {
  title: "Components/ファイルアップロード／ドロップエリア",
} satisfies Meta;

export default meta;

interface FileUploadPlaygroundProps {
  maxFiles: number;
  maxFileSize: string;
  maxTotalSize: string;
  accept: string;
}

export const Playground: StoryObj<FileUploadPlaygroundProps> = {
  render: (args) => {
    const fragment = new HtmlFragment(playground, "dads-file-upload");
    const fileUpload = fragment.root;
    const input = fileUpload?.querySelector(".dads-file-upload__input");

    if (!fileUpload) throw new Error();
    if (!input) throw new Error();

    if (args.maxFiles > 1) {
      fileUpload.setAttribute("max-files", args.maxFiles.toString());
      input.setAttribute("multiple", "");
    } else {
      input.removeAttribute("multiple");
    }

    if (args.maxFileSize) {
      fileUpload.setAttribute("max-file-size", args.maxFileSize);
    }

    if (args.maxTotalSize) {
      fileUpload.setAttribute("max-total-size", args.maxTotalSize);
    }

    if (args.accept) {
      input.setAttribute("accept", args.accept);
    } else {
      input.removeAttribute("accept");
    }

    return fragment.toString({ trimBlankLines: true });
  },
  argTypes: {
    maxFiles: { control: { type: "number", min: 1 } },
    maxFileSize: { control: "text" },
    maxTotalSize: { control: "text" },
    accept: { control: "text" },
  },
  args: {
    maxFiles: 5,
    maxFileSize: "5MB",
    maxTotalSize: "10MB",
    accept: ".png,.jpg,.jpeg,.gif,.xlsx,.xls,.docx,.doc,.pptx,.ppt,.pdf",
  },
};

export const WithFormControlLabel = () =>
  new HtmlFragment(withFormControlLabel, ".dads-form-control-label").toString();

export const WithExistingFiles = () =>
  new HtmlFragment(withExistingFiles, ".dads-file-upload").toString();

export const WithoutDropArea = () =>
  new HtmlFragment(withoutDropArea, ".dads-file-upload").toString();

export const NonExpandable = () =>
  new HtmlFragment(nonExpandable, ".dads-file-upload").toString();

export const SingleFile = () =>
  new HtmlFragment(singleFile, ".dads-file-upload").toString();

export const WithError = () =>
  new HtmlFragment(withError, ".dads-file-upload").toString();
