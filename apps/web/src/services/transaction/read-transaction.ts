import { doc, getDoc } from "firebase/firestore";

import { ITransaction } from "../../@types/transaction";
import { db } from "../firebase";

async function readTransactionService(
  transactionId: string,
  userId: string
): Promise<ITransaction | null> {
  try {
    const transactionRef = doc(
      db,
      "nest-egg-users",
      userId,
      "transactions",
      transactionId
    );
    const userSnap = await getDoc(transactionRef);

    if (userSnap.exists()) {
      return userSnap.data() as ITransaction;
    } else {
      console.warn("Transaction not found.");
      return null;
    }
  } catch (error) {
    console.error("Error reading transaction:", error);
    throw error;
  }
}

export default readTransactionService;
