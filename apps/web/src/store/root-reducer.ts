import { combineReducers } from "@reduxjs/toolkit";

import activityData from "./reducers/activity/activity-data";
import announcement from "./reducers/announcement/announcement-data.tsx";
import collectionData from "./reducers/collection/collection-data";
import goalData from "./reducers/goal/goal-data";
import confirmationModal from "./reducers/modal/confirmation-modal";
import modal from "./reducers/modal/modal";
import recurrenceDate from "./reducers/recurrence-date/recurrence-date";
import toolMenu from "./reducers/tool-menu/tool-menu";
import transactionData from "./reducers/transaction/transaction-data";
import userAuth from "./reducers/user/user-auth";
import userData from "./reducers/user/user-data";
import userFile from "./reducers/user/user-file";
import userFinances from "./reducers/user/user-finances";

const reducer = combineReducers({
  userAuth,
  userData,
  userFile,
  userFinances,
  goalData,
  transactionData,
  collectionData,
  activityData,
  modal,
  confirmationModal,
  announcement,
  recurrenceDate,
  toolMenu,
});
export default reducer;
