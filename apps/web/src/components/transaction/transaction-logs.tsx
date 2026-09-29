import { ITransactionOccurrenceLog } from "../../@types/transaction";
import formatShortDate from "../../utils/date/format-short-date";
import sortByKey from "../../utils/sort-by-key";
import formatCurrency from "../../utils/text/format-currency";
import Label from "../label/label";
import styles from "./transaction-logs.module.css";

interface ITransactionLogs {
  occurrenceLogs: ITransactionOccurrenceLog[];
}

const TransactionLogs = ({ occurrenceLogs }: ITransactionLogs) => {
  const orderedLogs = sortByKey<ITransactionOccurrenceLog>(
    occurrenceLogs,
    "date",
    true,
  ).reverse();
  return (
    <div className={styles.transactionLogsContainer}>
      <Label id="transaction-logs-label" text="Registro de ocorrências" />
      <div
        className={`${styles.transactionLogs} smoothScrollbar`}
        aria-labelledby="transaction-logs-label"
      >
        {orderedLogs?.length > 0 ? (
          <ul className={styles.transactionLogsList}>
            {orderedLogs.map((log) => {
              return (
                <li className={styles.transactionLogsItem} key={log.id}>
                  <span>{log.id}</span>
                  <ul>
                    <li>{formatShortDate(new Date(log.date))}</li>
                    <li data-type={log.type}>
                      {log.type === "debt" ? "-" : "+"}{" "}
                      {formatCurrency(`${log.value}`, true)}
                    </li>
                  </ul>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className={styles.transactionEmptyLogs}>
            Nenhuma ocorrência encontrada.
          </p>
        )}
      </div>
    </div>
  );
};

export default TransactionLogs;
