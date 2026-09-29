import React from "react";

import transactionTypesMap, {
  TransactionOptionType,
} from "../../templates/transaction-type-map";
import Label from "../label/label";
import styles from "./transaction-type-selector.module.css";

interface ITransactionTypeSelectorProps {
  id: string;
  value: TransactionOptionType;
  hasAllOption?: boolean;
  label?: string;
  onChange: (data: TransactionOptionType) => void;
}

const TransactionTypeSelector = ({
  id,
  value,
  label,
  hasAllOption = false,
  onChange,
}: ITransactionTypeSelectorProps) => {
  const [selectedType, setSelectedType] =
    React.useState<TransactionOptionType>(value);
  const selectorRef = React.useRef(null);

  function handleClick(event: React.MouseEvent) {
    const id = event.currentTarget.id as TransactionOptionType;
    setSelectedType(id);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLLIElement>) {
    if (event.key === "Enter") {
      const id = event.currentTarget.id as TransactionOptionType;
      setSelectedType(id);
    }
  }

  function setTransactionTypeSelectorFocus() {
    if (selectorRef.current) {
      const selectListElement = selectorRef.current as HTMLElement;
      selectListElement.focus();
    }
  }

  React.useEffect(() => {
    onChange(selectedType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType]);

  const transactionSelectorOptions = transactionTypesMap.map(
    ({ id, icon: Icon, value }) => {
      const isSelected = id === selectedType;
      if (id === "all" && !hasAllOption) return;
      return (
        <li
          key={id}
          id={id}
          role="option"
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          className={styles.transactionTypeSelectorOption}
          aria-selected={isSelected}
          data-selected={isSelected}
          tabIndex={0}
        >
          <Icon size={16} />
          <span>{value}</span>
        </li>
      );
    }
  );

  return (
    <div>
      {label && (
        <Label
          id={`${id}-label`}
          htmlFor={id}
          text={label}
          onClick={setTransactionTypeSelectorFocus}
        />
      )}
      <ul
        id={id}
        role="group"
        className={styles.transactionTypeSelector}
        tabIndex={0}
        ref={selectorRef}
      >
        {transactionSelectorOptions}
      </ul>
    </div>
  );
};

export default TransactionTypeSelector;
