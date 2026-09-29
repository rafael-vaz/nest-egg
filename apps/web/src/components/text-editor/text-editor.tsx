import { Editor } from "@tinymce/tinymce-react";
import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import type { Editor as TinyMCEEditor } from "tinymce";

import getCleanEditorConfig from "../../templates/tinymce-config.ts";
import Label from "../label/label";
import Skeleton from "../skeleton/skeleton.tsx";
import styles from "./text-editor.module.css";

interface ITextEditorProps {
  id: string;
  label?: string;
  placeholder?: string;
  isRequired?: boolean;
  register?: UseFormRegisterReturn;
  configType: "default" | "clean";
  value?: string | null;
  onChange?: (value: string) => void;
}

const TextEditor = ({
  id,
  label,
  placeholder,
  isRequired,
  configType,
  value = "",
  onChange,
}: ITextEditorProps) => {
  const editorRef = React.useRef<TinyMCEEditor | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const placeholderText = placeholder ?? "";

  const config = React.useMemo(() => {
    return configType === "clean"
      ? getCleanEditorConfig(placeholderText)
      : getCleanEditorConfig(placeholderText);
  }, [configType, placeholderText]);

  const handleInit = (_event: unknown, editor: TinyMCEEditor) => {
    editorRef.current = editor;
    setIsLoading(false);
  };

  const focusEditor = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const handleEditorChange = (content: string) => {
    onChange?.(content);
  };

  return (
    <div className={styles.textEditorContainer}>
      {label && (
        <Label
          text={label}
          htmlFor={id}
          isRequired={isRequired}
          onClick={focusEditor}
        />
      )}
      {isLoading && <Skeleton className={styles.textEditorSkeleton} />}
      <div data-loading-state={isLoading}>
        <Editor
          id={id}
          tinymceScriptSrc={`${
            import.meta.env.BASE_URL
          }libs/tinymce/tinymce.min.js`}
          value={value ?? ""}
          {...config}
          onInit={handleInit}
          onEditorChange={handleEditorChange}
        />
      </div>
    </div>
  );
};

export default TextEditor;
