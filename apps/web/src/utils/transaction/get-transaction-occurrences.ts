import { ITransaction, TransactionType } from "../../@types/transaction";

export interface ITransactionOccurrence {
  transactionId: string;
  date: Date | string;
  value: number;
  type: TransactionType;
}

function getTransactionOccurrences(
  transactions: ITransaction[],
): ITransactionOccurrence[] {
  return transactions.flatMap((transaction) => {
    if (transaction.occurrenceLog && transaction.occurrenceLog.length > 0) {
      return transaction.occurrenceLog.map((log) => ({
        transactionId: transaction.id,
        date: log.date,
        value: log.value,
        type: log.type,
      }));
    }

    if (!transaction.date) return [];

    return [
      {
        transactionId: transaction.id,
        date: transaction.date,
        value: transaction.value,
        type: transaction.type,
      },
    ];
  });
}

export default getTransactionOccurrences;
