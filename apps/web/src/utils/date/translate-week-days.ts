import { WeekDaysId, weekDaysMap } from "../../templates/days-of-the-week-map";

export function translateWeekDays(ids: WeekDaysId[]): string[] {
  return ids.map((id) => {
    const match = weekDaysMap.find((day) => day.id === id);
    return match ? match.value : id;
  });
}
