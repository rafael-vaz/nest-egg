import { useSelector } from "react-redux";

import avatar from "../../assets/img/user/avatar.svg";
import { RootState } from "../../store/configure-store";
import sidebarItemStyles from "../sidebar/sidebar-item.module.css";
import styles from "./user-menu-button.module.css";

interface IUserMenuButton
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active: boolean;
}

const UserMenuButton = ({ active, ...props }: IUserMenuButton) => {
  const { authUser } = useSelector((state: RootState) => state.userAuth);
  return (
    <button
      className={`${styles.userMenuButton} ${sidebarItemStyles.sidebarItem}`}
      title={`${active ? "Fechar" : "Abrir"} opções do usuário`}
      aria-controls="user-options-list"
      aria-expanded={active}
      {...props}
    >
      <img src={authUser?.photoURL ?? avatar} height={32} width={32} />
    </button>
  );
};

export default UserMenuButton;
