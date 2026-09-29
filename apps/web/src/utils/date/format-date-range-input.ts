const formatDateRangeInput = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 16);

  const firstDate = digits.slice(0, 8);
  const secondDate = digits.slice(8, 16);

  const formatDate = (dateStr: string) => {
    if (dateStr.length <= 2) return dateStr;
    if (dateStr.length <= 4)
      return `${dateStr.slice(0, 2)}/${dateStr.slice(2)}`;
    return `${dateStr.slice(0, 2)}/${dateStr.slice(2, 4)}/${dateStr.slice(4)}`;
  };

  const formattedFirst = formatDate(firstDate);
  const formattedSecond = formatDate(secondDate);

  return secondDate.length > 0
    ? `${formattedFirst} - ${formattedSecond}`
    : formattedFirst;
};

export default formatDateRangeInput;
