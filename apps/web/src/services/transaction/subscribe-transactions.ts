import { collection, onSnapshot, Unsubscribe } from "firebase/firestore";

import { ITransaction } from "../../@types/transaction";
import { db } from "../firebase";

function subscribeToTransactions(
  userId: string,
  onUpdate: (transactions: ITransaction[]) => void,
): Unsubscribe {
  const transactionsRef = collection(
    db,
    "nest-egg-users",
    userId,
    "transactions",
  );

  const unsubscribe = onSnapshot(
    transactionsRef,
    (snapshot) => {
      const transactions: ITransaction[] = snapshot.docs.map(
        (doc) => doc.data() as ITransaction,
      );
      onUpdate(transactions);
    },
    (error) => {
      console.error("Error listening to transactions:", error);
    },
  );

  return unsubscribe;
}

export default subscribeToTransactions;
