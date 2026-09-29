function parseCurrency(formatted: string): number {
  const normalized = formatted
    .replace(/\s/g, "")
    .replace("R$", "")
    .replace(/\./g, "")
    .replace(",", ".");

  const value = Number(normalized);

  return isNaN(value) ? 0 : Math.round(value * 100); // ← retorna em centavos
}

export default parseCurrency;
