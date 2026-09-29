import React from "react";

import { ICollection } from "../../@types/collection";
import Label from "../label/label";
import CollectionSelectorAdd from "./collection-selector-add";
import styles from "./collection-selector-header.module.css";

interface ICollectionSelectorHeaderProps {
  selectedCollection: ICollection | null;
  setSelectedCollection: React.Dispatch<
    React.SetStateAction<ICollection | null>
  >;
}

const CollectionSelectorHeader = ({
  selectedCollection,
  setSelectedCollection,
}: ICollectionSelectorHeaderProps) => {
  return (
    <header className={styles.collectionSelectorHeader}>
      <div className={styles.collectionSelectorHeaderContent}>
        <Label
          text="Adicionar à coleção"
          tabIndex={0}
          hasMargin={false}
          isRequired={false}
        />
        <div className={styles.collectionSelectorHeaderControls}>
          <CollectionSelectorAdd
            selectedCollection={selectedCollection}
            setSelectedCollection={setSelectedCollection}
          />
        </div>
      </div>
    </header>
  );
};

export default CollectionSelectorHeader;
