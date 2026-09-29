import React from "react";

import { ICollection } from "../../@types/collection";
import Table from "../table/table";
import TableBody from "../table/table-body";
import TableHeader from "../table/table-header";
import TableHeaderCell from "../table/table-header-cell";
import TableRow from "../table/table-row";
import CollectionSelectorListItem from "./collection-selector-list-item";

interface ICollectionSelectorListProps {
  setSelectedCollection: React.Dispatch<
    React.SetStateAction<ICollection | null>
  >;
  selectedCollection: ICollection | null;
}

const CollectionSelectorList = ({
  setSelectedCollection,
  selectedCollection,
}: ICollectionSelectorListProps) => {
  return (
    <div>
      <Table id="collection-collections-list" aria-label="Metas da coleção">
        <TableHeader>
          <TableRow>
            <TableHeaderCell>{"Nome"}</TableHeaderCell>
            <TableHeaderCell>{"Metas"}</TableHeaderCell>
            <TableHeaderCell>{""}</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {selectedCollection && (
            <CollectionSelectorListItem
              collection={selectedCollection}
              setSelectedCollection={setSelectedCollection}
            />
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CollectionSelectorList;
