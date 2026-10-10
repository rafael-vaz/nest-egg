import { ArrowLeftFromLine } from "lucide-react";
import { useSelector } from "react-redux";

import avatar from "../../assets/img/user/avatar.svg";
import { RootState, useAppDispatch } from "../../store/configure-store";
import { openModalState } from "../../store/reducers/modal/modal";
import { closeToolMenuState } from "../../store/reducers/tool-menu/tool-menu";
import Button from "../button/button";
import styles from "./tool-menu-header.module.css";

const ToolMenuHeader = () => {
  const dispatch = useAppDispatch();
  const { authUser } = useSelector((state: RootState) => state.userAuth);
  const splitedUserName = authUser!.name.split(" ");
  const firstName = splitedUserName[0];
  const lastName = splitedUserName[splitedUserName.length - 1];

  function handleCloseToolMenu() {
    dispatch(closeToolMenuState());
  }

  return (
    <header className={styles.toolMenuHeader}>
      <div className={styles.toolMenuHeaderUser}>
        <div
          id="tool-menu-profile-button"
          className={styles.toolMenuHeaderUserPhoto}
          aria-label="Acessar perfil"
          onClick={() => dispatch(openModalState({ id: "profile" }))}
          tabIndex={0}
        >
          <img src={authUser?.photoURL ?? avatar} alt="Foto do usuário" />
        </div>
        <p>{`${firstName} ${lastName}`}</p>
      </div>
      <Button
        title="Fechar menu"
        aria-label="Fechar menu de ferramentas"
        icon={ArrowLeftFromLine}
        color="dark-gray"
        size="small"
        onClick={handleCloseToolMenu}
      />
    </header>
  );
};

export default ToolMenuHeader;
