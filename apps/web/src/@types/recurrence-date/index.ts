import type { FrequencyCategory, FrequencyOrder } from "@nest-egg/shared-types";

import { WeekDaysId } from "../../templates/days-of-the-week-map";

export type { FrequencyCategory, FrequencyOrder };

export interface IFrequency {
  rate: number;
  category: FrequencyCategory;
  weekDays: WeekDaysId[] | null;
  order: FrequencyOrder;
}

export interface IRecurrenceDate {
  startDate: Date | string;
  endDate: Date | string | null;
  frequency: IFrequency | null;
}

export interface IRecurrenceDateSlice {
  recurrence: IRecurrenceDate | null;
}
