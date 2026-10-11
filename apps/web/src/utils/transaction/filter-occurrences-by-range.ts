import parseLocalDate from "../date/parse-local-date";
import { ITransactionOccurrence } from "./get-transaction-occurrences";

function filterOccurrencesByRange(
  occurrences: ITransactionOccurrence[],
  firstDay: string,
  lastDay: string,
): ITransactionOccurrence[] {
  const rangeStart = parseLocalDate(firstDay).getTime();
  // exclusive upper bound: the instant the day after lastDay begins,
  // so occurrences anywhere within lastDay itself are still included
  const rangeEndExclusive =
    parseLocalDate(lastDay).getTime() + 24 * 60 * 60 * 1000;

  return occurrences.filter((occurrence) => {
    const occurrenceTime = parseLocalDate(occurrence.date).getTime();
    return occurrenceTime >= rangeStart && occurrenceTime < rangeEndExclusive;
  });
}

export default filterOccurrencesByRange;
