import { LogOut, User } from "lucide-react";
import { motion } from "motion/react";
import React from "react";

import slideRightVariants from "../../motion/slide-right-variants";
import { useAppDispatch } from "../../store/configure-store";
import { openModalState } from "../../store/reducers/modal/modal";
import { logoutUserThunk } from "../../store/thunks/user/user-auth";
import styles from "./user-menu-list.module.css";

interface IUserMenuListProps {
  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserMenuList = ({ active, setActive }: IUserMenuListProps) => {
  const dispatch = useAppDispatch();
  const userMenuListRef = React.useRef(null);
  function handleLogout() {
    dispatch(logoutUserThunk());
    setActive(false);
  }

  function handleShowProfile() {
    dispatch(openModalState({ id: "profile" }));
    setActive(false);
  }

  React.useEffect(() => {
    if (userMenuListRef.current && active) {
      const userMenuListElement = userMenuListRef.current as HTMLElement;
      userMenuListElement.focus();
    }
  }, [active]);

  return (
    <motion.ul
      id="user-options-list"
      className={styles.userMenuList}
      aria-label="Menu de opções do usuário"
      aria-hidden={!active}
      variants={slideRightVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      role="listbox"
      ref={userMenuListRef}
      tabIndex={0}
    >
      <li className={styles.userMenuListItem}>
        <button onClick={handleShowProfile}>
          <User size={16} />
          <span>Ver perfil</span>
        </button>
      </li>
      <li className={styles.userMenuListItem}>
        <button onClick={handleLogout}>
          <LogOut size={16} />
          <span>Sair</span>
        </button>
      </li>
    </motion.ul>
  );
};

export default UserMenuList;
