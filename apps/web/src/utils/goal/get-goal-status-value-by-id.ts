import { GoalStatus } from "../../@types/goal";
import goalStatusMap from "../../templates/goal-status-map";

function getGoalStatusValueById(id: GoalStatus) {
  return goalStatusMap.find((item) => item.id === id)?.value;
}

export default getGoalStatusValueById;
