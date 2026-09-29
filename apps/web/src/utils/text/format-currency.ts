import currency from "currency.js";

function formatCurrency(value: string, hasSymbol = true): string {
  const onlyNumbers = value.replace(/\D/g, "");

  if (onlyNumbers && onlyNumbers.length > 0) {
    const numericValue = Number(onlyNumbers) / 100;

    return currency(numericValue, {
      symbol: hasSymbol ? "R$ " : "",
      separator: ".",
      decimal: ",",
      precision: 2,
    }).format();
  }
  return "0,00";
}

export default formatCurrency;
