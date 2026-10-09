import { motion } from "motion/react";
import { ReactNode } from "react";
import React from "react";
import { useSelector } from "react-redux";

import { ModalWidth } from "../../@types/modal";
import {
  useFiltersQueryParams,
  useModalQueryParam,
} from "../../hooks/search/use-query-params";
import slideDownVariants from "../../motion/slide-down-variants";
import { RootState, useAppDispatch } from "../../store/configure-store";
import { closeModalState } from "../../store/reducers/modal/modal";
import Activities from "../activities/activities";
import Calculator from "../calculator/calculator";
import CreateCollection from "../collection/create-collection";
import UpdateCollection from "../collection/update-collection";
import CreationMenu from "../creation-menu/creation-menu";
import CreateGoal from "../goal/create-goal";
import UpdateGoal from "../goal/update-goal";
import LoaderBox from "../loader/loader-box";
import Profile from "../profile/profile";
import CreateTransaction from "../transaction/create-transaction";
import UpdateTransaction from "../transaction/update-transaction";
import styles from "./modal.module.css";
import ModalBackground from "./modal-background";
import ModalContent from "./modal-content";

interface IModal {
  content: ReactNode | null;
  width: ModalWidth;
  loadingText: string;
}

const Modal = () => {
  const { openModal, closeModal } = useModalQueryParam();
  const { setFilters } = useFiltersQueryParams();
  const dispatch = useAppDispatch();
  const modalRef = React.useRef(null);
  const { loading } = useSelector((state: RootState) => state.userFinances);
  const { id, entity, isOpen, isLoading } = useSelector(
    (state: RootState) => state.modal,
  );
  const confirmationModal = useSelector(
    (state: RootState) => state.confirmationModal,
  );

  const handleCloseModal = () => {
    dispatch(closeModalState());
    if (id?.includes("update")) setFilters({ id: null });
  };
  const modalData: IModal = {
    content: null,
    width: "large",
    loadingText: "Processando dados...",
  };

  switch (id) {
    case "calculator":
      modalData.width = "small";
      modalData.content = <Calculator onClose={handleCloseModal} />;
      break;
    case "profile":
      modalData.width = "medium";
      modalData.content = <Profile onClose={handleCloseModal} />;
      modalData.loadingText = "Carregando informações do perfil...";
      break;
    case "create":
      modalData.width = "small";
      modalData.content = <CreationMenu onClose={handleCloseModal} />;
      break;
    case "new-goal":
      modalData.width = "medium";
      modalData.content = <CreateGoal onClose={handleCloseModal} />;
      break;
    case "update-goal":
      modalData.width = "medium";
      modalData.content = (
        <UpdateGoal goalId={entity!} onClose={handleCloseModal} />
      );
      break;
    case "new-collection":
      modalData.width = "medium";
      modalData.content = <CreateCollection onClose={handleCloseModal} />;
      break;
    case "update-collection":
      modalData.width = "medium";
      modalData.content = (
        <UpdateCollection collectionId={entity!} onClose={handleCloseModal} />
      );
      break;
    case "new-transaction":
      modalData.width = "medium";
      modalData.content = <CreateTransaction onClose={handleCloseModal} />;
      break;
    case "update-transaction":
      modalData.width = "medium";
      modalData.content = (
        <UpdateTransaction transactionId={entity!} onClose={handleCloseModal} />
      );
      break;
    case "activities":
      modalData.width = "medium";
      modalData.content = <Activities onClose={handleCloseModal} />;
      break;
  }

  React.useEffect(() => {
    if (modalRef.current && isOpen && id) {
      openModal(id);
      if (entity) setFilters({ id: entity });
      const modalElement = modalRef.current as HTMLElement;
      const timeout = setTimeout(() => {
        modalElement.focus();
      }, 200);
      return () => {
        clearTimeout(timeout);
        closeModal();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, id, isLoading]);

  React.useEffect(() => {
    if (!modalRef.current) return;
    const mainContentElement = modalRef.current as HTMLElement;
    if (!confirmationModal.isOpen) {
      mainContentElement.removeAttribute("inert");
      mainContentElement.focus();
    } else {
      mainContentElement.setAttribute("inert", "");
    }
    return () => {
      mainContentElement.removeAttribute("inert");
    };
  }, [confirmationModal.isOpen]);

  const isCalculator = id === "calculator";

  return (
    isOpen && (
      <ModalBackground id={`${id}-modal`}>
        <motion.div
          key={id}
          variants={slideDownVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className={`${styles.modalContainer} noVisualFocus`}
          data-size={modalData.width}
          data-loading-state={isLoading || loading}
          tabIndex={-1}
          aria-modal={true}
          role="dialog"
          ref={modalRef}
        >
          {isCalculator ? (
            modalData.content
          ) : (
            <ModalContent>{modalData.content}</ModalContent>
          )}
        </motion.div>
        {isLoading && <LoaderBox text={modalData.loadingText} />}
      </ModalBackground>
    )
  );
};

export default Modal;
