import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

import { ITransaction } from "../../@types/transaction";
import { db } from "../firebase";

async function updateTransactionService(
  transaction: Partial<ITransaction> & { id: string },
  userId: string,
  hasAlert: boolean = true,
) {
  try {
    const transactionRef = doc(
      db,
      "nest-egg-users",
      userId,
      "transactions",
      transaction.id,
    );
    await setDoc(transactionRef, transaction, { merge: true });
    console.log("Transaction updated successfully!");
    if (hasAlert) {
      toast.success("Transação atualizada com sucesso!");
    }
  } catch (error) {
    console.error("Error updating transaction:", error);
    toast.error("Falha ao atualizar transação!");
    throw error;
  }
}

export default updateTransactionService;
