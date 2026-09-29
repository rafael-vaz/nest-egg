import React from "react";

import styles from "./user-menu.module.css";
import UserMenuButton from "./user-menu-button";
import UserMenuList from "./user-menu-list";

const UserMenu = () => {
  const [active, setActive] = React.useState(false);
  const userMenuRef = React.useRef(null);

  function handleClickButton() {
    setActive((state) => !state);
  }

  function handleOutsideClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (userMenuRef.current) {
      const userMenuElement = userMenuRef.current as HTMLElement;
      if (!userMenuElement.contains(target)) {
        setActive(false);
      }
    }
  }

  function handleOutsideKeyDown(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    if (userMenuRef.current && event.key === "Enter") {
      const userMenuElement = userMenuRef.current as HTMLElement;
      if (!userMenuElement.contains(target)) {
        setActive(false);
      }
    }
  }

  React.useEffect(() => {
    window.document.addEventListener("click", handleOutsideClick);
    window.document.addEventListener("keydown", handleOutsideKeyDown);
    return () => {
      window.document.removeEventListener("click", handleOutsideClick);
      window.document.removeEventListener("keydown", handleOutsideKeyDown);
    };
  });

  return (
    <div className={styles.userMenu} ref={userMenuRef}>
      <UserMenuButton onClick={handleClickButton} active={active} />
      {active && <UserMenuList active={active} setActive={setActive} />}
    </div>
  );
};

export default UserMenu;
