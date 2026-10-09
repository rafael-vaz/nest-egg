import { LucideProps } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAppDispatch } from "../../store/configure-store";
import { openModalState } from "../../store/reducers/modal/modal";
import { closeToolMenuState } from "../../store/reducers/tool-menu/tool-menu";
import styles from "./tool-menu-item.module.css";

interface IToolMenuItemProps {
  id: string;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref">>;
  text: string;
}

const ToolMenuItem = ({ id, icon: Icon, text }: IToolMenuItemProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  function handleSidebarItemClick(id: string) {
    switch (id) {
      case "home":
      case "wallet":
        navigate(`/${id}`);
        dispatch(closeToolMenuState());
        break;
      case "search":
        navigate("/search");
        dispatch(closeToolMenuState());
        break;
      case "create":
        dispatch(openModalState({ id: "create" }));
        break;
      case "activities":
        dispatch(openModalState({ id: "activities" }));
        break;
    }
  }
  return (
    <button
      id={`tool-item-${id}`}
      className={styles.toolMenuItem}
      onClick={() => handleSidebarItemClick(id)}
    >
      <Icon size={16} />
      <span>{text}</span>
    </button>
  );
};

export default ToolMenuItem;
