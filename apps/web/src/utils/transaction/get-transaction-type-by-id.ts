import transactionTypesMap, {
  TransactionOptionType,
} from "../../templates/transaction-type-map";

function getTransactionTypeById(type: TransactionOptionType) {
  return transactionTypesMap.find((item) => item.id === type)?.value;
}

export default getTransactionTypeById;
