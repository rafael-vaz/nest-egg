import { motion } from "motion/react";
import React from "react";

import { ICollection } from "../../@types/collection";
import useSearch from "../../hooks/search/use-search";
import slideDownVariants from "../../motion/slide-down-variants";
import debounce from "../../utils/debounce";
import InputSearch from "../input/input-search";
import CollectionSelectorAddEmptyList from "./collection-selector-add-empty-list";
import styles from "./collection-selector-add-list.module.css";
import CollectionSelectorAddListItem from "./collection-selector-add-list-item";

interface ICollectionSelectorAddListProps {
  id: string;
  role: string;
  items: ICollection[] | null;
  selectedCollection: ICollection | null;
  setSelectedCollection: React.Dispatch<
    React.SetStateAction<ICollection | null>
  >;
}

const CollectionSelectorAddList = ({
  id,
  role,
  items,
  selectedCollection,
  setSelectedCollection,
}: ICollectionSelectorAddListProps) => {
  const {
    defaultItems,
    setDefaultItems,
    searchResult,
    setSearchResult,
    getSearch,
  } = useSearch<ICollection>();
  const collectionSelectorAddListContainerRef = React.useRef(null);
  const searchInputRef = React.useRef(null);
  const debounceGetSearch = debounce(getSearch, 200);
  const [searchedCollections, setSearchedCollections] = React.useState<
    ICollection[] | null
  >(items);

  function handleSearch(event: React.ChangeEvent) {
    const target = event.target as HTMLInputElement;
    const searchTerm = target.value;
    if (searchTerm) {
      debounceGetSearch(searchTerm, ["name"]);
    } else {
      setSearchResult(null);
    }
  }

  React.useEffect(() => {
    if (searchResult) {
      setSearchedCollections(searchResult);
    } else {
      setSearchedCollections(defaultItems);
    }
  }, [searchResult, defaultItems]);

  React.useEffect(() => {
    setDefaultItems(items);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (collectionSelectorAddListContainerRef.current) {
      const collectionSelectorAddListContainerElement =
        collectionSelectorAddListContainerRef.current as HTMLDivElement;
      collectionSelectorAddListContainerElement.focus();
    }
  }, []);

  return (
    <motion.div
      key={id}
      variants={slideDownVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      id={id}
      role={role}
      className={styles.collectionSelectorAddListContainer}
      ref={collectionSelectorAddListContainerRef}
      aria-label="Menu de seleção de coleções"
      tabIndex={0}
    >
      {searchedCollections ? (
        <>
          <InputSearch
            id="collection-selector-add-list-search"
            placeholder="Buscar coleção"
            hasNoMargin={true}
            className={styles.collectionSelectorAddListSearch}
            onChange={handleSearch}
            ref={searchInputRef}
          />
          <ul className={`${styles.collectionSelectorAddList} smoothScrollbar`}>
            {searchedCollections?.map((collection) => {
              const isSelected = selectedCollection?.id === collection.id;
              return (
                <CollectionSelectorAddListItem
                  key={collection.id}
                  collection={collection}
                  setSelectedCollection={setSelectedCollection}
                  isSelected={isSelected}
                />
              );
            })}
          </ul>
        </>
      ) : (
        <CollectionSelectorAddEmptyList />
      )}
    </motion.div>
  );
};

export default CollectionSelectorAddList;
