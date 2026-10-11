import { TransactionType } from "../../@types/transaction";
import filterOccurrencesByRange from "./filter-occurrences-by-range";
import { ITransactionOccurrence } from "./get-transaction-occurrences";

function sumOccurrencesByType(
  occurrences: ITransactionOccurrence[],
  type: TransactionType,
  firstDay: string,
  lastDay: string,
): number {
  return filterOccurrencesByRange(occurrences, firstDay, lastDay)
    .filter((occurrence) => occurrence.type === type)
    .reduce((total, occurrence) => total + occurrence.value, 0);
}

export default sumOccurrencesByType;
