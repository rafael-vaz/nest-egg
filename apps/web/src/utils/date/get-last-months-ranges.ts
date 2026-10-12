export interface IMonthRange {
  label: string;
  firstDay: string;
  lastDay: string;
}

export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getLastMonthsRanges(monthsCount: number): IMonthRange[] {
  const now = new Date();
  const ranges: IMonthRange[] = [];

  for (let offset = monthsCount - 1; offset >= 0; offset--) {
    const year = now.getFullYear();
    const month = now.getMonth() - offset;

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    ranges.push({
      label: new Intl.DateTimeFormat("pt-BR", { month: "short" }).format(
        firstDay,
      ),
      firstDay: formatDate(firstDay),
      lastDay: formatDate(lastDay),
    });
  }

  return ranges;
}

export default getLastMonthsRanges;
