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
import playground from "./playground.html?raw";
import withExistingFiles from "./with-existing-files.html?raw";

const meta = {
  title: "Components/ファイルアップロード／ドロップエリア",
} satisfies Meta;

export default meta;

interface FileUploadPlaygroundProps {
  maxFiles: number;
  maxFileSize: string;
  maxTotalSize: string;
  accept: string;
  droppable: boolean;
  dropAreaExpandable?: boolean;
}

export const Playground: StoryObj<FileUploadPlaygroundProps> = {
  render: (args) => {
    const fragment = new HtmlFragment(playground, ".dads-form-control-label");
    const fileUpload = fragment.root.querySelector("dads-file-upload");
    const input = fileUpload?.querySelector(".dads-file-upload__input");
    const dropArea = fileUpload?.querySelector(".dads-file-upload__drop-area");
    const buttonArea = fileUpload?.querySelector(
      ".dads-file-upload__button-area",
    );
    const dropText = buttonArea?.querySelector("p");
    const selectedFilesMessage = fileUpload?.querySelector(
      ".dads-file-upload__select-summary",
    );
    const errorMessages = fileUpload?.querySelector(
      ".dads-file-upload__error-messages",
    );
    const expand = fileUpload?.querySelector(
      ".dads-file-upload__expand-drop-area",
    );
    const overlay = fileUpload?.querySelector(
      ".dads-file-upload__viewport-overlay",
    );

    if (!fileUpload) throw new Error();
    if (!input) throw new Error();
    if (!dropArea) throw new Error();
    if (!buttonArea) throw new Error();
    if (!dropText) throw new Error();
    if (!selectedFilesMessage) throw new Error();
    if (!errorMessages) throw new Error();
    if (!overlay) throw new Error();
    if (!expand) throw new Error();

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

    if (!args.droppable) {
      // whitespace text nodes may exist
      if (buttonArea.previousSibling) {
        dropArea.before(buttonArea.previousSibling);
      }
      dropArea.before(buttonArea);
      // whitespace text nodes may exist
      if (selectedFilesMessage.previousSibling) {
        dropArea.before(selectedFilesMessage.previousSibling);
      }
      dropArea.before(selectedFilesMessage);
      // whitespace text nodes may exist
      if (errorMessages.previousSibling) {
        dropArea.before(errorMessages.previousSibling);
      }
      dropArea.before(errorMessages);
      dropArea.remove();
      dropText.remove();
      overlay.remove();
    }

    if (args.droppable && !args.dropAreaExpandable) {
      expand.remove();
    }

    return fragment.toString({ trimBlankLines: true });
  },
  argTypes: {
    maxFiles: { control: { type: "number", min: 1 } },
    maxFileSize: { control: "text" },
    maxTotalSize: { control: "text" },
    accept: { control: "text" },
    droppable: { control: "boolean" },
    dropAreaExpandable: { control: "boolean", if: { arg: "droppable" } },
  },
  args: {
    maxFiles: 5,
    maxFileSize: "5MB",
    maxTotalSize: "10MB",
    accept: ".png,.jpg,.jpeg,.gif,.xlsx,.xls,.docx,.doc,.pptx,.ppt,.pdf",
    droppable: true,
    dropAreaExpandable: true,
  },
};

export const WithExistingFiles = () =>
  new HtmlFragment(withExistingFiles, ".dads-form-control-label").toString();
