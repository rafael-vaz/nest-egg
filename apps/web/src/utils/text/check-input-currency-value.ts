import parseCurrency from "./parse-currency";

export default function checkInputCurrencyValue(value: string) {
  try {
    return parseCurrency(value);
  } catch {
    return undefined;
  }
}
