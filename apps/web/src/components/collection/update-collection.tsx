import React from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import { ICollection } from "../../@types/collection";
import { RootState } from "../../store/configure-store";
import ModalHeader from "../modal/modal-header";
import CollectionForm from "./collection-form";

interface IUpdateCollectionProps {
  collectionId: string;
  onClose: () => void;
}

const UpdateCollection = ({
  collectionId,
  onClose,
}: IUpdateCollectionProps) => {
  const { collections, goals, loading } = useSelector(
    (state: RootState) => state.userFinances,
  );
  const [value, setValue] = React.useState<null | ICollection>(null);

  const collection = collections.find(
    (collection) => collection.id === collectionId,
  );

  React.useEffect(() => {
    if (!loading) {
      if (!collection) {
        toast.error("Coleção não encontrada.");
        onClose();
      } else {
        setValue({
          ...collection,
          goals: collection.goals
            ? collection.goals.map((collectionGoal) => {
                return goals.find((goal) => goal.id === collectionGoal.id)!;
              })
            : null,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return (
    value && (
      <>
        <ModalHeader title="Editar coleção" onClose={onClose} />
        <CollectionForm actionType="update" value={value} onClose={onClose} />
      </>
    )
  );
};

export default UpdateCollection;
