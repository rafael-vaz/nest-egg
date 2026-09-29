import formatCurrency from "./format-currency";

function formatCurrencyInput(event: React.InputEvent<HTMLInputElement>) {
  const target = event.target as HTMLInputElement;
  const currentValue = target.value;
  if (currentValue) {
    target.value = formatCurrency(currentValue) ?? "";
  }
}

export default formatCurrencyInput;
