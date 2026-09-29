import { zodResolver } from "@hookform/resolvers/zod";
import { getDay, getMonth } from "date-fns";
import { CircleMinus, Trash } from "lucide-react";
import React from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "react-toastify";

import { IRecurrenceDate } from "../../@types/recurrence-date";
import recurrenceDateFormSchema, {
  RecurrenceDateFormData,
} from "../../schemas/recurrence-date-form-schema";
import { useAppDispatch } from "../../store/configure-store";
import { clearRecurrence } from "../../store/reducers/recurrence-date/recurrence-date";
import { AmountItemsMap } from "../../templates/amount-items-map";
import { WeekDaysId, weekDaysMap } from "../../templates/days-of-the-week-map";
import { monthsMap } from "../../templates/months-map";
import { timeUnitMap, timeUnitPluralMap } from "../../templates/time-unit-map";
import formatDefaultDate from "../../utils/date/format-default-date";
import getOrdinalWeekdayOfMonth from "../../utils/date/get-ordinal-week-day-of-month";
import { translateWeekDays } from "../../utils/date/translate-week-days";
import Button from "../button/button";
import DatePickerElement from "../date-picker-element/date-picker-element";
import GridContainer from "../grid-container/grid-container";
import Label from "../label/label";
import Select from "../select/select";
import Subtitle from "../subtitle/subtitle";
import timeUnitStyles from "./recurrence-date-selector-time-unit.module.css";
import RecurrenceDateSubmitButton from "./recurrence-date-submit-button";
import RecurrenceDaySelector, {
  IFrequencyValue,
} from "./recurrence-day-selector";

interface IRecurrenceDateFormProps {
  value?: IRecurrenceDate | null;
  onClose: () => void;
}

const RecurrenceDateForm = ({ value, onClose }: IRecurrenceDateFormProps) => {
  const dispatch = useAppDispatch();
  const currentDay = weekDaysMap[getDay(new Date())].id as WeekDaysId;
  const [activeWeekDaysPicker, setActiveWeekDaysPicker] = React.useState(true);
  const defaultValues = React.useMemo(
    () => ({
      ...value,
      startDate: value?.startDate ? new Date(value?.startDate) : new Date(),
      endDate: value?.endDate ? new Date(value?.endDate) : null,
      amount: value?.frequency?.rate?.toString() ?? "1",
      timeUnit: value?.frequency?.category ?? "day",
      frequency: {
        weekDays: value?.frequency?.weekDays ?? [currentDay],
        order: value?.frequency?.order ?? null,
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [value],
  );

  const { handleSubmit, reset, watch, setValue, getValues, control } =
    useForm<RecurrenceDateFormData>({
      resolver: zodResolver(recurrenceDateFormSchema),
      defaultValues,
    });

  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const amount = watch("amount");
  const category = watch("timeUnit");
  const weekDays = useWatch({ control, name: "frequency.weekDays" });
  const recurrenceOrder = useWatch({ control, name: "frequency.order" });

  const currentMonthName = monthsMap[getMonth(startDate)].value;
  const currentDayName = weekDaysMap[getDay(startDate)].value;
  const currentDayNumber = startDate.getDate();
  const currentWeekOrder = getOrdinalWeekdayOfMonth(startDate);
  const prevStartDayRef = React.useRef(
    weekDaysMap[getDay(startDate)].id as WeekDaysId,
  );

  const timeUnitGroups = React.useMemo(() => {
    return [
      {
        children: Number(amount) > 1 ? timeUnitPluralMap : timeUnitMap,
      },
    ];
  }, [amount]);

  function getTranslateWeekDays(): string {
    if (weekDays && weekDays.length > 0) {
      const translated = translateWeekDays(weekDays as WeekDaysId[]);
      return translated.length === 1
        ? translated[0]
        : translated.slice(0, -1).join(", ") +
            " e " +
            translated[translated.length - 1];
    }
    return "";
  }

  function getRecurrenceDaySelectorDescription(): string {
    let description = "";
    switch (category) {
      case "day":
        description =
          (Number(amount) > 1
            ? `Ocorre a cada ${amount} dias`
            : "Ocorre diariamente") +
          ` ${endDate ? " até " + formatDefaultDate(endDate) : ""}`;
        break;
      case "week":
        description =
          (Number(amount) > 1
            ? `Ocorre a cada ${amount} semanas, às(aos) ${getTranslateWeekDays()}`
            : `Ocorre a cada ${getTranslateWeekDays()}`) +
          ` ${endDate ? " até " + formatDefaultDate(endDate) : ""}`;
        break;
    }
    return description;
  }

  const weekDaysDescription = getRecurrenceDaySelectorDescription();

  const recurrenceOrderDescription = {
    dayNumber:
      category === "month"
        ? `No dia ${currentDayNumber}`
        : `Em ${currentDayNumber} de ${currentMonthName}`,
    weekOrder:
      category === "month"
        ? `No(a) ${currentWeekOrder} ${currentDayName}`
        : `No(a) ${currentWeekOrder} ${currentDayName} de ${currentMonthName}`,
  };

  const recurenceOrderFinalDescription = {
    dayNumber:
      category === "month"
        ? `Ocorre no dia ${currentDayNumber} ${
            Number(amount) > 1 ? `a cada ${amount} meses` : ""
          }`
        : `Ocorre todo(a) ${currentDayNumber} de ${currentMonthName}`,
    weekOrder:
      category === "month"
        ? `Ocorre no(a) ${currentWeekOrder} ${currentDayName} ${
            Number(amount) > 1 ? `a cada ${amount} meses` : ""
          }`
        : `Ocorre todos os anos, na(o) ${currentWeekOrder} ${currentDayName} de ${currentMonthName}`,
  };

  function handleRemoveRecurrence(event: React.MouseEvent) {
    event.preventDefault();
    dispatch(clearRecurrence());
    toast.success("Recorrência removida com sucesso!");
    onClose();
  }

  React.useEffect(() => {
    if (endDate) {
      if (startDate.getTime() > endDate.getTime()) {
        setValue("endDate", null);
      }
    }
  }, [startDate, endDate, setValue]);

  const prevCategory = React.useRef(category);

  const firstRender = React.useRef(true);

  React.useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const prev = prevCategory.current;
    const userChangedCategory = prev !== category;
    prevCategory.current = category;

    if (!weekDays) return;

    if (userChangedCategory) return;

    if (category === "day" && weekDays.length < 7) {
      if (getValues("timeUnit") !== "week") {
        setValue("timeUnit", "week");
      }
      return;
    }

    if (category === "week" && weekDays.length === 7) {
      if (getValues("timeUnit") !== "day") {
        setValue("timeUnit", "day");
      }
      return;
    }
  }, [category, weekDays, setValue, getValues]);

  React.useEffect(() => {
    if (getValues("timeUnit") !== "week") return;
    if (!weekDays) return;

    if (weekDays.length === 7) {
      const expected = [currentDay];
      const isDifferent = weekDays.length > 1 || weekDays[0] !== expected[0];

      if (isDifferent) {
        setValue("frequency.weekDays", expected);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, weekDays, setValue, getValues]);

  React.useEffect(() => {
    if (category === "year") {
      setValue("amount", "1");
    }
  }, [category, setValue]);

  React.useEffect(() => {
    if (category === "day") {
      if (Number(amount) > 1) {
        setValue("frequency.weekDays", null);
        setActiveWeekDaysPicker(false);
      } else {
        setValue(
          "frequency.weekDays",
          weekDaysMap.map((weekDay) => weekDay.id),
        );
        setActiveWeekDaysPicker(true);
      }
    }
  }, [amount, category, setValue]);

  React.useEffect(() => {
    switch (category) {
      case "day":
        setValue("frequency.order", null);
        break;
      case "week":
        if (weekDays === null) setValue("frequency.weekDays", [currentDay]);
        setValue("frequency.order", null);
        setActiveWeekDaysPicker(true);
        break;
      case "year":
      case "month":
        if (!recurrenceOrder) setValue("frequency.order", "day-number");
        setValue("frequency.weekDays", null);
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, recurrenceOrder, weekDays, setValue]);

  React.useEffect(() => {
    const expected = weekDaysMap[getDay(startDate)].id as WeekDaysId;

    if (!weekDays || weekDays.length !== 1) {
      prevStartDayRef.current = expected;
      return;
    }

    const prevStartDay = prevStartDayRef.current;

    if (weekDays[0] === prevStartDay && weekDays[0] !== expected) {
      setValue("frequency.weekDays", [expected]);
    }

    prevStartDayRef.current = expected;
  }, [startDate, weekDays, setValue]);

  return (
    <form action="#" aria-label="Fomulário para definição de data recorrente">
      <Subtitle text="Repetir" />
      <br />
      <GridContainer columns={2} rowGap={false}>
        <Controller
          name="startDate"
          control={control}
          render={({ field }) => (
            <DatePickerElement
              id="startDate"
              label="Data de início"
              value={field.value}
              onChange={(date) => {
                field.onChange(date);
              }}
              isClearable={false}
            />
          )}
        />

        <Controller
          name="endDate"
          control={control}
          render={({ field }) => (
            <DatePickerElement
              id="endDate"
              label="Data de término"
              isRequired={false}
              value={field.value}
              onChange={(date) => {
                field.onChange(date);
              }}
              minDate={startDate}
            />
          )}
        />
      </GridContainer>

      <div className={timeUnitStyles.recurrenceDateSelectorTimeUnit}>
        <Label text="Repetir a cada:" id="recurrence-date-time-unit-label" />
        <div
          aria-labelledby="recurrence-date-time-unit-label"
          className={timeUnitStyles.recurrenceDateSelectorTimeUnitContent}
        >
          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <Select
                id="amount"
                label="Qtd."
                groups={[{ children: AmountItemsMap }]}
                disabled={category === "year"}
                value={field.value}
                onChange={(value) => {
                  field.onChange(value);
                }}
              />
            )}
          />

          <Controller
            name="timeUnit"
            control={control}
            render={({ field }) => (
              <Select
                id="timeUnit"
                label="Unidade de tempo"
                groups={timeUnitGroups}
                value={field.value}
                onChange={(value) => {
                  field.onChange(value);
                }}
              />
            )}
          />
        </div>
      </div>

      <Controller
        key={category} // força recriação quando categoria muda
        name="frequency"
        control={control}
        render={({ field }) => (
          <RecurrenceDaySelector
            id="frequency"
            value={field.value as IFrequencyValue}
            category={category}
            showWeekDaysPicker={activeWeekDaysPicker}
            weekDaysDescription={weekDaysDescription}
            recurrenceOrderDescription={recurrenceOrderDescription}
            recurenceOrderFinalDescription={recurenceOrderFinalDescription}
            onChange={(value) => {
              field.onChange(value);
            }}
          />
        )}
      />

      <GridContainer columns={3}>
        <RecurrenceDateSubmitButton
          handleSubmit={handleSubmit}
          reset={reset}
          onClose={onClose}
        />
        <Button
          size="fill"
          text="Descartar"
          icon={CircleMinus}
          color="light-gray"
          aria-label="Descartar recorrência"
          onClick={(event) => {
            event.preventDefault();
            onClose();
          }}
        />
        <Button
          size="fill"
          text="Remover"
          icon={Trash}
          color="light-gray"
          aria-label="Remover recorrência"
          disabled={!value?.frequency}
          onClick={handleRemoveRecurrence}
        />
      </GridContainer>
    </form>
  );
};

export default RecurrenceDateForm;
