import { WeekDaysId, weekDaysMap } from "../../templates/days-of-the-week-map";

export function sortWeekDays(days: WeekDaysId[]): WeekDaysId[] {
  const order = weekDaysMap.map((day) => day.id);
  return [...days].sort((a, b) => order.indexOf(a) - order.indexOf(b));
}
