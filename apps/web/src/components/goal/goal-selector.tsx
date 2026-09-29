import React from "react";

import { IGoal } from "../../@types/goal";
import EmptySelection from "../empty-selection/empty-selection";
import InputWarningText from "../input/input-warning-text";
import styles from "./goal-selector.module.css";
import GoalSelectorHeader from "./goal-selector-header";
import GoalSelectorList from "./goal-selector-list";

interface IGoalSelectorProps {
  id: string;
  value: IGoal[] | null;
  error?: string | null | undefined;
  noCollectGoals?: boolean;
  onChange: (value: IGoal[] | null) => void;
}

const GoalSelector = ({
  id,
  error,
  value = null,
  noCollectGoals = false,
  onChange,
}: IGoalSelectorProps) => {
  const [errorState, setErrorState] = React.useState(error);
  const [selectedGoals, setSelectedGoals] = React.useState<IGoal[] | null>(
    value
  );
  const [searchedGoals, setSearchedGoals] = React.useState<IGoal[] | null>(
    null
  );

  React.useEffect(() => {
    onChange(selectedGoals);
    clearError();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onChange, selectedGoals]);

  React.useEffect(() => {
    setErrorState(error);
  }, [error]);

  function clearError() {
    if (error) setErrorState(null);
  }

  return (
    <div id={id} className={styles.goalSelector}>
      <GoalSelectorHeader
        selectedGoals={selectedGoals}
        setSearchedGoals={setSearchedGoals}
        setSelectedGoals={setSelectedGoals}
        noCollectGoals={noCollectGoals}
      />
      {selectedGoals ? (
        <GoalSelectorList
          searchedGoals={searchedGoals}
          setSelectedGoals={setSelectedGoals}
          selectedGoals={selectedGoals}
        />
      ) : (
        <EmptySelection text="Nenhuma meta selecionada." />
      )}
      {errorState && <InputWarningText type="error" text={errorState} />}
    </div>
  );
};

export default GoalSelector;
