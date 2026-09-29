import { IRecurrenceDate } from "../../@types/recurrence-date";
import { weekDaysMap } from "../../templates/days-of-the-week-map";
import formatShortDate from "../date/format-short-date";

function getRecurrenceDescription(recurrence: IRecurrenceDate | null): string {
  if (!recurrence || !recurrence.frequency) {
    return "Sem recorrência";
  }

  const { frequency, endDate } = recurrence;
  const { rate, category, weekDays, order } = frequency;

  let description = "";

  switch (category) {
    case "day":
      if (rate === 1) {
        description = "Diariamente";
      } else {
        description = `A cada ${rate} dias`;
      }
      break;

    case "week":
      if (rate === 1) {
        description = `Semanalmente`;
      } else {
        description = `A cada ${rate} semanas`;
      }

      if (weekDays && weekDays.length > 0) {
        const days = weekDays
          .map((dayId) => {
            const day = weekDaysMap.find((d) => d.id === dayId);
            return day?.value;
          })
          .filter(Boolean);

        if (days.length > 0) {
          const daysText =
            days.length === 1
              ? days[0]
              : days.slice(0, -1).join(", ") + " e " + days[days.length - 1];
          description += `, nas(os) ${daysText}`;
        }
      }
      break;

    case "month":
      if (rate === 1) {
        description = "Mensalmente";
      } else {
        description = `A cada ${rate} meses`;
      }

      if (order === "day-number" && weekDays?.[0]) {
        const day = weekDays[0];
        description += `, no dia ${day}`;
      } else if (order === "week-order" && weekDays?.[0]) {
        const dayName = weekDaysMap.find((d) => d.id === weekDays[0])?.value;
        // Aqui você pode adicionar lógica para determinar a ordem da semana se necessário
        description += `, na(o) ${dayName}`;
      }
      break;

    case "year":
      description = "Anualmente";
      if (weekDays?.[0]) {
        const dayName = weekDaysMap.find((d) => d.id === weekDays[0])?.value;
        description += `, na(o) ${dayName}`;
      }
      break;
  }

  if (endDate) {
    description += ` até ${formatShortDate(new Date(endDate))}`;
  }

  return description;
}

export default getRecurrenceDescription;
