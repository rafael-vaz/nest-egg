import { useAppDispatch } from "../../store/configure-store";
import { clearRecurrence } from "../../store/reducers/recurrence-date/recurrence-date";
import ModalHeader from "../modal/modal-header";
import CreateTransactionForm from "./transaction-form";

interface ICreateTransactionProps {
  onClose: () => void;
}

const CreateTransaction = ({ onClose }: ICreateTransactionProps) => {
  const dispatch = useAppDispatch();

  function handleClose() {
    dispatch(clearRecurrence());
    onClose();
  }

  return (
    <>
      <ModalHeader title="Nova transação" onClose={handleClose} />
      <CreateTransactionForm onClose={handleClose} />
    </>
  );
};

export default CreateTransaction;
