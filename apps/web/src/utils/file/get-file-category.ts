import { CategoryType } from "../../@types/file";
import getFileExtension from "./get-file-extension";

const getFileCategory = (fileName: string): CategoryType | null => {
  const extension = getFileExtension(fileName);
  if (!extension) return null;
  const allowedImageTypes = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];
  const allowedDocExtensions = [
    "pdf",
    "doc",
    "docx",
    "ppt",
    "pptx",
    "xls",
    "xlsx",
    "txt",
    "odt",
    "rtf",
  ];
  const allowedArchiveExtensions = ["zip", "rar", "7z", "tar", "gz"];
  if (allowedImageTypes.includes(extension)) return "image";
  if (allowedArchiveExtensions.includes(extension)) return "archive";
  if (allowedDocExtensions.includes(extension)) return "doc";
  return null;
};

export default getFileCategory;
