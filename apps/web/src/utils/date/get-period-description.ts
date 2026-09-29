import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type DatesRangeValue<T> = [T | null, T | null];

function getPeriodDescription(value: DatesRangeValue<string>): string {
  const [start, end] = value;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";

    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return format(date, "MMM yyyy", { locale: ptBR }).replace(/^\w/, (c) =>
      c.toUpperCase()
    );
  };

  const startText = formatDate(start);
  const endText = formatDate(end);

  if (!startText && !endText) return "";
  return `${startText} - ${endText}`;
}

export default getPeriodDescription;
