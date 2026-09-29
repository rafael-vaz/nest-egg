import { Trash } from "lucide-react";

import { ICollection } from "../../@types/collection";
import { useAppDispatch } from "../../store/configure-store";
import { clearAndSetAnnouncementContent } from "../../store/reducers/announcement/announcement-data";
import Button from "../button/button";
import TableDataCell from "../table/table-data-cell";
import TableRow from "../table/table-row";
import styles from "./collection-selector-list-item.module.css";

interface ICollectionSelectorListItemProps {
  setSelectedCollection: React.Dispatch<
    React.SetStateAction<ICollection | null>
  >;
  collection: ICollection;
}

const CollectionSelectorListItem = ({
  collection,
  setSelectedCollection,
}: ICollectionSelectorListItemProps) => {
  const dispatch = useAppDispatch();
  function handleRemoveItem(collectionName: string) {
    setSelectedCollection(null);
    dispatch(
      clearAndSetAnnouncementContent(`Coleção ${collectionName} removida`)
    );
  }

  return (
    <TableRow key={collection.id}>
      <TableDataCell>{collection.name}</TableDataCell>
      <TableDataCell>{collection.goals?.length ?? 0}</TableDataCell>
      <TableDataCell>
        <Button
          size="small"
          icon={Trash}
          title="Remover coleção"
          aria-label="Remover coleção"
          color="light-gray"
          className={styles.collectionSelectorListItemRemoveButton}
          onClick={(e) => {
            e.preventDefault();
            handleRemoveItem(collection.name);
          }}
        />
      </TableDataCell>
    </TableRow>
  );
};

export default CollectionSelectorListItem;
