import { Edit, RefreshCcw } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";

import { RootState, useAppDispatch } from "../../store/configure-store";
import { openConfirmationModalState } from "../../store/reducers/modal/confirmation-modal";
import { updateRecurrence } from "../../store/reducers/recurrence-date/recurrence-date";
import Button from "../button/button";
import DatePickerElement from "../date-picker-element/date-picker-element";
import styles from "./recurrence-date.module.css";

interface IRecurrenceDateProps {
  id: string;
  value?: Date | null;
  error?: string | null | undefined;
  active?: boolean;
  onChange: (value: Date | null) => void;
}

const RecurrenceDate = ({
  id,
  value,
  error,
  onChange,
}: IRecurrenceDateProps) => {
  const dispatch = useAppDispatch();
  const { recurrence } = useSelector(
    (state: RootState) => state.recurrenceDate,
  );
  const [activeRecurrence, setActiveRecurrence] = React.useState(
    !!recurrence?.frequency,
  );

  React.useEffect(() => {
    if (recurrence?.frequency) {
      setActiveRecurrence(true);
    } else {
      setActiveRecurrence(false);
    }
  }, [recurrence?.frequency]);

  React.useEffect(() => {
    onChange(new Date(recurrence!.startDate));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recurrence?.startDate]);

  const buttonDescription = `${
    activeRecurrence ? "Desativar" : "Ativar"
  } recorrência`;

  function handleSelectStartDate(value: Date | null) {
    dispatch(updateRecurrence({ startDate: value!.toISOString() }));
    onChange?.(value);
  }

  return (
    <div className={styles.recurrenceDate}>
      <DatePickerElement
        id={id}
        label="Data de ocorrência"
        hasNoMargin={true}
        value={value}
        error={error}
        onChange={(date) => {
          handleSelectStartDate(date as Date | null);
        }}
        isClearable={false}
        disabled={activeRecurrence}
      />
      <Button
        icon={activeRecurrence ? Edit : RefreshCcw}
        aria-label={buttonDescription}
        title={buttonDescription}
        color={activeRecurrence ? "green" : "light-gray"}
        text={activeRecurrence ? "Editar recorrência" : "Tornar recorrente"}
        onClick={(event) => {
          event.preventDefault();
          dispatch(openConfirmationModalState({ id: "set-recurrence-date" }));
        }}
      />
    </div>
  );
};

export default RecurrenceDate;
