import React from "react";

import formatCurrencyInput from "../../utils/text/format-currency-input";
import parseCurrency from "../../utils/text/parse-currency";
import Input from "../input/input";
import styles from "./monetary-value-interval.module.css";

interface IMonetaryValueIntervalProps {
  startInputRef?: React.RefObject<null>;
  endInputRef?: React.RefObject<null>;
  onChange?: (startValue: number, endValue: number) => void;
}

const MonetaryValueInterval = ({
  onChange,
  startInputRef,
  endInputRef,
}: IMonetaryValueIntervalProps) => {
  const [startValue, setStartValue] = React.useState(0);
  const [endValue, setEndValue] = React.useState(0);

  React.useEffect(() => {
    onChange?.(startValue, endValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startValue, endValue]);

  function handleSetStartValue(event: React.InputEvent<HTMLInputElement>) {
    const target = event.target as HTMLInputElement;
    const currentValue = target.value;
    if (currentValue) {
      setStartValue(parseCurrency(currentValue));
    } else {
      setStartValue(0);
    }
  }

  function handleSetEndValue(event: React.InputEvent<HTMLInputElement>) {
    const target = event.target as HTMLInputElement;
    const currentValue = target.value;
    if (currentValue) {
      setEndValue(parseCurrency(currentValue));
    } else {
      setEndValue(0);
    }
  }

  return (
    <div
      className={styles.monetaryValueInterval}
      tabIndex={0}
      aria-label="Filtrar por intervalo de valores"
    >
      <Input
        id="interval-start-value"
        aria-label="Valor inicial"
        hasNoMargin={true}
        placeholder="R$ 0,00"
        type="text"
        className={styles.value}
        ref={startInputRef}
        onInput={(event: React.InputEvent<HTMLInputElement>) => {
          formatCurrencyInput(event);
          handleSetStartValue(event);
        }}
      />
      <span className={styles.text}>até</span>
      <Input
        id="interval-end-value"
        aria-label="Valor final"
        hasNoMargin={true}
        placeholder="R$ 0,00"
        type="text"
        className={styles.value}
        ref={endInputRef}
        onInput={(event: React.InputEvent<HTMLInputElement>) => {
          formatCurrencyInput(event);
          handleSetEndValue(event);
        }}
      />
    </div>
  );
};

export default MonetaryValueInterval;
