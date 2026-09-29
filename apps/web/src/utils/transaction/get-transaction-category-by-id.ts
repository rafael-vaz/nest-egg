import { TransactionCategoryStatus } from "../../@types/transaction";
import transactionCategoryMap from "../../templates/transaction-category-map";

function getTransactionCategoryById(id: TransactionCategoryStatus) {
  return transactionCategoryMap.find((item) => item.id === id)?.value;
}

export default getTransactionCategoryById;
