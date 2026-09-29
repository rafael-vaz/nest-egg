import { Circle, CircleCheckBig, Tag } from "lucide-react";
import React from "react";

import { IGoal } from "../../@types/goal/index.ts";
import { useAppDispatch } from "../../store/configure-store.ts";
import { clearAndSetAnnouncementContent } from "../../store/reducers/announcement/announcement-data.tsx";
import getGoalStatusValueById from "../../utils/goal/get-goal-status-value-by-id.ts";
import formatCurrency from "../../utils/text/format-currency.ts";
import Button from "../button/button.tsx";
import styles from "./goal-selector-add-list-item.module.css";

interface IGoalSelectorAddListItemProps
  extends React.LiHTMLAttributes<HTMLLIElement> {
  goal: IGoal;
  isSelected: boolean;
  setSelectedGoals: React.Dispatch<React.SetStateAction<IGoal[] | null>>;
}

const GoalSelectorAddListItem = ({
  goal,
  isSelected,
  setSelectedGoals,
}: IGoalSelectorAddListItemProps) => {
  const dispatch = useAppDispatch();
  const selectionButtonDescription = `${
    isSelected ? "Remover" : "Adicionar"
  } meta`;

  function handleClick(event: React.MouseEvent) {
    event.preventDefault();
    setSelectedGoals((state) => {
      const selectedGoal = goal;
      if (state) {
        if (isSelected) {
          dispatch(
            clearAndSetAnnouncementContent(`Meta ${selectedGoal.name} removida`)
          );
          if (state.length === 1) return null;
          return state.filter((selectedGoal) => selectedGoal.id !== goal.id);
        } else {
          dispatch(
            clearAndSetAnnouncementContent(
              `Meta ${selectedGoal.name} adicionada`
            )
          );
          return [...state, selectedGoal];
        }
      } else {
        dispatch(
          clearAndSetAnnouncementContent(`Meta ${selectedGoal.name} adicionada`)
        );
        return [selectedGoal];
      }
    });
  }

  return (
    <li
      id={goal.id}
      className={styles.goalSelectorAddListItem}
      aria-selected={isSelected}
      data-selected={isSelected}
      role="option"
      tabIndex={0}
      onClick={handleClick}
    >
      <span
        title={`${getGoalStatusValueById(goal.status)}`}
        aria-label={`${getGoalStatusValueById(goal.status)}`}
        data-status={goal.status}
        className={styles.goalSelectorAddListItemStatus}
      >
        <Tag size={16} />
      </span>
      <div className={styles.goalSelectorAddListItemContent}>
        <p className={styles.goalSelectorAddListItemName}>{goal.name}</p>
        <p className={styles.goalSelectorAddListItemValue}>
          {formatCurrency(`${goal.value}`)}
        </p>
      </div>
      <Button
        size="small"
        color="transparent"
        data-selected={isSelected}
        icon={isSelected ? CircleCheckBig : Circle}
        title={selectionButtonDescription}
        aria-label={selectionButtonDescription}
        className={styles.goalSelectorAddListItemSelectionButton}
      />
    </li>
  );
};

export default GoalSelectorAddListItem;
