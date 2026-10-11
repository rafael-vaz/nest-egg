import { PlayCircle } from "lucide-react";
import { useSelector } from "react-redux";

import { RootState, useAppDispatch } from "../../store/configure-store";
import { startTutorial } from "../../store/reducers/tutorial/tutorial";
import { updateAuthUser } from "../../store/reducers/user/user-auth";
import { updateUserThunk } from "../../store/thunks/user/user-data";
import Button from "../button/button";
import ModalHeader from "../modal/modal-header";
import styles from "./welcome.module.css";

interface IWelcomeProps {
  onClose: () => void;
}

const Welcome = ({ onClose }: IWelcomeProps) => {
  const dispatch = useAppDispatch();
  const { authUser } = useSelector((state: RootState) => state.userAuth);
  const firstName = authUser?.name.split(" ")[0] ?? "";

  function markWelcomeSeen() {
    if (!authUser?.uid) return;
    dispatch(
      updateUserThunk({
        uid: authUser.uid,
        hasSeenWelcome: true,
        hasAlert: false,
      }),
    );
    dispatch(updateAuthUser({ hasSeenWelcome: true }));
  }

  function handleClose() {
    markWelcomeSeen();
    onClose();
  }

  function handleStartTutorial() {
    markWelcomeSeen();
    onClose();
    dispatch(startTutorial());
  }

  return (
    <>
      <ModalHeader
        title={`Boas-vindas ao Nest Egg! 👋`}
        onClose={handleClose}
      />
      <div className={styles.welcome}>
        <p className={styles.welcomeMessage}>
          Olá, {firstName}. Que bom ter você por aqui!
        </p>

        <p className={styles.welcomeMessage}>
          Vamos ajudar você a organizar suas finanças, acompanhar seu progresso
          e dar os próximos passos rumo aos seus objetivos.
        </p>

        <p className={styles.welcomeInvite}>
          Que tal começar com um tour rápido pelos principais recursos da
          ferramenta?
        </p>
        <div className={styles.welcomeActions}>
          <Button text="Dispensar" color="light-gray" onClick={handleClose} />
          <Button
            icon={PlayCircle}
            text="Iniciar tutorial"
            color="purple"
            onClick={handleStartTutorial}
          />
        </div>
      </div>
    </>
  );
};

export default Welcome;
