import {onSchedule} from "firebase-functions/v2/scheduler";

import {deleteExpiredAccounts} from "../accounts/delete-expired-accounts";

export const cleanUpExpiredAccounts = onSchedule(
  {
    schedule: "every day 03:30",
    timeZone: "America/Sao_Paulo",
    region: "us-central1",
    memory: "256MiB",
  },
  async () => {
    await deleteExpiredAccounts();
  },
);
