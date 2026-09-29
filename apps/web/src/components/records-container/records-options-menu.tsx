import React from "react";

import styles from "./records-options-menu.module.css";
import RecordsOptionsMenuButton from "./records-options-menu-button";
import RecordsOptionsMenuList from "./records-options-menu-list";

interface IRecordsOptionsMenuProps {
  entity: {
    id: string;
    name: string;
    type: "collection" | "goal" | "transaction";
  };
}

const RecordsOptionsMenu = ({ entity }: IRecordsOptionsMenuProps) => {
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

  function handleOutiseKeyDown(event: KeyboardEvent) {
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
    window.document.addEventListener("keydown", handleOutiseKeyDown);
    return () => {
      window.document.removeEventListener("click", handleOutsideClick);
      window.document.removeEventListener("keydown", handleOutiseKeyDown);
    };
  });

  return (
    <div className={styles.recordsOptionsMenu} ref={userMenuRef}>
      <RecordsOptionsMenuButton onClick={handleClickButton} active={active} />
      {active && (
        <RecordsOptionsMenuList
          active={active}
          setActive={setActive}
          entity={entity}
        />
      )}
    </div>
  );
};

export default RecordsOptionsMenu;
