import React from "react";

import { IGoal } from "../../@types/goal";
import sortByKey from "../../utils/sort-by-key";
import Table from "../table/table";
import TableBody from "../table/table-body";
import TableHeader from "../table/table-header";
import TableHeaderCell from "../table/table-header-cell";
import TableRow from "../table/table-row";
import GoalSelectorListItem from "./goal-selector-list-item";

interface IGoalSelectorListProps {
  setSelectedGoals: React.Dispatch<React.SetStateAction<IGoal[] | null>>;
  searchedGoals: IGoal[] | null;
  selectedGoals: IGoal[] | null;
}

const GoalSelectorList = ({
  setSelectedGoals,
  searchedGoals,
  selectedGoals,
}: IGoalSelectorListProps) => {
  const [displayedGoals, setDisplayedGoals] = React.useState(selectedGoals);

  React.useEffect(() => {
    setDisplayedGoals(selectedGoals);
  }, [selectedGoals]);

  React.useEffect(() => {
    setDisplayedGoals(searchedGoals ? searchedGoals : selectedGoals);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchedGoals]);

  return (
    <div>
      <Table id="collection-goals-list" aria-label="Metas da coleção">
        <TableHeader>
          <TableRow>
            <TableHeaderCell>{"Nome"}</TableHeaderCell>
            <TableHeaderCell>{"Valor (R$)"}</TableHeaderCell>
            <TableHeaderCell>{"Status"}</TableHeaderCell>
            <TableHeaderCell>{""}</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortByKey<IGoal>(displayedGoals!, "name").map((goal) => (
            <GoalSelectorListItem
              goal={goal}
              key={goal.id}
              setSelectedGoals={setSelectedGoals}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default GoalSelectorList;
