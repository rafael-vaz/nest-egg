import { Loader, LucideProps, X } from "lucide-react";
import { ReactNode } from "react";
import React from "react";

import { useAppDispatch } from "../../store/configure-store.ts";
import { closeConfirmationModalState } from "../../store/reducers/modal/confirmation-modal.ts";
import Button from "../button/button.tsx";
import { ButtonColor } from "../button/button.tsx";
import GridContainer from "../grid-container/grid-container.tsx";
import Subtitle from "../subtitle/subtitle.tsx";
import styles from "./confirm-action.module.css";

interface IConfirmActionProps {
  subtitle: string;
  text: ReactNode;
  confirmButtonColor: ButtonColor;
  confirmButtonText: string;
  confirmButtonIcon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref">>;
  confirmCallback: () => Promise<void>;
}

const ConfirmAction = ({
  subtitle,
  text,
  confirmButtonColor,
  confirmButtonText,
  confirmButtonIcon,
  confirmCallback,
}: IConfirmActionProps) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = React.useState(false);

  async function handleConfirm() {
    setLoading(true);
    await confirmCallback();
    setLoading(false);
    handleClose();
  }

  function handleClose() {
    dispatch(closeConfirmationModalState());
  }

  return (
    <div className={styles.confirmActionContainer}>
      <Subtitle text={subtitle} />
      <p>{text}</p>
      <GridContainer columns={2}>
        <Button
          icon={loading ? Loader : confirmButtonIcon}
          text={loading ? "Processando..." : confirmButtonText}
          color={confirmButtonColor}
          onClick={handleConfirm}
          size="fill"
          disabled={loading}
        />
        <Button
          icon={X}
          text="Cancelar"
          color="light-gray"
          onClick={handleClose}
          size="fill"
          disabled={loading}
        />
      </GridContainer>
    </div>
  );
};

export default ConfirmAction;
