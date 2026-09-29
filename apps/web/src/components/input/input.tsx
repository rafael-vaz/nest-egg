import { Eye, EyeOff, Lock } from "lucide-react";
import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

import Label from "../label/label";
import styles from "./input.module.css";
import InputControlButton from "./input-control-button";
import InputWarningText from "./input-warning-text";

interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  placeholder?: string;
  type: string;
  initSize?: "auto" | "fill";
  error?: string | null | undefined;
  hasNoMargin?: boolean;
  hasVisibilityToggle?: boolean;
  isRequired?: boolean;
  register?: UseFormRegisterReturn;
  className?: string;
  ref?: React.RefObject<null>;
}

const Input = ({
  id,
  label,
  type,
  register,
  initSize = "fill",
  error,
  hasVisibilityToggle = false,
  hasNoMargin = false,
  isRequired = true,
  className = "",
  ref,
  ...props
}: IInputProps) => {
  const [errorState, setErrorState] = React.useState(error);
  const [showCharacters, setShowCharacters] = React.useState(false);
  const currentVisibilityToggleIcon = showCharacters ? EyeOff : Eye;
  const currentVisibilityToggleTitle = showCharacters
    ? "Esconder senha"
    : "Mostrar senha";
  const currentType = showCharacters ? "text" : "password";

  React.useEffect(() => {
    setErrorState(error);
  }, [error]);

  function handleVisibilityToggle(event: React.MouseEvent) {
    event.preventDefault();
    setShowCharacters((state) => !state);
  }

  function clearError() {
    if (error) setErrorState(null);
  }

  return (
    <div
      className={`${styles.inputContainer} ${
        hasNoMargin && styles.hasNoMargin
      }`}
      data-size={initSize}
    >
      {label && <Label htmlFor={id} text={label} isRequired={isRequired} />}
      <div className={styles.inputControlContainer}>
        <input
          id={id}
          type={hasVisibilityToggle ? currentType : type}
          className={`${styles.input} ${className}`}
          onChange={(e) => {
            register?.onChange?.(e);
            clearError();
          }}
          onKeyDown={(e) => {
            if (e.key == "Enter") {
              e.preventDefault();
            }
          }}
          autoComplete="off"
          ref={ref}
          {...props}
          {...register}
        />
        {hasVisibilityToggle && (
          <InputControlButton
            id={`${id}-visibility-toggle`}
            icon={currentVisibilityToggleIcon}
            title={currentVisibilityToggleTitle}
            aria-label={currentVisibilityToggleTitle}
            onClick={handleVisibilityToggle}
          />
        )}
        {errorState && <InputWarningText type="error" text={errorState} />}
        {props.disabled && (
          <Lock size={16} className={styles.inputDisabledIcon} />
        )}
      </div>
    </div>
  );
};

export default Input;
