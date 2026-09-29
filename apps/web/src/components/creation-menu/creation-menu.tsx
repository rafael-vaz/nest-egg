import ModalHeader from "../modal/modal-header";
import CreationMenuList from "./creation-menu-list";

interface ICreationMenuProps {
  onClose: () => void;
}

const CreationMenu = ({ onClose }: ICreationMenuProps) => {
  return (
    <>
      <ModalHeader onClose={onClose} title="Criar" />
      <CreationMenuList />
    </>
  );
};

export default CreationMenu;
