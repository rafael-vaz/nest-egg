import currency from "currency.js";
import { Delete, X } from "lucide-react";
import { evaluate } from "mathjs";
import { useState } from "react";

import Button from "../button/button";
import styles from "./calculator.module.css";

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
  const [isDegrees, setIsDegrees] = useState<boolean>(true);

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

  const handleBackspace = () => {
    if (operationCompleted) {
      handleClear();
      return;
    }
    setInput((prev) => formatDynamicInput(prev.slice(0, -1)));
  };

  const handleToggleSign = () => {
    setInput((prev) => {
      const parts = prev.split(/([+\-*/])/);
      const lastIndex = parts.length - 1;
      const lastPart = parts[lastIndex];

      if (!lastPart) return prev;

      if (lastPart.startsWith("-(") && lastPart.endsWith(")")) {
        parts[lastIndex] = lastPart.slice(2, -1);
      } else {
        parts[lastIndex] = `-(${lastPart})`;
      }

      return parts.join("");
    });
  };

  const handleToggleDegrees = () => {
    setIsDegrees((prev) => !prev);
  };

  const handleCalculate = () => {
    try {
      let sanitizedInput = input.replace(/\./g, "").replace(/,/g, ".");

      const openParens = (sanitizedInput.match(/\(/g) || []).length;
      const closeParens = (sanitizedInput.match(/\)/g) || []).length;
      sanitizedInput += ")".repeat(Math.max(0, openParens - closeParens));

      if (isDegrees) {
        sanitizedInput = sanitizedInput.replace(
          /(sin|cos|tan)\(([^()]+)\)/g,
          (_match, fn, arg) => `${fn}(${arg} deg)`,
        );
      }

      const evalResult = evaluate(sanitizedInput);

      if (typeof evalResult !== "number" || !isFinite(evalResult)) {
        throw new Error("Invalid result");
      }

      const isInteger = Number.isInteger(evalResult);
      const formattedResult = formatBR(evalResult, isInteger ? 0 : 2);

      setResult(formattedResult);
      setOperationCompleted(true);
    } catch {
      setResult("Erro");
      setOperationCompleted(true);
    }
  };

  const digitButtons = [
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

  const scientificButtons: { label: string; value: string }[] = [
    { label: "sin", value: "sin(" },
    { label: "cos", value: "cos(" },
    { label: "tan", value: "tan(" },
    { label: "√", value: "sqrt(" },
    { label: "x²", value: "^2" },
    { label: "xʸ", value: "^" },
    { label: "log", value: "log10(" },
    { label: "ln", value: "log(" },
    { label: "π", value: "pi" },
    { label: "e", value: "e" },
    { label: "%", value: "/100" },
    { label: "(", value: "(" },
    { label: ")", value: ")" },
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

        <div className={styles.calculatorScientificButtons}>
          <button
            className={`${styles.calculatorButton} ${styles.calculatorButtonScientific}`}
            title="Alternar entre graus e radianos"
            aria-label="Alternar entre graus e radianos"
            onClick={handleToggleDegrees}
          >
            {isDegrees ? "DEG" : "RAD"}
          </button>
          {scientificButtons.map(({ label, value }) => (
            <button
              key={label}
              className={`${styles.calculatorButton} ${styles.calculatorButtonScientific}`}
              onClick={() => handleClick(value)}
            >
              {label}
            </button>
          ))}
          <button
            className={`${styles.calculatorButton} ${styles.calculatorButtonScientific}`}
            title="Inverter sinal"
            aria-label="Inverter sinal"
            onClick={handleToggleSign}
          >
            +/-
          </button>
          <button
            className={`${styles.calculatorButton} ${styles.calculatorButtonScientific}`}
            title="Apagar último caractere"
            aria-label="Apagar último caractere"
            onClick={handleBackspace}
          >
            <Delete size={16} />
          </button>
        </div>

        <div className={styles.calculatorButtons}>
          {digitButtons.map((btn) => {
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
