import { deleteDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";

import { db } from "../firebase";

async function deleteTransactionService(transactionId: string, userId: string) {
  try {
    const transactionRef = doc(
      db,
      "nest-egg-users",
      userId,
      "transactions",
      transactionId,
    );
    await deleteDoc(transactionRef);
    console.log("Transaction deleted successfully!");
    toast.success("Transação removida com sucesso!");
  } catch (error) {
    console.error("Error deleting transaction:", error);
    toast.error("Falha ao remover transação!");
    throw error;
  }
}

export default deleteTransactionService;
