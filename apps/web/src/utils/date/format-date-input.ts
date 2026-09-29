const formatDateInput = (value: string): string => {
  const digits = value.replace(/\D/g, "");
  const formatted = digits
    .slice(0, 8)
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");
  return formatted;
};

export default formatDateInput;
