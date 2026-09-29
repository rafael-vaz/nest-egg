import { toast } from "react-toastify";

import { CategoryType } from "../../@types/file";
import getFileCategory from "./get-file-category";

interface FileTypeConfig {
  maxSize: number;
  errorMessage: string;
}

const fileTypeConfigMap: Record<CategoryType, FileTypeConfig> = {
  image: {
    maxSize: 5,
    errorMessage: "A imagem deve ter no máximo 5MB.",
  },
  doc: {
    maxSize: 10,
    errorMessage: "O documneto deve ter no máximo 10MB.",
  },
  archive: {
    maxSize: 50,
    errorMessage: "O arquivo deve ter no máximo 50MB.",
  },
};

function checkFileMaxSize(file: File): boolean {
  const fileSize = Math.round(file.size / 1048576);
  const fileCategory = getFileCategory(file.name);
  if (fileCategory) {
    const fileType = fileTypeConfigMap[fileCategory];
    if (fileSize > fileType.maxSize) {
      toast.error(fileType.errorMessage);
      return false;
    }
  }
  return true;
}

export default checkFileMaxSize;
