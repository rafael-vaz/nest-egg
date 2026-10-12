import { formatDate, IMonthRange } from "./get-last-months-ranges";
import parseLocalDate from "./parse-local-date";

function getMonthRangesBetween(
  startDate: string,
  endDate: string,
): IMonthRange[] {
  const parsedStart = parseLocalDate(startDate);
  const parsedEnd = parseLocalDate(endDate);
  const [from, to] =
    parsedStart <= parsedEnd ? [parsedStart, parsedEnd] : [parsedEnd, parsedStart];

  const ranges: IMonthRange[] = [];
  let year = from.getFullYear();
  let month = from.getMonth();

  while (
    year < to.getFullYear() ||
    (year === to.getFullYear() && month <= to.getMonth())
  ) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    ranges.push({
      label: new Intl.DateTimeFormat("pt-BR", { month: "short" }).format(
        firstDay,
      ),
      firstDay: formatDate(firstDay),
      lastDay: formatDate(lastDay),
    });

    month++;
    if (month > 11) {
      month = 0;
      year++;
    }
  }

  return ranges;
}

export default getMonthRangesBetween;
