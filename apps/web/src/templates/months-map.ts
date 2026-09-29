export type MonthId =
  | "january"
  | "february"
  | "march"
  | "april"
  | "may"
  | "june"
  | "july"
  | "august"
  | "september"
  | "october"
  | "november"
  | "december";

export interface IMonth {
  id: MonthId;
  value: string;
}

export const monthsMap: IMonth[] = [
  { id: "january", value: "Janeiro" },
  { id: "february", value: "Fevereiro" },
  { id: "march", value: "Março" },
  { id: "april", value: "Abril" },
  { id: "may", value: "Maio" },
  { id: "june", value: "Junho" },
  { id: "july", value: "Julho" },
  { id: "august", value: "Agosto" },
  { id: "september", value: "Setembro" },
  { id: "october", value: "Outubro" },
  { id: "november", value: "Novembro" },
  { id: "december", value: "Dezembro" },
];
