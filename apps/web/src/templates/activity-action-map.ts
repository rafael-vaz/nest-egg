import { ActivityAction } from "../utils/activity/get-activity-action-by-type";

export interface IActivityAction {
  id: ActivityAction;
  value: string;
}

const activityActionMap: IActivityAction[] = [
  { id: "created", value: "Criações" },
  { id: "updated", value: "Edições" },
  { id: "deleted", value: "Exclusões" },
];

export default activityActionMap;
