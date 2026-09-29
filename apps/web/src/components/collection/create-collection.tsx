import ModalHeader from "../modal/modal-header";
import CollectionForm from "./collection-form";

interface ICreateCollectionProps {
  onClose: () => void;
}

const CreateCollection = ({ onClose }: ICreateCollectionProps) => {
  return (
    <>
      <ModalHeader title="Nova coleção" onClose={onClose} />
      <CollectionForm onClose={onClose} />
    </>
  );
};

export default CreateCollection;
