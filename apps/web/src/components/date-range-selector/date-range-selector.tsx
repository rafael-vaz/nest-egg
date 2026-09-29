import DatePickerElement from "../date-picker-element/date-picker-element";
import styles from "./date-range-selector.module.css";

interface IDateRangeSelectorProps {
  id: string;
  value?: [Date | null, Date | null] | null;
  label?: string;
  hasNoMargin?: boolean;
  onChange?: (value: Date | [Date | null, Date | null] | null) => void;
}

const DateRangeSelector = ({
  id,
  value,
  label,
  hasNoMargin = false,
  onChange,
}: IDateRangeSelectorProps) => {
  return (
    <DatePickerElement
      label={label}
      id={`${id}-datepicker`}
      hasRange={true}
      placeholder="Selecione um prazo"
      dateRange={value}
      onChange={onChange}
      hasNoMargin={hasNoMargin}
      className={styles.dateRangeSelector}
    />
  );
};

export default DateRangeSelector;
