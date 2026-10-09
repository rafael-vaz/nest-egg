import ModalHeader from "../modal/modal-header";
import ActivitiesList from "./activities-list";

interface IActivitiesProps {
  onClose: () => void;
}

const Activities = ({ onClose }: IActivitiesProps) => {
  return (
    <>
      <ModalHeader title="Atividades" onClose={onClose} />
      <ActivitiesList />
    </>
  );
};

export default Activities;
