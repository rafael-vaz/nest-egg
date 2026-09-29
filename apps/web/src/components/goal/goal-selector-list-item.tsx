import { Trash } from "lucide-react";

import { IGoal } from "../../@types/goal";
import { useAppDispatch } from "../../store/configure-store";
import { clearAndSetAnnouncementContent } from "../../store/reducers/announcement/announcement-data";
import getGoalStatusValueById from "../../utils/goal/get-goal-status-value-by-id";
import formatCurrency from "../../utils/text/format-currency";
import Button from "../button/button";
import TableDataCell from "../table/table-data-cell";
import TableRow from "../table/table-row";
import styles from "./goal-selector-list-item.module.css";

interface IGoalSelectorListItemProps {
  setSelectedGoals: React.Dispatch<React.SetStateAction<IGoal[] | null>>;
  goal: IGoal;
}

const GoalSelectorListItem = ({
  goal,
  setSelectedGoals,
}: IGoalSelectorListItemProps) => {
  const dispatch = useAppDispatch();
  function handleRemoveItem(goalId: string, goalName: string) {
    setSelectedGoals((state) => {
      if (state) {
        if (state.length === 1) {
          return null;
        } else {
          return state.filter((state) => state.id !== goalId);
        }
      }
      dispatch(clearAndSetAnnouncementContent(`Meta ${goalName} removida`));
      return null;
    });
  }

  return (
    <TableRow key={goal.id}>
      <TableDataCell>{goal.name}</TableDataCell>
      <TableDataCell>{formatCurrency(`${goal.value}`)}</TableDataCell>
      <TableDataCell data-status={goal.status}>
        {getGoalStatusValueById(goal.status)}
      </TableDataCell>
      <TableDataCell>
        <Button
          size="small"
          icon={Trash}
          title="Remover meta"
          aria-label="Remover meta"
          color="light-gray"
          className={styles.goalSelectorListItemRemoveButton}
          onClick={(e) => {
            e.preventDefault();
            handleRemoveItem(goal.id, goal.name);
          }}
        />
      </TableDataCell>
    </TableRow>
  );
};

export default GoalSelectorListItem;
