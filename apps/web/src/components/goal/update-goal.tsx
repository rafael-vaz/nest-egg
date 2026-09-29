import React from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import { IGoal } from "../../@types/goal";
import { RootState } from "../../store/configure-store";
import ModalHeader from "../modal/modal-header";
import GoalForm from "./goal-form";

interface IUpdateGoalProps {
  goalId: string;
  onClose: () => void;
}

const UpdateGoal = ({ goalId, onClose }: IUpdateGoalProps) => {
  const { collections, goals, loading } = useSelector(
    (state: RootState) => state.userFinances,
  );
  const [value, setValue] = React.useState<null | IGoal>(null);

  const goal = goals.find((goal) => goal.id === goalId) as IGoal;

  React.useEffect(() => {
    if (!loading) {
      if (!goal) {
        toast.error("Meta não econtrada.");
        onClose();
      } else {
        setValue({
          ...goal,
          collection: goal?.collection
            ? collections.find(
                (collection) => collection.id === goal.collection?.id,
              )!
            : null,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return (
    value && (
      <>
        <ModalHeader title="Editar meta" onClose={onClose} />
        <GoalForm actionType="update" value={value} onClose={onClose} />
      </>
    )
  );
};

export default UpdateGoal;
