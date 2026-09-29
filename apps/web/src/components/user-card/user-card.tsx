import { LogOut } from "lucide-react";
import { useSelector } from "react-redux";

import avatar from "../../assets/img/user/avatar.svg";
import { RootState, useAppDispatch } from "../../store/configure-store";
import { openModalState } from "../../store/reducers/modal/modal";
import { logoutUserThunk } from "../../store/thunks/user/user-auth";
import Button from "../button/button";
import styles from "./user-card.module.css";

const UserCard = () => {
  const { authUser } = useSelector((state: RootState) => state.userAuth);
  const userName = authUser?.name?.split(" ")[0];
  const dispatch = useAppDispatch();
  return (
    <div
      className={styles.userCard}
      tabIndex={0}
      aria-label="Card de informações do usuário"
    >
      <div
        className={styles.userCardPhoto}
        tabIndex={0}
        aria-label="Acessar perfil"
        onClick={() => dispatch(openModalState({ id: "profile" }))}
      >
        <img
          src={authUser?.photoURL ?? avatar}
          height={40}
          width={40}
          alt="Foto do usuário"
        />
      </div>
      <div className={styles.userCardText}>
        <p>{userName ? `Olá, ${userName}` : "Carregando..."}</p>
        <button
          className={styles.userCardTextProfileButton}
          aria-label="Acessar perfil"
          onClick={() => dispatch(openModalState({ id: "profile" }))}
        >
          Visualizar perfil
        </button>
      </div>
      <Button
        icon={LogOut}
        color="dark-gray"
        aria-label="Sair da conta"
        title="Sair da conta"
        size="small"
        onClick={() => dispatch(logoutUserThunk())}
      />
    </div>
  );
};

export default UserCard;
