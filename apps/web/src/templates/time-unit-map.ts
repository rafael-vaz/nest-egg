type TimeUnitId = "day" | "week" | "month" | "year";

export interface ITimeUnit {
  id: TimeUnitId;
  value: string;
}

export const timeUnitMap: ITimeUnit[] = [
  { id: "day", value: "Dia" },
  { id: "week", value: "Semana" },
  { id: "month", value: "Mês" },
  { id: "year", value: "Ano" },
];

export const timeUnitPluralMap: ITimeUnit[] = [
  { id: "day", value: "Dias" },
  { id: "week", value: "Semanas" },
  { id: "month", value: "Mêses" },
  { id: "year", value: "Anos" },
];
