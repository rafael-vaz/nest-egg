import { Plus, X } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";

import { IGoal } from "../../@types/goal";
import { RootState, useAppDispatch } from "../../store/configure-store";
import { readAllGoalsThunk } from "../../store/thunks/goal/goal-data";
import sortByKey from "../../utils/sort-by-key";
import Announcement from "../announcement/announcement";
import Button from "../button/button";
import styles from "./goal-selector-add.module.css";
import GoalSelectorAddList from "./goal-selector-add-list";

interface IGoalSelectorAddProps {
  noCollectGoals: boolean;
  selectedGoals: IGoal[] | null;
  setSelectedGoals: React.Dispatch<React.SetStateAction<IGoal[] | null>>;
}

const GoalSelectorAdd = ({
  noCollectGoals,
  selectedGoals,
  setSelectedGoals,
}: IGoalSelectorAddProps) => {
  const dispatch = useAppDispatch();
  const { authUser } = useSelector((state: RootState) => state.userAuth);
  const [active, setActive] = React.useState(false);
  const [goals, setGoals] = React.useState<IGoal[] | null>(null);
  const [accessibilityAnnouncement, setAccessibilityAnnouncement] =
    React.useState("");
  const goalSelectorAddRef = React.useRef(null);

  const buttonDescription = `${
    active ? "Fechar" : "Abrir"
  } menu de seleção de metas`;

  function handleClick(event: React.MouseEvent) {
    event.preventDefault();
    setActive((state) => !state);
  }

  function handleOutsideCLick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (goalSelectorAddRef.current) {
      const goalSelectorAddElement = goalSelectorAddRef.current as HTMLElement;
      if (
        !goalSelectorAddElement.contains(target) ||
        target === goalSelectorAddRef.current
      ) {
        setActive(false);
      }
    }
  }

  function handleOutsideKeyDown(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    if (goalSelectorAddRef.current && event.key === "Enter") {
      const goalSelectorAddElement = goalSelectorAddRef.current as HTMLElement;
      if (!goalSelectorAddElement.contains(target)) {
        setTimeout(() => setActive(false), 100);
      }
    }
  }

  React.useEffect(() => {
    if (!active) return;
    window.document.addEventListener("click", handleOutsideCLick);
    window.document.addEventListener("keydown", handleOutsideKeyDown);
    return () => {
      window.document.removeEventListener("click", handleOutsideCLick);
      window.document.removeEventListener("keydown", handleOutsideKeyDown);
    };
  }, [active]);

  React.useEffect(() => {
    const AnnouncementText = `Menu de seleção de metas ${
      active ? "aberto" : "fechado"
    }`;
    setAccessibilityAnnouncement(AnnouncementText);
  }, [active]);

  React.useEffect(() => {
    async function getGoalsList() {
      const savedGoals = await dispatch(
        readAllGoalsThunk({ userId: authUser!.uid })
      ).unwrap();
      const availableGoals = savedGoals?.filter(
        (goal) => goal.collection === null
      );
      const result = availableGoals?.length ? availableGoals : null;
      if (savedGoals && savedGoals.length > 0) {
        const currentGoals = noCollectGoals ? result : savedGoals;
        setGoals(
          currentGoals ? sortByKey<IGoal>(currentGoals, "name") : currentGoals
        );
      }
    }
    getGoalsList();
  }, [authUser, noCollectGoals, dispatch]);

  return (
    <div className={styles.goalSelectorAdd} ref={goalSelectorAddRef}>
      <Button
        aria-expanded={active}
        aria-haspopup="listbox"
        aria-controls="select-goals-listbox"
        role="combobox"
        size="small"
        title={buttonDescription}
        aria-label={buttonDescription}
        color="purple"
        icon={active ? X : Plus}
        onClick={handleClick}
      />
      {active && (
        <GoalSelectorAddList
          id="select-goals-listbox"
          role="listbox"
          items={goals}
          selectedGoals={selectedGoals}
          setSelectedGoals={setSelectedGoals}
        />
      )}
      <Announcement>{accessibilityAnnouncement}</Announcement>
    </div>
  );
};

export default GoalSelectorAdd;
