function sortByKey<T>(
  array: T[],
  key: keyof T,
  isDate: boolean = false,
  locale: string = "pt-BR",
  caseSensitive: boolean = false
): T[] {
  return [...array].sort((a, b) => {
    const aValue = String(a[key]);
    const bValue = String(b[key]);

    if (isDate) {
      const aTime = Date.parse(aValue);
      const bTime = Date.parse(bValue);
      return (aTime || 0) - (bTime || 0);
    }

    return aValue.localeCompare(bValue, locale, {
      sensitivity: caseSensitive ? "variant" : "base",
    });
  });
}

export default sortByKey;
