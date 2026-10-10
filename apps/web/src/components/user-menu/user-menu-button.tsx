import { useSelector } from "react-redux";

import avatar from "../../assets/img/user/avatar.svg";
import { RootState } from "../../store/configure-store";
import sidebarItemStyles from "../sidebar/sidebar-item.module.css";
import styles from "./user-menu-button.module.css";

interface IUserMenuButton
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active: boolean;
}

const UserMenuButton = ({ active, onClick, ...props }: IUserMenuButton) => {
  const { authUser } = useSelector((state: RootState) => state.userAuth);
  return (
    <button
      id="user-menu-button"
      className={`${styles.userMenuButton} ${sidebarItemStyles.sidebarItem}`}
      aria-label={`${active ? "Fechar" : "Abrir"} opções do usuário`}
      aria-controls="user-options-list"
      aria-expanded={active}
      {...props}
      onClick={(event) => {
        onClick?.(event);
        event.currentTarget.blur();
      }}
    >
      <img src={authUser?.photoURL ?? avatar} height={32} width={32} />
      <span className={sidebarItemStyles.sidebarItemTooltip} role="tooltip">
        Perfil
      </span>
    </button>
  );
};

export default UserMenuButton;
