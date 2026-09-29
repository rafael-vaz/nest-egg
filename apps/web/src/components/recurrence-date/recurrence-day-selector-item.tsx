import React from "react";

import { useAppDispatch } from "../../store/configure-store";
import { clearAndSetAnnouncementContent } from "../../store/reducers/announcement/announcement-data";
import { WeekDaysId } from "../../templates/days-of-the-week-map";
import { sortWeekDays } from "../../utils/date/sort-week-days";
import styles from "./recurrence-day-selector-item.module.css";

interface IRecurrenceDaySelectorItemProps
  extends React.LiHTMLAttributes<HTMLLIElement> {
  id: WeekDaysId;
  value: string;
  description: string;
  isSelected: boolean;
  setWeekDays: React.Dispatch<React.SetStateAction<WeekDaysId[] | null>>;
}

const RecurrenceDaySelectorItem = ({
  id,
  value,
  description,
  isSelected,
  setWeekDays,
}: IRecurrenceDaySelectorItemProps) => {
  const dispatch = useAppDispatch();

  function selectDays() {
    setWeekDays((state) => {
      if (state) {
        if (isSelected) {
          dispatch(
            clearAndSetAnnouncementContent(`Dia ${description} não selecionado`)
          );

          if (state.length === 1) return [id];

          const updated = state.filter((selectedDay) => selectedDay !== id);
          return sortWeekDays(updated);
        } else {
          dispatch(
            clearAndSetAnnouncementContent(`Dia ${description} selecionado`)
          );

          const updated = [...state, id];
          return sortWeekDays(updated);
        }
      } else {
        dispatch(
          clearAndSetAnnouncementContent(`Dia ${description} selecionado`)
        );
        return [id];
      }
    });
  }

  function handleClick() {
    selectDays();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLLIElement>) {
    if (event.key === "Enter") {
      selectDays();
    }
  }

  return (
    <li
      id={id}
      title={description}
      aria-label={description}
      tabIndex={0}
      data-selected={isSelected}
      aria-selected={isSelected}
      role="option"
      className={styles.recurrenceDaySelectorItem}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {value}
    </li>
  );
};

export default RecurrenceDaySelectorItem;
