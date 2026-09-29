import { Circle, CircleCheckBig, Package } from "lucide-react";
import React from "react";

import { ICollection } from "../../@types/collection/index.ts";
import { useAppDispatch } from "../../store/configure-store.ts";
import { clearAndSetAnnouncementContent } from "../../store/reducers/announcement/announcement-data.tsx";
import Button from "../button/button.tsx";
import styles from "./collection-selector-add-list-item.module.css";

interface ICollectionSelectorAddListItemProps
  extends React.LiHTMLAttributes<HTMLLIElement> {
  collection: ICollection;
  isSelected: boolean;
  setSelectedCollection: React.Dispatch<
    React.SetStateAction<ICollection | null>
  >;
}

const CollectionSelectorAddListItem = ({
  collection,
  isSelected,
  setSelectedCollection,
}: ICollectionSelectorAddListItemProps) => {
  const dispatch = useAppDispatch();
  const selectionButtonDescription = `${
    isSelected ? "Remover" : "Adicionar"
  } coleção`;

  function handleClick(event: React.MouseEvent) {
    event.preventDefault();
    setSelectedCollection(isSelected ? null : collection);
    dispatch(
      clearAndSetAnnouncementContent(
        `Coleção ${name} ${isSelected ? "removida" : "adicionada"}`
      )
    );
  }

  return (
    <li
      id={collection.id}
      className={styles.collectionSelectorAddListItem}
      aria-selected={isSelected}
      data-selected={isSelected}
      role="option"
      tabIndex={0}
      onClick={handleClick}
    >
      <Package size={16} />
      <div className={styles.collectionSelectorAddListItemContent}>
        <p className={styles.collectionSelectorAddListItemName}>
          {collection.name}
        </p>
        <p className={styles.collectionSelectorAddListItemValue}>
          {`${collection.goals?.length ?? 0} metas`}
        </p>
      </div>
      <Button
        size="small"
        color="transparent"
        data-selected={isSelected}
        icon={isSelected ? CircleCheckBig : Circle}
        title={selectionButtonDescription}
        aria-label={selectionButtonDescription}
        className={styles.collectionSelectorAddListItemSelectionButton}
      />
    </li>
  );
};

export default CollectionSelectorAddListItem;
