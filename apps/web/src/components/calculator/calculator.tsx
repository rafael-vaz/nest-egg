import currency from "currency.js";
import { X } from "lucide-react";
import { useState } from "react";

import Button from "../button/button";
import styles from "./Calculator.module.css";

type Operation = "+" | "-" | "*" | "/";

interface ICalculatorProps {
  onClose: () => void;
}

const formatBR = (value: string | number, precision: number = 2): string =>
  currency(value, {
    symbol: "",
    separator: ".",
    decimal: ",",
    precision,
  }).format();

const Calculator = ({ onClose }: ICalculatorProps) => {
  const [input, setInput] = useState<string>("");
  const [result, setResult] = useState<string | null>(null);
  const [operationCompleted, setOperationCompleted] = useState<boolean>(false);

  const operations: Operation[] = ["/", "*", "-", "+"];

  const formatDynamicInput = (rawInput: string): string => {
    const parts = rawInput.split(/([+\-*/])/);
    const lastPart = parts[parts.length - 1];

    if (!lastPart || lastPart.endsWith(",")) return rawInput;

    if (lastPart.includes(",")) {
      const [integerPart, decimalPart] = lastPart.split(",");
      const cleanInteger = integerPart.replace(/\./g, "");

      if (cleanInteger === "" || isNaN(Number(cleanInteger))) {
        return rawInput;
      }

      const formattedInteger = Number(cleanInteger).toLocaleString("pt-BR");
      parts[parts.length - 1] = `${formattedInteger},${decimalPart}`;
      return parts.join("");
    }

    const numeric = lastPart.replace(/\./g, "");
    const formatted =
      numeric === "" || isNaN(Number(numeric))
        ? lastPart
        : Number(numeric).toLocaleString("pt-BR");

    parts[parts.length - 1] = formatted;
    return parts.join("");
  };

  const handleClick = (value: string) => {
    if (value === ".") value = ",";

    if (operationCompleted && !operations.includes(value as Operation)) {
      setOperationCompleted(false);
      setResult(null);
      setInput(value === "," ? "0," : formatDynamicInput(value));
      return;
    }

    setInput((prev) => {
      const lastChar = prev.slice(-1);

      if (
        operations.includes(value as Operation) &&
        (prev === "" || operations.includes(lastChar as Operation))
      ) {
        return prev;
      }

      if (value === ",") {
        const parts = prev.split(/([+\-*/])/);
        const lastNumber = parts[parts.length - 1];

        if (lastNumber === "" || lastNumber.includes(",")) return prev;
      }

      if (operations.includes(value as Operation)) {
        setOperationCompleted(false);
        return prev + value;
      }

      const newInput = prev + value;
      return formatDynamicInput(newInput);
    });
  };

  const handleClear = () => {
    setInput("");
    setResult(null);
    setOperationCompleted(false);
  };

  const handleCalculate = () => {
    try {
      const sanitizedInput = input.replace(/\./g, "").replace(/,/g, ".");
      const evalResult = Function(`return ${sanitizedInput}`)();
      const isInteger = Number.isInteger(evalResult);
      const formattedResult = formatBR(evalResult, isInteger ? 0 : 2);

      setResult(formattedResult);
      setOperationCompleted(true);
    } catch {
      setResult("Erro");
      setOperationCompleted(true);
    }
  };

  const buttons = [
    "7",
    "8",
    "9",
    "/",
    "4",
    "5",
    "6",
    "*",
    "1",
    "2",
    "3",
    "-",
    "0",
    ",",
    "=",
    "+",
  ];

  return (
    <div className={styles.calculator}>
      <header className={styles.calculatorHeader}>
        <h4>Calculadora</h4>
        <Button
          size="small"
          color="light-gray"
          icon={X}
          title="Fechar"
          aria-label="Fechar calculadora"
          onClick={onClose}
        />
      </header>
      <div className={styles.calculatorContent}>
        <div
          className={`${styles.calculatorDisplay} smoothScrollbar`}
          aria-label="Visor da calculadora"
          role="status"
          aria-live="polite"
          tabIndex={0}
        >
          {input || "0"} {result !== null && `= ${result}`}
        </div>

        <div className={styles.calculatorButtons}>
          {buttons.map((btn) => {
            const isOperation = operations.includes(btn as Operation);
            const isEqual = btn === "=";
            let className = styles.calculatorButton;

            if (isOperation)
              className += ` ${styles.calculatorButtonOperation}`;
            if (isEqual) className += ` ${styles.calculatorButtonEqual}`;

            return (
              <button
                key={btn}
                className={className}
                onClick={() =>
                  btn === "=" ? handleCalculate() : handleClick(btn)
                }
              >
                {btn}
              </button>
            );
          })}
          <button className={styles.calculatorClear} onClick={handleClear}>
            C
          </button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
