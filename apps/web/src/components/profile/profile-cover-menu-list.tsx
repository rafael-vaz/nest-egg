import { SquarePen } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";

import { RootState } from "../../store/configure-store";
import profileDefaultCoversMap from "../../templates/default-covers-map";
import Button from "../button/button";
import Subtitle from "../subtitle/subtitle";
import styles from "./profile-cover-menu-list.module.css";
import ProfileCoverMenuListItem from "./profile-cover-menu-list-item";

const ProfileCoverMenuList = () => {
  const [active, setActive] = React.useState(false);
  const loading = useSelector((state: RootState) => state.userData.loading);
  const listRef = React.useRef(null);

  function handleOutsideClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (listRef.current) {
      const listElement = listRef.current as HTMLElement;
      if (!listElement.contains(target)) {
        setActive(false);
      }
    }
  }

  function handleOutsideKeyDown(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    if (listRef.current && event.key === "Enter") {
      const listElement = listRef.current as HTMLElement;
      if (!listElement.contains(target)) {
        setActive(false);
      }
    }
  }

  React.useEffect(() => {
    if (!active) return;
    window.document.addEventListener("click", handleOutsideClick);
    window.document.addEventListener("keydown", handleOutsideKeyDown);
    return () => {
      window.document.removeEventListener("click", handleOutsideClick);
      window.document.removeEventListener("keydown", handleOutsideKeyDown);
    };
  }, [active]);

  return (
    <div className={styles.profileCoverMenu}>
      <Button
        id="cover-edit"
        icon={SquarePen}
        size="small"
        aria-label="Editar capa"
        color="dark-gray"
        title="Editar capa"
        disabled={loading.update}
        data-active={active}
        onClick={(e) => {
          e.stopPropagation();
          setActive((state) => !state);
        }}
      />
      {active && (
        <div className={styles.profileCoverMenuContent} ref={listRef}>
          <Subtitle text="Selecione uma capa" />
          <ul className={styles.profileCoverMenuList}>
            {profileDefaultCoversMap.map((converURL, index) => (
              <ProfileCoverMenuListItem
                key={index}
                setActive={setActive}
                coverAlt={`Opção de capa ${index}`}
                coverURL={converURL}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileCoverMenuList;
