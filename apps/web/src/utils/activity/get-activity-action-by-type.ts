import { ActivityType } from "../../@types/activity";

export type ActivityAction = "created" | "updated" | "deleted";

const DELETED_TYPES: ActivityType[] = [
  "transaction.deleted",
  "goal.deleted",
  "collection.deleted",
  "profile.photo_removed",
];
const CREATED_TYPES: ActivityType[] = [
  "transaction.created",
  "goal.created",
  "collection.created",
];

function getActivityActionByType(type: ActivityType): ActivityAction {
  if (DELETED_TYPES.includes(type)) return "deleted";
  if (CREATED_TYPES.includes(type)) return "created";
  return "updated";
}

export default getActivityActionByType;
