import { LucideProps } from "lucide-react";
import React from "react";

import { useAppDispatch } from "../../store/configure-store";
import { openModalState } from "../../store/reducers/modal/modal";
import { CreationMenuListItemId } from "../../templates/creation-menu-items-map";
import styles from "./creation-menu-list-item.module.css";

interface ICreationMenuListItemProps {
  id: CreationMenuListItemId;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref">>;
  title: string;
  description: string;
}

const CreationMenuListItem = ({
  id,
  icon: Icon,
  title,
  description,
}: ICreationMenuListItemProps) => {
  const dispatch = useAppDispatch();

  function handleCreationMenuListItemClick() {
    dispatch(openModalState({ id: id }));
  }

  function handleCreationMenuListItemKeyDown(
    event: React.KeyboardEvent<HTMLLIElement>
  ) {
    if (event.key === "Enter") {
      dispatch(openModalState({ id: id }));
    }
  }

  return (
    <li
      id={`create-${id}`}
      tabIndex={0}
      className={styles.creationMenuListItem}
      onClick={handleCreationMenuListItemClick}
      onKeyDown={handleCreationMenuListItemKeyDown}
    >
      <p>
        <Icon size={16} />
        <span>{title}</span>
      </p>
      <span>{description}</span>
    </li>
  );
};

export default CreationMenuListItem;
