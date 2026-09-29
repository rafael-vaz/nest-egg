import React from "react";

import { ICollection } from "../../@types/collection";
import EmptySelection from "../empty-selection/empty-selection";
import InputWarningText from "../input/input-warning-text";
import styles from "./collection-selector.module.css";
import CollectionSelectorHeader from "./collection-selector-header";
import CollectionSelectorList from "./collection-selector-list";

interface ICollectionSelectorProps {
  id: string;
  value: ICollection | null;
  error?: string | null | undefined;
  onChange: (value: ICollection | null) => void;
}

const CollectionSelector = ({
  id,
  error,
  value = null,
  onChange,
}: ICollectionSelectorProps) => {
  const [errorState, setErrorState] = React.useState(error);
  const [selectedCollection, setSelectedCollection] =
    React.useState<ICollection | null>(value);

  React.useEffect(() => {
    onChange(selectedCollection);
    clearError();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onChange, selectedCollection]);

  React.useEffect(() => {
    setErrorState(error);
  }, [error]);

  function clearError() {
    if (error) setErrorState(null);
  }

  return (
    <div id={id} className={styles.collectionSelector}>
      <CollectionSelectorHeader
        selectedCollection={selectedCollection}
        setSelectedCollection={setSelectedCollection}
      />
      {selectedCollection ? (
        <CollectionSelectorList
          setSelectedCollection={setSelectedCollection}
          selectedCollection={selectedCollection}
        />
      ) : (
        <EmptySelection text="Nenhuma coleção selecionada." />
      )}
      {errorState && <InputWarningText type="error" text={errorState} />}
    </div>
  );
};

export default CollectionSelector;
