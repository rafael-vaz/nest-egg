import { motion } from "motion/react";
import React from "react";

import { IGoal } from "../../@types/goal";
import useSearch from "../../hooks/search/use-search";
import slideDownVariants from "../../motion/slide-down-variants";
import debounce from "../../utils/debounce";
import InputSearch from "../input/input-search";
import GoalSelectorAddEmptyList from "./goal-selector-add-empty-list";
import styles from "./goal-selector-add-list.module.css";
import GoalSelectorAddListItem from "./goal-selector-add-list-item";

interface IGoalSelectorAddListProps {
  id: string;
  role: string;
  items: IGoal[] | null;
  selectedGoals: IGoal[] | null;
  setSelectedGoals: React.Dispatch<React.SetStateAction<IGoal[] | null>>;
}

const GoalSelectorAddList = ({
  id,
  role,
  items,
  selectedGoals,
  setSelectedGoals,
}: IGoalSelectorAddListProps) => {
  const {
    defaultItems,
    setDefaultItems,
    searchResult,
    setSearchResult,
    getSearch,
  } = useSearch<IGoal>();
  const goalSelectorAddListContainerRef = React.useRef(null);
  const searchInputRef = React.useRef(null);
  const debounceGetSearch = debounce(getSearch, 200);
  const [searchedGoals, setSearchedGoals] = React.useState<IGoal[] | null>(
    items
  );

  function handleSearch(event: React.ChangeEvent) {
    const target = event.target as HTMLInputElement;
    const searchTerm = target.value;
    if (searchTerm) {
      debounceGetSearch(searchTerm, ["name"]);
    } else {
      setSearchResult(null);
    }
  }

  React.useEffect(() => {
    if (searchResult) {
      setSearchedGoals(searchResult);
    } else {
      setSearchedGoals(defaultItems);
    }
  }, [searchResult, defaultItems]);

  React.useEffect(() => {
    setDefaultItems(items);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (goalSelectorAddListContainerRef.current) {
      const goalSelectorAddListContainerElement =
        goalSelectorAddListContainerRef.current as HTMLDivElement;
      goalSelectorAddListContainerElement.focus();
    }
  }, []);

  return (
    <motion.div
      id={id}
      role={role}
      key={id}
      variants={slideDownVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={styles.goalSelectorAddListContainer}
      ref={goalSelectorAddListContainerRef}
      aria-label="Menu de seleção de metas"
      tabIndex={0}
    >
      {searchedGoals ? (
        <>
          <InputSearch
            id="goal-selector-add-list-search"
            placeholder="Buscar meta"
            hasNoMargin={true}
            className={styles.goalSelectorAddListSearch}
            onChange={handleSearch}
            ref={searchInputRef}
          />
          <ul className={`${styles.goalSelectorAddList} smoothScrollbar`}>
            {searchedGoals?.map((goal) => {
              const isSelected =
                selectedGoals?.some(
                  (selectedGoal) => selectedGoal.id === goal.id
                ) ?? false;
              return (
                <GoalSelectorAddListItem
                  goal={goal}
                  key={goal.id}
                  setSelectedGoals={setSelectedGoals}
                  isSelected={isSelected}
                />
              );
            })}
          </ul>
        </>
      ) : (
        <GoalSelectorAddEmptyList />
      )}
    </motion.div>
  );
};

export default GoalSelectorAddList;
