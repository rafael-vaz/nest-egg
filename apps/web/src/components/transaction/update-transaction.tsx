import React from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import { ITransaction } from "../../@types/transaction";
import { RootState, useAppDispatch } from "../../store/configure-store";
import { clearRecurrence } from "../../store/reducers/recurrence-date/recurrence-date";
import ModalHeader from "../modal/modal-header";
import TransactionForm from "./transaction-form";

interface IUpdateGoalProps {
  transactionId: string;
  onClose: () => void;
}

const UpdateTransaction = ({ transactionId, onClose }: IUpdateGoalProps) => {
  const { transactions, loading } = useSelector(
    (state: RootState) => state.userFinances,
  );
  const [value, setValue] = React.useState<null | ITransaction>(null);
  const transaction = transactions.find(
    (transaction) => transaction.id === transactionId,
  );

  React.useEffect(() => {
    if (!loading) {
      if (!transaction) {
        toast.error("Transação não encontrada.");
        onClose();
      } else {
        setValue({
          ...transaction,
          date: new Date(transaction.date!),
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const dispatch = useAppDispatch();

  function handleClose() {
    onClose();
    dispatch(clearRecurrence());
  }

  return (
    value && (
      <>
        <ModalHeader title="Editar transação" onClose={handleClose} />
        <TransactionForm
          actionType="update"
          value={value}
          onClose={handleClose}
        />
      </>
    )
  );
};

export default UpdateTransaction;
