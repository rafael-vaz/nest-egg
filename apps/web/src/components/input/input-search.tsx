import React from "react";

import Label from "../label/label";
import inputStyles from "./input.module.css";
import styles from "./input-search.module.css";

interface IInputSearchProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  placeholder?: string;
  className?: string;
  hasNoMargin?: boolean;
  callback?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  ref?: React.RefObject<null>;
}

const InputSearch = ({
  id,
  label,
  placeholder = "",
  className = "",
  hasNoMargin = false,
  ref,
  callback,
  ...props
}: IInputSearchProps) => {
  return (
    <div
      className={`${inputStyles.inputContainer} ${className} ${
        hasNoMargin && inputStyles.hasNoMargin
      }`}
    >
      {label && <Label htmlFor={id} text={label} />}
      <div className={inputStyles.inputContent}>
        <input
          id={id}
          className={`${inputStyles.input} ${styles.inputSearch}`}
          onChange={(event) => callback?.(event)}
          placeholder={placeholder}
          autoComplete="off"
          ref={ref}
          {...props}
        />
      </div>
    </div>
  );
};

export default InputSearch;
