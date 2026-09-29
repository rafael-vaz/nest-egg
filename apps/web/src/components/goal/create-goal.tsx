import ModalHeader from "../modal/modal-header";
import NewGoalForm from "./goal-form";

interface ICreateGoalProps {
  onClose: () => void;
}

const CreateGoal = ({ onClose }: ICreateGoalProps) => {
  return (
    <>
      <ModalHeader title="Nova meta" onClose={onClose} />
      <NewGoalForm onClose={onClose} />
    </>
  );
};

export default CreateGoal;
