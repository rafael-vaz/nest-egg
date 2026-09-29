import { PayloadAction } from "@reduxjs/toolkit";
import React from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import { AllowedCategoryType, IFile } from "../../@types/file";
import { RootState } from "../../store/configure-store";
import checkFileMaxSize from "../../utils/file/check-file-max-size";
import formatFileName from "../../utils/file/format-file-name";
import getFileCategory from "../../utils/file/get-file-category";
import getFileExtension from "../../utils/file/get-file-extension";
import renameFile from "../../utils/file/rename-file";

const categoryEnum: Record<AllowedCategoryType, string> = {
  doc: "Documento",
  image: "Imagem",
  archive: "Arquivo",
  all: "Todos",
};

interface IUseFilepickerProps {
  defaultFileName?: string;
  defaultCategory?: AllowedCategoryType;
  specificExtensions?: string[];
  onChangeFiles?: React.Dispatch<React.SetStateAction<IFile[] | null>>;
  onChangeControl?: (value: string | null) => void;
  onUpload?: (
    file: File,
  ) => Promise<PayloadAction<string | undefined | unknown>>;
}

const useFilepicker = ({
  defaultFileName,
  defaultCategory,
  specificExtensions,
  onChangeFiles,
  onChangeControl,
  onUpload,
}: IUseFilepickerProps) => {
  const { authUser } = useSelector((state: RootState) => state.userAuth);
  const [file, setFile] = React.useState<File | null>(null);
  const [fileName, setFileName] = React.useState<string | null>(null);
  const [fileURL, setFileURL] = React.useState<string | null>(null);
  const [fileCategory, setFileCategory] =
    React.useState<AllowedCategoryType | null>(null);
  const [isUploading, setUploading] = React.useState(false);

  const handleChange = React.useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const filepicker = e.target;
      const selectedFile = filepicker.files?.[0] || null;
      if (!selectedFile) return;
      const fileExtension = getFileExtension(selectedFile.name);
      filepicker.value = "";

      const category =
        defaultCategory === "all"
          ? defaultCategory
          : getFileCategory(selectedFile.name);

      if (!category) {
        toast.error("Categoria de arquivo inválida!");
        return;
      }

      // size check
      if (!checkFileMaxSize(selectedFile)) {
        return;
      }

      // extension check
      if (
        specificExtensions &&
        specificExtensions.length > 0 &&
        !specificExtensions.includes(fileExtension)
      ) {
        const allowedExtensions = specificExtensions
          .map((extension) => `"${extension}"`)
          .join(" ");
        toast.error(
          `Apenas as extensões do tipo ${allowedExtensions} são permitidas!`,
        );
        return;
      }

      // category check
      if (defaultCategory && defaultCategory !== category) {
        toast.error(
          `Apenas arquivos do tipo "${categoryEnum[defaultCategory]}" são permitidos!`,
        );
        return;
      }

      const generatedFileName = formatFileName(
        defaultFileName
          ? `${defaultFileName}.${fileExtension}`
          : selectedFile.name,
      );

      const newFile = renameFile(selectedFile, generatedFileName);
      try {
        setUploading(true);

        if (onUpload) {
          const { payload } = await onUpload(newFile);
          if (payload && typeof payload === "string") {
            setFileURL(payload);
            onChangeControl?.(payload);
          }
        }

        if (onChangeFiles) {
          onChangeFiles((state) => {
            const newRegister = {
              file: newFile,
              author: {
                uid: authUser!.uid,
                name: authUser!.name,
              },
              createdAt: new Date(),
            };
            const fileAlreadyExists = state?.some(
              (item) => item.file.name === newFile.name,
            );
            if (fileAlreadyExists) {
              toast.error(
                `Você não pode selecionar arquivos com nomes iguais!`,
              );
              return state;
            }
            return state && state.length > 0
              ? [...state, newRegister]
              : [newRegister];
          });
        }
        setFile(newFile);
        setFileName(generatedFileName);
        setFileCategory(category);
      } catch (error) {
        toast.error("Erro ao realizazar seleção do arquivo.");
        console.error("Error when performing file selection.", error);
      } finally {
        setUploading(false);
      }
    },
    [
      defaultFileName,
      defaultCategory,
      specificExtensions,
      onUpload,
      onChangeFiles,
      onChangeControl,
      authUser,
    ],
  );

  return {
    file,
    fileName,
    fileURL,
    fileCategory,
    isUploading,
    setFile,
    setFileName,
    setFileURL,
    handleChange,
  };
};

export default useFilepicker;
