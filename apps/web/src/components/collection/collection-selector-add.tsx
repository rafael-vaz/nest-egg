import { Plus, X } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";

import { ICollection } from "../../@types/collection";
import { RootState, useAppDispatch } from "../../store/configure-store";
import { readAllCollectionsThunk } from "../../store/thunks/collection/collection-data";
import sortByKey from "../../utils/sort-by-key";
import Announcement from "../announcement/announcement";
import Button from "../button/button";
import styles from "./collection-selector-add.module.css";
import CollectionSelectorAddList from "./collection-selector-add-list";

interface ICollectionSelectorAddProps {
  selectedCollection: ICollection | null;
  setSelectedCollection: React.Dispatch<
    React.SetStateAction<ICollection | null>
  >;
}

const CollectionSelectorAdd = ({
  selectedCollection,
  setSelectedCollection,
}: ICollectionSelectorAddProps) => {
  const dispatch = useAppDispatch();
  const { authUser } = useSelector((state: RootState) => state.userAuth);
  const [active, setActive] = React.useState(false);
  const [collections, setCollections] = React.useState<ICollection[] | null>(
    null
  );
  const [accessibilityAnnouncement, setAccessibilityAnnouncement] =
    React.useState("");
  const collectionSelectorAddRef = React.useRef(null);

  const buttonDescription = `${
    active ? "Fechar" : "Abrir"
  } menu de seleção de coleções`;

  function handleClick(event: React.MouseEvent) {
    event.preventDefault();
    setActive((state) => !state);
  }

  function handleOutsideCLick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (collectionSelectorAddRef.current) {
      const collectionSelectorAddElement =
        collectionSelectorAddRef.current as HTMLElement;
      if (
        !collectionSelectorAddElement.contains(target) ||
        target === collectionSelectorAddRef.current
      ) {
        setActive(false);
      }
    }
  }

  function handleOutsideKeyDown(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    if (collectionSelectorAddRef.current && event.key === "Enter") {
      const collectionSelectorAddElement =
        collectionSelectorAddRef.current as HTMLElement;
      if (!collectionSelectorAddElement.contains(target)) {
        setTimeout(() => setActive(false), 100);
      }
    }
  }

  React.useEffect(() => {
    if (!active) return;
    window.document.addEventListener("click", handleOutsideCLick);
    window.document.addEventListener("keydown", handleOutsideKeyDown);
    return () => {
      window.document.removeEventListener("click", handleOutsideCLick);
      window.document.removeEventListener("keydown", handleOutsideKeyDown);
    };
  }, [active]);

  React.useEffect(() => {
    const AnnouncementText = `Menu de seleção de coleções ${
      active ? "aberto" : "fechado"
    }`;
    setAccessibilityAnnouncement(AnnouncementText);
  }, [active]);

  React.useEffect(() => {
    async function getCollectionsList() {
      const savedCollections = await dispatch(
        readAllCollectionsThunk({ userId: authUser!.uid })
      ).unwrap();
      if (savedCollections && savedCollections.length > 0) {
        setCollections(sortByKey<ICollection>(savedCollections, "name"));
      }
    }
    getCollectionsList();
  }, [authUser, dispatch]);

  return (
    <div
      className={styles.collectionSelectorAdd}
      ref={collectionSelectorAddRef}
    >
      <Button
        aria-expanded={active}
        aria-haspopup="listbox"
        aria-controls="select-collections-listbox"
        role="combobox"
        size="small"
        title={buttonDescription}
        aria-label={buttonDescription}
        color="purple"
        icon={active ? X : Plus}
        onClick={handleClick}
      />
      {active && (
        <CollectionSelectorAddList
          id="select-collections-listbox"
          role="listbox"
          items={collections}
          selectedCollection={selectedCollection}
          setSelectedCollection={setSelectedCollection}
        />
      )}
      <Announcement>{accessibilityAnnouncement}</Announcement>
    </div>
  );
};

export default CollectionSelectorAdd;
