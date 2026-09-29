import { collection, getDocs } from "firebase/firestore";

import { ITransaction } from "../../@types/transaction";
import { db } from "../firebase";

async function readAllTransactionsService(
  userId: string
): Promise<ITransaction[]> {
  try {
    const transactionsRef = collection(
      db,
      "nest-egg-users",
      userId,
      "transactions"
    );
    const transactionsSnap = await getDocs(transactionsRef);
    const transactions: ITransaction[] = transactionsSnap.docs.map(
      (doc) => doc.data() as ITransaction
    );
    return transactions;
  } catch (error) {
    console.error("Error reading all transactions:", error);
    throw error;
  }
}

export default readAllTransactionsService;
