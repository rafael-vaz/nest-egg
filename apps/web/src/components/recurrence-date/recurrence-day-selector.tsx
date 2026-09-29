import { FrequencyOrder } from "../../@types/recurrence-date";
import { WeekDaysId, weekDaysMap } from "../../templates/days-of-the-week-map";
import Input from "../input/input";
import Label from "../label/label";
import styles from "./recurrence-day-selector.module.css";
import RecurrenceDaySelectorItem from "./recurrence-day-selector-item";

export interface IFrequencyValue {
  weekDays: WeekDaysId[] | null;
  order: FrequencyOrder;
}

interface IRecurrenceOrderDescription {
  dayNumber: string;
  weekOrder: string;
}

interface IRecurrenceDaySelectorProps {
  id: string;
  value?: IFrequencyValue;
  category: string;
  showWeekDaysPicker: boolean;
  weekDaysDescription: string;
  recurrenceOrderDescription: IRecurrenceOrderDescription;
  recurenceOrderFinalDescription: IRecurrenceOrderDescription;
  onChange: (value: IFrequencyValue) => void;
}

const RecurrenceDaySelector = ({
  id,
  value,
  category,
  showWeekDaysPicker,
  weekDaysDescription,
  recurrenceOrderDescription,
  recurenceOrderFinalDescription,
  onChange,
}: IRecurrenceDaySelectorProps) => {
  const weekDays = value?.weekDays ?? null;
  const recurrenceOrder = value?.order ?? null;

  const updateWeekDays = (newWeekDays: WeekDaysId[] | null) => {
    onChange({
      weekDays: newWeekDays,
      order: recurrenceOrder ?? null,
    });
  };

  const updateOrder = (newOrder: FrequencyOrder) => {
    onChange({
      weekDays,
      order: newOrder,
    });
  };

  const recurrenceDaySelectorItems = weekDaysMap.map((day) => {
    const isSelected = !!(weekDays && weekDays.includes(day.id));
    return (
      <RecurrenceDaySelectorItem
        id={day.id}
        value={day.value[0]}
        description={day.value}
        key={day.id}
        isSelected={isSelected}
        setWeekDays={(fn) => {
          let next: WeekDaysId[] | null;
          if (typeof fn === "function") {
            next = fn(weekDays ?? []);
          } else {
            next = fn;
          }
          updateWeekDays(next);
        }}
      />
    );
  });

  const weekDaysPicker = (
    <div className={styles.recurrenceDaySelectorContainer}>
      {showWeekDaysPicker && (
        <>
          <Label id={`${id}-label`} text="Selecionar dias" hasMargin={false} />
          <ul
            id={id}
            aria-labelledby={`${id}-label`}
            role="listbox"
            className={styles.recurrenceDaySelectorList}
          >
            {...recurrenceDaySelectorItems}
          </ul>
        </>
      )}
      <p tabIndex={0} className={styles.recurrenceDaySelectorDescription}>
        {weekDaysDescription}
      </p>
    </div>
  );

  const recurrenceOrderSelector = (
    <div className={styles.recurrenceDaySelectorContainer}>
      <div className={styles.recurrenceOrderSelectorItem}>
        <Input
          id="day-number"
          type="radio"
          name="recurrence-order"
          value="day-number"
          checked={recurrenceOrder === "day-number"}
          onChange={() => updateOrder("day-number")}
          hasNoMargin={true}
          initSize="auto"
        />
        <Label
          htmlFor="day-number"
          text={recurrenceOrderDescription.dayNumber}
          hasMargin={false}
        />
      </div>

      <div className={styles.recurrenceOrderSelectorItem}>
        <Input
          id="week-order"
          type="radio"
          name="recurrence-order"
          value="week-order"
          checked={recurrenceOrder === "week-order"}
          onChange={() => updateOrder("week-order")}
          hasNoMargin={true}
          initSize="auto"
        />
        <Label
          htmlFor="week-order"
          text={recurrenceOrderDescription.weekOrder}
          hasMargin={false}
        />
      </div>

      <p className={styles.recurrenceDaySelectorDescription}>
        {recurrenceOrder === "day-number"
          ? recurenceOrderFinalDescription.dayNumber
          : recurenceOrderFinalDescription.weekOrder}
      </p>
    </div>
  );

  return category === "day" || category === "week"
    ? weekDaysPicker
    : recurrenceOrderSelector;
};

export default RecurrenceDaySelector;
