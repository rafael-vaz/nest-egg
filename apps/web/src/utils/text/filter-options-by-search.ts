interface IFilterableOption {
  value: string;
}

function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

function filterOptionsBySearch<T extends IFilterableOption>(
  searchTerm: string,
  options: T[],
): T[] {
  if (searchTerm.length === 0) return options;

  const normalizedTerm = normalize(searchTerm);
  return options.filter((option) =>
    normalize(option.value).includes(normalizedTerm),
  );
}

export default filterOptionsBySearch;
