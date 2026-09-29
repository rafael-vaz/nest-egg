import { CheckCircle, ChevronDown, Lock, LucideProps } from "lucide-react";
import { motion } from "motion/react";
import React from "react";

import slideDownVariants from "../../motion/slide-down-variants";
import Label from "../label/label";
import styles from "./select.module.css";

export interface ISelectOption {
  id: string;
  value: string;
}

export interface ISelectGroup {
  name?: string;
  icon?: React.ForwardRefExoticComponent<Omit<LucideProps, "ref">>;
  children: ISelectOption[];
}

interface ISelectProps {
  id: string;
  label?: string;
  initialTitle?: string;
  groups: ISelectGroup[];
  value?: string;
  disabled?: boolean;
  hasNoMargin?: boolean;
  className?: string;
  infoBox?: string;
  onChange?: (value: string) => void;
}

const Select = ({
  id,
  label,
  initialTitle,
  groups,
  value = "",
  hasNoMargin = false,
  disabled = false,
  className,
  infoBox = "",
  onChange,
}: ISelectProps) => {
  const initialState = {
    id: "",
    value: initialTitle || "Selecione",
  };
  const selectContainerRef = React.useRef(null);
  const selectInputRef = React.useRef(null);
  const selectListRef = React.useRef(null);
  const [active, setActive] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState(initialState);

  function handleSelectClick() {
    setActive((state) => !state);
    setTimeout(setSelectListFocus, 50);
  }

  function handleSelectKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      setActive((state) => !state);
      setTimeout(setSelectListFocus, 50);
    }
  }

  function handleOptionKeyDown(event: React.KeyboardEvent<HTMLLIElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      const id = event.currentTarget.id;
      selectNewOption(id);
      setSelectInputFocus();
    }
  }

  function handleOptionClick(event: React.MouseEvent<HTMLLIElement>) {
    const id = event.currentTarget.id;
    selectNewOption(id);
    setSelectInputFocus();
  }

  function setSelectInputFocus() {
    if (selectInputRef.current) {
      const selectInputElement = selectInputRef.current as HTMLElement;
      selectInputElement.focus();
    }
  }

  function setSelectListFocus() {
    if (selectListRef.current) {
      const selectListElement = selectListRef.current as HTMLElement;
      selectListElement.focus();
    }
  }

  const selectNewOption = React.useCallback(
    (id: string) => {
      const newOptionValue = groups
        .flatMap((group) => group.children)
        .find((option) => option.id === id);

      if (newOptionValue) {
        setSelectedOption((state) => ({ ...state, ...newOptionValue }));
        onChange?.(newOptionValue.id);
        setActive(false);
      }
    },
    [groups, onChange],
  );

  function handleOutsideCLick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (selectContainerRef.current) {
      const selectContainerElement = selectContainerRef.current as HTMLElement;
      if (
        !selectContainerElement.contains(target) ||
        target === selectContainerRef.current
      ) {
        setActive(false);
      }
    }
  }

  function handleOutsideKeyDown(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    if (selectContainerRef.current && event.key === "Enter") {
      const selectContainerElement = selectContainerRef.current as HTMLElement;
      if (!selectContainerElement.contains(target)) {
        setActive(false);
      }
    }
  }

  React.useEffect(() => {
    const option = groups
      .flatMap((g) => g.children)
      .find((o) => o.id === value);

    if (option) {
      // atualiza só o visual
      setSelectedOption(option);
    } else {
      setSelectedOption(initialState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, groups]);

  React.useEffect(() => {
    if (!active) return;
    window.document.addEventListener("click", handleOutsideCLick);
    window.document.addEventListener("keydown", handleOutsideKeyDown);
    return () => {
      window.document.removeEventListener("click", handleOutsideCLick);
      window.document.removeEventListener("keydown", handleOutsideKeyDown);
    };
  }, [active]);

  const selectOptions = groups.map(({ name, icon: Icon, children }) => {
    const options = children.map(({ id, value }) => {
      const isSelected = selectedOption.id === id;
      return (
        <li
          id={id}
          role="option"
          aria-selected={isSelected}
          className={styles.selectOption}
          data-selected={isSelected}
          onClick={handleOptionClick}
          onKeyDown={handleOptionKeyDown}
          tabIndex={0}
          key={id}
        >
          <span>{value}</span>
          {isSelected && <CheckCircle size={16} />}
        </li>
      );
    });
    if (name && name.length > 0) {
      return (
        <li role="group" aria-label={name}>
          <div
            className={styles.selectGroup}
            tabIndex={0}
            aria-label="Categoria"
          >
            {Icon && <Icon size={16} />}
            <span>{name}</span>
          </div>
          <ul>{options}</ul>
        </li>
      );
    } else {
      return options;
    }
  });

  return (
    <div
      className={`${styles.selectContainer} ${
        hasNoMargin && styles.hasNoMargin
      }`}
      ref={selectContainerRef}
    >
      {label && (
        <Label
          id={`${id}-label`}
          htmlFor={id}
          text={label}
          infoBox={infoBox}
          onClick={handleSelectClick}
        />
      )}
      <div className={styles.selectInputContainer}>
        <button
          id={id}
          type="button"
          role={"combobox"}
          className={`${styles.selectInput} ${className}`}
          data-active={active}
          onClick={handleSelectClick}
          onKeyDown={handleSelectKeyDown}
          tabIndex={0}
          aria-labelledby={`${id}-label`}
          aria-describedby={`${id}-selected-value`}
          aria-expanded={active}
          aria-haspopup="listbox"
          aria-controls={`${id}-listbox`}
          aria-activedescendant={selectedOption.id}
          disabled={disabled}
          ref={selectInputRef}
        >
          <span id={`${id}-selected-value`}>{selectedOption.value}</span>
          {disabled ? <Lock size={16} /> : <ChevronDown size={16} />}
        </button>
        {active && (
          <motion.div
            id={`${id}-listbox`}
            key={id}
            variants={slideDownVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            role="listbox"
            className={styles.selectOptionListContainer}
            aria-label="Lista de opções"
            tabIndex={0}
            ref={selectListRef}
          >
            <ul className={`${styles.selectOptionsList} smoothScrollbar`}>
              {...selectOptions}
            </ul>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Select;
