import { getFunctions, httpsCallable } from "firebase/functions";
import { CircleCheckBig, Loader } from "lucide-react";
import { UseFormHandleSubmit, UseFormReset } from "react-hook-form";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

import { ITransaction } from "../../@types/transaction";
import { TransactionFormData } from "../../schemas/transaction-form-schema";
import { RootState, useAppDispatch } from "../../store/configure-store";
import {
  createTransactionThunk,
  updateTransactionThunk,
} from "../../store/thunks/transaction/transaction-data";
import createOnError from "../../utils/form/create-on-error";
import Button from "../button/button";

interface ITransactionFormSubmitButton {
  transactionId?: string;
  actionType?: "create" | "update";
  hasAlt: boolean;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmit: UseFormHandleSubmit<TransactionFormData>;
  reset: UseFormReset<TransactionFormData>;
  onClose: () => void;
}

const TransactionFormSubmitButton = ({
  transactionId,
  actionType = "create",
  hasAlt,
  loading,
  setLoading,
  handleSubmit,
  onClose,
}: ITransactionFormSubmitButton) => {
  const functions = getFunctions();
  const processRecurrence = httpsCallable(
    functions,
    "processTransactionRecurrenceManual",
  );
  const { authUser } = useSelector((state: RootState) => state.userAuth);
  const dispatch = useAppDispatch();
  const currentDate = new Date().toISOString();
  const { recurrence } = useSelector(
    (state: RootState) => state.recurrenceDate,
  );
  const actionTypeButtonText = {
    create: {
      default: "Criar transação",
      loading: "Criando transação...",
    },
    update: {
      default: "Salvar alterações",
      loading: "Salvando alterações...",
    },
  };

  async function handleCreateTransaction(data: TransactionFormData) {
    const newTransaction: ITransaction = {
      id: uuidv4(),
      ...data,
      recurrence: recurrence?.frequency ? recurrence : null,
      occurrenceLog: null,
      createdAt: currentDate,
      updatedAt: currentDate,
      date: data.date.toISOString(),
      hasRecurrence: recurrence?.frequency ? true : false,
    };
    try {
      setLoading(true);
      await dispatch(
        createTransactionThunk({
          userId: authUser!.uid,
          transaction: newTransaction,
        }),
      );
      setLoading(false);
      onClose();

      processRecurrence({
        userId: authUser!.uid,
        transactionId: newTransaction.id,
      });
    } catch (error) {
      console.log(`Error when registering transaction: ${error}`);
      setLoading(false);
    }
  }

  async function handleUpdateTransaction(data: TransactionFormData) {
    const updatedTransaction = {
      id: transactionId,
      ...data,
      recurrence: recurrence?.frequency ? recurrence : null,
      description: data.description ? data.description : null,
      date: data.date.toISOString(),
      updatedAt: currentDate,
      occurrenceLog: null,
      hasRecurrence: recurrence?.frequency ? true : false,
    } as ITransaction;

    try {
      setLoading(true);
      await dispatch(
        updateTransactionThunk({
          userId: authUser!.uid,
          transaction: updatedTransaction,
          hasAlert: true,
        }),
      );
      setLoading(false);
      onClose();

      processRecurrence({
        userId: authUser!.uid,
        transactionId: updatedTransaction.id,
      });
    } catch (error) {
      console.log(`Error when updating transaction: ${error}`);
      setLoading(false);
      onClose();
    }
  }

  const onSubmit = async (data: TransactionFormData) => {
    switch (actionType) {
      case "create":
        await handleCreateTransaction(data);
        break;
      case "update":
        await handleUpdateTransaction(data);
        break;
    }
  };

  const onError = createOnError<TransactionFormData>();
  return (
    <Button
      type="submit"
      aria-label={actionTypeButtonText[actionType].default}
      text={
        loading
          ? actionTypeButtonText[actionType].loading
          : actionTypeButtonText[actionType].default
      }
      icon={loading ? Loader : CircleCheckBig}
      disabled={loading || hasAlt}
      size="fill"
      onClick={handleSubmit(onSubmit, onError)}
    />
  );
};

export default TransactionFormSubmitButton;
