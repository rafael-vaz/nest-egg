import { ITransactionOccurrenceLog } from "../../@types/transaction";

function getLatestOccurrenceDate(logs: ITransactionOccurrenceLog[]): Date {
  let latest = new Date(logs[0].date);
  for (const occurrence of logs) {
    const current = new Date(occurrence.date);

    if (current > latest) {
      latest = current;
    }
  }

  return latest;
}

export default getLatestOccurrenceDate;
