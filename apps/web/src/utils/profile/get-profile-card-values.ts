import { ICollection } from "../../@types/collection";
import { IGoal } from "../../@types/goal";
import { ITransaction } from "../../@types/transaction";

interface IProfileFinances {
  goals: IGoal[];
  collections: ICollection[];
  transactions: ITransaction[];
}

function getProfileCardValues({
  goals,
  collections,
  transactions,
}: IProfileFinances): Record<string, number> {
  return {
    "completed-goals": goals.filter((goal) => goal.status === "completed")
      .length,
    "recurrence-transactions": transactions.filter(
      (transaction) => transaction.hasRecurrence,
    ).length,
    "amount-goals": goals.length,
    "amount-collections": collections.length,
  };
}

export default getProfileCardValues;
