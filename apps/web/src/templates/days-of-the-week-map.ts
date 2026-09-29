export type WeekDaysId =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface IWeekDays {
  id: WeekDaysId;
  value: string;
}

export const weekDaysMap: IWeekDays[] = [
  {
    id: "sunday",
    value: "Domingo",
  },
  {
    id: "monday",
    value: "Segunda-feira",
  },
  {
    id: "tuesday",
    value: "Terça-feira",
  },
  {
    id: "wednesday",
    value: "Quarta-feira",
  },
  {
    id: "thursday",
    value: "Quinta-feira",
  },
  {
    id: "friday",
    value: "Sexta-feira",
  },
  {
    id: "saturday",
    value: "Sábado",
  },
];
