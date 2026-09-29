import { PayloadAction } from "@reduxjs/toolkit";
import { Upload } from "lucide-react";

import { AllowedCategoryType, IFile } from "../../@types/file";
import useFilepicker from "../../hooks/file/use-filepicker";
import Spinner from "../spinner/spinner";
import styles from "./filepicker-button.module.css";

interface IFilepickerButtonProps {
  id: string;
  label: string;
  defaultFileName?: string;
  defaultCategory: AllowedCategoryType;
  specificExtensions?: string[];
  onChangeFiles?: React.Dispatch<React.SetStateAction<IFile[] | null>>;
  onChangeControl?: (value: string | null) => void;
  onUpload?: (
    file: File
  ) => Promise<PayloadAction<string | undefined | unknown>>;
}

const FilepickerButton = ({
  id,
  label,
  defaultFileName,
  defaultCategory,
  specificExtensions,
  onChangeFiles,
  onChangeControl,
  onUpload,
}: IFilepickerButtonProps) => {
  const { handleChange, isUploading } = useFilepicker({
    defaultFileName,
    defaultCategory,
    specificExtensions,
    onChangeFiles,
    onChangeControl,
    onUpload,
  });

  return (
    <label
      id={id}
      title={label}
      aria-label={label}
      htmlFor={`${id}-filepickerInput`}
      className={styles.filepickerButton}
      data-loading={isUploading}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          const target = event.target as HTMLElement;
          target.click();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <input id={`${id}-filepickerInput`} type="file" onChange={handleChange} />
      {isUploading ? <Spinner size="small" /> : <Upload size={16} />}
    </label>
  );
};

export default FilepickerButton;
