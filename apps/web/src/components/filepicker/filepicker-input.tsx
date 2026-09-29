import { PayloadAction } from "@reduxjs/toolkit";
import { Upload, X } from "lucide-react";
import React from "react";

import { AllowedCategoryType } from "../../@types/file";
import { IFile } from "../../@types/file/index.ts";
import useFilepicker from "../../hooks/file/use-filepicker";
import debounce from "../../utils/debounce.ts";
import getFirebaseFileInfoFromURL from "../../utils/file/get-firebase-file-info-from-url.ts";
import Label from "../label/label";
import Spinner from "../spinner/spinner";
import styles from "./filepicker-input.module.css";

interface IFilepickerProps {
  id: string;
  label: string;
  selectedFileURL?: string | null;
  defaultFileName?: string;
  defaultCategory: AllowedCategoryType;
  specificExtensions?: string[];
  value?: string | null;
  onChangeFiles?: React.Dispatch<React.SetStateAction<IFile[] | null>>;
  onChangeControl?: (value: string | null) => void;
  onRemove: () => void;
  onUpload?: (
    file: File
  ) => Promise<PayloadAction<string | undefined | unknown>>;
}

const FilepickerInput = ({
  id,
  label,
  selectedFileURL,
  defaultFileName,
  defaultCategory,
  specificExtensions,
  onChangeFiles,
  onChangeControl,
  onRemove,
  onUpload,
}: IFilepickerProps) => {
  const {
    fileName,
    fileURL,
    setFile,
    setFileName,
    setFileURL,
    handleChange,
    isUploading,
  } = useFilepicker({
    defaultFileName,
    defaultCategory,
    specificExtensions,
    onChangeFiles,
    onChangeControl,
    onUpload,
  });

  function removeFile() {
    onRemove();
    setFile(null);
    setFileName(null);
    setFileURL(null);
    onChangeControl?.(null);
  }

  const debouncedRemoveFile = debounce(removeFile, 500);

  React.useEffect(() => {
    if (selectedFileURL) {
      const fileInfo = getFirebaseFileInfoFromURL(selectedFileURL);
      if (fileInfo?.fileName) {
        setFileURL(selectedFileURL);
        setFileName(fileInfo?.fileName);
      }
    }
  }, [selectedFileURL, setFileURL, setFileName]);

  return (
    <div className={styles.filepickerInputContainer}>
      <Label id={id} text={label} isRequired={false} />
      <div id={id} className={styles.filepickerInput} tabIndex={0}>
        <span className={styles.filepickerInputValue}>
          {fileURL ? (
            <a target="_blank" href={fileURL}>
              {fileName}
            </a>
          ) : (
            "Selecionar"
          )}
        </span>
        {selectedFileURL ? (
          <button
            className={styles.filepickerInputButton}
            title="Remover"
            aria-label="Remover arquivo"
            onClick={(e) => {
              e.preventDefault();
              debouncedRemoveFile();
            }}
          >
            <X />
          </button>
        ) : (
          <label
            htmlFor="filepickerInput"
            className={styles.filepickerInputButton}
            aria-label="Selecionar arquivo"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                const target = event.target as HTMLElement;
                target.click();
              }
            }}
            role="button"
            tabIndex={0}
          >
            <input
              id="filepickerInput"
              type="file"
              onChange={(e) => {
                handleChange(e);
              }}
            />
            {isUploading ? <Spinner size="small" /> : <Upload size={16} />}
          </label>
        )}
      </div>
    </div>
  );
};

export default FilepickerInput;
