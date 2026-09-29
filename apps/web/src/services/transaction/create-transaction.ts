import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

import { ITransaction } from "../../@types/transaction";
import { db } from "../firebase";

async function createTransactionService(
  transaction: ITransaction,
  userId: string,
) {
  try {
    const transactionRef = doc(
      db,
      "nest-egg-users",
      userId,
      "transactions",
      transaction.id,
    );
    await setDoc(transactionRef, transaction);
    console.log("Successfully created transaction!");
    toast.success("Transação criada com sucesso!");
  } catch (error) {
    console.error("Error when creating transaction:", error);
    toast.error("Falha ao criar transação!");
    throw error;
  }
}

export default createTransactionService;
