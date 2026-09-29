import { Trash } from "lucide-react";
import { motion } from "motion/react";
import React, { ReactNode } from "react";
import { useSelector } from "react-redux";

import { ModalWidth } from "../../@types/modal";
import slideDownVariants from "../../motion/slide-down-variants";
import { RootState, useAppDispatch } from "../../store/configure-store";
import { closeConfirmationModalState } from "../../store/reducers/modal/confirmation-modal";
import { deleteCollectionThunk } from "../../store/thunks/collection/collection-data";
import { deleteGoalThunk } from "../../store/thunks/goal/goal-data";
import { deleteTransactionThunk } from "../../store/thunks/transaction/transaction-data";
import ConfirmAction from "../confirm-action/confirm-action";
import DeleteUserAccountForm from "../delete-user-account-form/delete-user-account-form";
import LoaderBox from "../loader/loader-box";
import RecurrenceDateForm from "../recurrence-date/recurrence-date-form";
import styles from "./modal.module.css";
import ModalBackground from "./modal-background";
import ModalContent from "./modal-content";

const ConfirmationModal = () => {
  const dispatch = useAppDispatch();
  const handleCloseModal = () => dispatch(closeConfirmationModalState());
  const confirmModalRef = React.useRef(null);
  const { authUser } = useSelector((state: RootState) => state.userAuth);
  const { recurrence } = useSelector(
    (state: RootState) => state.recurrenceDate,
  );
  const { id, entity, isOpen, isLoading } = useSelector(
    (state: RootState) => state.confirmationModal,
  );

  interface IConfirmModal {
    content: ReactNode | null;
    width: ModalWidth;
    loadingText: string;
  }

  const confirmModalData: IConfirmModal = {
    content: null,
    width: "small",
    loadingText: "Processando dados...",
  };

  React.useEffect(() => {
    if (confirmModalRef.current && isOpen) {
      const confirmModalElement = confirmModalRef.current as HTMLElement;
      const timeout = setTimeout(() => {
        confirmModalElement.focus();
      }, 200);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [isOpen, id, isLoading]);

  switch (id) {
    case "confirm-remove-user-account":
      confirmModalData.loadingText = "Deletando usuário...";
      confirmModalData.width = "small";
      confirmModalData.content = (
        <DeleteUserAccountForm onClose={handleCloseModal} />
      );
      break;

    case "set-recurrence-date":
      confirmModalData.width = "medium";
      confirmModalData.content = (
        <RecurrenceDateForm value={recurrence} onClose={handleCloseModal} />
      );
      break;
    case "confirm-remove-goal":
      confirmModalData.width = "small";
      confirmModalData.content = (
        <ConfirmAction
          subtitle="Deletar meta"
          text={
            <>
              Deseja realmente excluir a meta <strong>{entity?.name}</strong>?
            </>
          }
          confirmButtonColor="error"
          confirmButtonText="Confirmar"
          confirmCallback={async () => {
            await dispatch(
              deleteGoalThunk({ goalId: entity!.id, userId: authUser!.uid }),
            );
          }}
          confirmButtonIcon={Trash}
        />
      );
      break;
    case "confirm-remove-collection":
      confirmModalData.width = "small";
      confirmModalData.content = (
        <ConfirmAction
          subtitle="Deletar coleção"
          text={
            <>
              Deseja realmente excluir a coleção <strong>{entity?.name}</strong>
              ?
            </>
          }
          confirmButtonColor="error"
          confirmButtonText="Confirmar"
          confirmCallback={async () => {
            await dispatch(
              deleteCollectionThunk({
                collectionId: entity!.id,
                userId: authUser!.uid,
              }),
            );
          }}
          confirmButtonIcon={Trash}
        />
      );
      break;
    case "confirm-remove-transaction":
      confirmModalData.width = "small";
      confirmModalData.content = (
        <ConfirmAction
          subtitle="Deletar transação"
          text={
            <>
              Deseja realmente excluir a transação{" "}
              <strong>{entity?.name}</strong>?
            </>
          }
          confirmButtonColor="error"
          confirmButtonText="Confirmar"
          confirmCallback={async () => {
            await dispatch(
              deleteTransactionThunk({
                transactionId: entity!.id,
                userId: authUser!.uid,
              }),
            );
          }}
          confirmButtonIcon={Trash}
        />
      );
      break;
  }

  return (
    isOpen && (
      <ModalBackground id={`${id}-modal`} category="confirmation">
        <motion.div
          key={id}
          variants={slideDownVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className={`${styles.modalContainer} noVisualFocus`}
          data-size={confirmModalData.width}
          data-loading-state={isLoading}
          data-confirmation-content={true}
          tabIndex={-1}
          aria-modal={true}
          role="dialog"
          ref={confirmModalRef}
        >
          <ModalContent>{confirmModalData.content}</ModalContent>
        </motion.div>
        {isLoading && <LoaderBox text={confirmModalData.loadingText} />}
      </ModalBackground>
    )
  );
};

export default ConfirmationModal;
