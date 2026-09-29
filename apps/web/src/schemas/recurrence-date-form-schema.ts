import { z } from "zod";

import { ids } from "../templates/amount-items-map";
import { weekDaysMap } from "../templates/days-of-the-week-map";
import { timeUnitMap } from "../templates/time-unit-map";

const amountEnum = z.enum(ids as [string, ...string[]]);
const timeUnitEnum = z.enum(
  timeUnitMap.map((unit) => unit.id) as [string, ...string[]]
);
const weekDaysEnum = z.enum(
  weekDaysMap.map((day) => day.id) as [string, ...string[]]
);
const frequencyOrderEnum = z.enum(["day-number", "week-order"]).nullable();

const recurrenceDateFormSchema = z.object({
  startDate: z.date({
    required_error: "Informe a data de início da recorrência.",
    invalid_type_error: "Informe uma data válida.",
  }),
  endDate: z
    .date({ invalid_type_error: "Informe uma data válida." })
    .nullable(),
  amount: amountEnum,
  timeUnit: timeUnitEnum,
  frequency: z.object({
    weekDays: z.array(weekDaysEnum).nullable(),
    order: frequencyOrderEnum,
  }),
});

export type RecurrenceDateFormData = z.infer<typeof recurrenceDateFormSchema>;
export default recurrenceDateFormSchema;
