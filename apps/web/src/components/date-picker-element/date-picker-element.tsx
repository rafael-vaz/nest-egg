import { CircleArrowLeft, CircleArrowRight } from "lucide-react";
import React from "react";
import DatePicker from "react-datepicker";

import { localeName } from "../../utils/date/date-picker-locale";
import formatDateInput from "../../utils/date/format-date-input";
import formatDateRangeInput from "../../utils/date/format-date-range-input";
import InputWarningText from "../input/input-warning-text";
import Label from "../label/label";
import styles from "./date-picker-element.module.css";

interface IDatePickerElementProps {
  id: string;
  label?: string;
  className?: string;
  placeholder?: string;
  isRequired?: false;
  hasNoMargin?: boolean;
  disabled?: boolean;
  value?: Date | null;
  error?: string | null | undefined;
  isClearable?: boolean;
  minDate?: Date;
  dateRange?: [Date | null, Date | null] | null;
  hasRange?: boolean;
  onChange?: (value: Date | [Date | null, Date | null] | null) => void;
}

type onChangeRawParams =
  | React.MouseEvent<HTMLElement, MouseEvent>
  | React.KeyboardEvent<HTMLElement>
  | undefined;

const DatePickerElement = ({
  id,
  label,
  className = "",
  placeholder,
  isRequired,
  hasNoMargin = false,
  disabled = false,
  error,
  value = null,
  minDate,
  isClearable = true,
  dateRange = null,
  hasRange = false,
  onChange,
}: IDatePickerElementProps) => {
  const datepickerRef = React.useRef<DatePicker>(null);
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(value);
  const [errorState, setErrorState] = React.useState(error);
  const [selectedStartDate, setSelectedStartDate] = React.useState<Date | null>(
    dateRange?.[0] ?? null,
  );
  const [selectedEndDate, setSelectedEndDate] = React.useState<Date | null>(
    dateRange?.[1] ?? null,
  );
  const defaultPlaceholder = hasRange
    ? "dd/mm/aaaa - dd/mm/aaaa"
    : "dd/mm/aaaa";

  React.useEffect(() => {
    if (hasRange) {
      if (!dateRange) {
        // limpa intervalo
        setSelectedStartDate(null);
        setSelectedEndDate(null);
        setSelectedDate(null);
      } else {
        setSelectedStartDate(dateRange[0]);
        setSelectedEndDate(dateRange[1]);
        setSelectedDate(dateRange[0]);
      }
    } else {
      if (!value) {
        // limpa data única
        setSelectedDate(null);
      } else {
        setSelectedDate(value);
      }
    }
  }, [value, dateRange, hasRange]);

  const calendarIcon = React.useMemo(
    () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke={disabled ? "#767587" : "#836fff"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8 2v4" />
        <path d="M16 2v4" />
        <rect width="18" height="18" x="3" y="4" rx="2" />
        <path d="M3 10h18" />
        <path d="M8 14h.01" />
        <path d="M12 14h.01" />
        <path d="M16 14h.01" />
        <path d="M8 18h.01" />
        <path d="M12 18h.01" />
        <path d="M16 18h.01" />
      </svg>
    ),
    [disabled],
  );

  const handleRawInput = (e: onChangeRawParams) => {
    if (e) {
      const input = e.target as HTMLInputElement;
      if (input.value)
        input.value = hasRange
          ? formatDateRangeInput(input.value)
          : formatDateInput(input.value);
    }
  };

  React.useEffect(() => {
    setErrorState(error);
  }, [error]);

  return (
    <div
      className={`${styles.datePickerContainer} ${
        hasNoMargin ? styles.hasNoMargin : ""
      }`}
    >
      {label && <Label htmlFor={id} text={label} isRequired={isRequired} />}
      {/* @ts-expect-error - resolve conflict between selectsRange and selectsMultiple props */}
      <DatePicker
        id={id}
        className={`${styles.datePickerElement} ${className}`}
        selected={selectedDate}
        onChange={(date: Date | [Date | null, Date | null] | null) => {
          if (hasRange && Array.isArray(date)) {
            const [start, end] = date;
            setSelectedDate(start);
            setSelectedStartDate(start);
            setSelectedEndDate(end);
          } else if (date instanceof Date || date === null) {
            setSelectedDate(date);
          }
          onChange?.(date);
        }}
        minDate={minDate}
        disabled={disabled}
        dateFormat="dd/MM/yyyy"
        placeholderText={placeholder ?? defaultPlaceholder}
        autoComplete="off"
        onChangeRaw={handleRawInput}
        shouldCloseOnSelect={true}
        locale={localeName}
        ref={datepickerRef}
        showIcon
        icon={calendarIcon}
        isClearable={isClearable}
        renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
          <div className={styles.datePickerElementHead}>
            <button
              className={styles.datePickerElementHeadButton}
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                decreaseMonth();
              }}
              title="Mês anterior"
              disabled={
                minDate
                  ? date.getFullYear() <= minDate.getFullYear() &&
                    date.getMonth() <= minDate.getMonth()
                  : false
              }
            >
              <CircleArrowLeft size={18} />
            </button>
            <h3 className={styles.datePickerElementHeadTitle}>
              {date.toLocaleDateString("pt-BR", {
                month: "long",
                year: "numeric",
              })}
            </h3>
            <button
              className={styles.datePickerElementHeadButton}
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                increaseMonth();
              }}
              title="Próximo mês"
            >
              <CircleArrowRight size={18} />
            </button>
          </div>
        )}
        {...(hasRange && {
          selectsRange: true,
          startDate: selectedStartDate,
          endDate: selectedEndDate,
        })}
      />
      {errorState && <InputWarningText type="error" text={errorState} />}
    </div>
  );
};

export default DatePickerElement;
