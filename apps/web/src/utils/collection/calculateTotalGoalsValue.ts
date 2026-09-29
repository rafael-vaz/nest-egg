import { IGoal } from "../../@types/goal";

function calculateTotalGoalsValue(goals: IGoal[]) {
  const total = goals.reduce((acc, goal) => {
    return acc + goal?.value;
  }, 0);
  return total;
}

export default calculateTotalGoalsValue;
