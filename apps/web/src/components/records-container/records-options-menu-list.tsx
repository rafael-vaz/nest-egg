import { Pencil, Trash } from "lucide-react";
import { motion } from "motion/react";
import React from "react";

import slideLeftVariants from "../../motion/slide-left-variants";
import { useAppDispatch } from "../../store/configure-store";
import { openConfirmationModalState } from "../../store/reducers/modal/confirmation-modal";
import { openModalState } from "../../store/reducers/modal/modal";
import styles from "./records-options-menu-list.module.css";

interface IUserMenuListProps {
  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
  entity: {
    id: string;
    name: string;
    type: "collection" | "goal" | "transaction";
  };
}

const RecordsOptionsMenuList = ({
  active,
  setActive,
  entity,
}: IUserMenuListProps) => {
  const dispatch = useAppDispatch();
  const recordMenuListRef = React.useRef(null);

  function handleDelete() {
    switch (entity.type) {
      case "goal":
        dispatch(
          openConfirmationModalState({
            id: "confirm-remove-goal",
            entity: {
              id: entity.id,
              name: entity.name,
            },
          })
        );
        break;
      case "collection":
        dispatch(
          openConfirmationModalState({
            id: "confirm-remove-collection",
            entity: {
              id: entity.id,
              name: entity.name,
            },
          })
        );
        break;
      case "transaction":
        dispatch(
          openConfirmationModalState({
            id: "confirm-remove-transaction",
            entity: {
              id: entity.id,
              name: entity.name,
            },
          })
        );
        break;
    }
    setActive(false);
  }

  function handleEdit() {
    switch (entity.type) {
      case "collection":
        dispatch(
          openModalState({ id: "update-collection", entity: entity.id })
        );
        break;
      case "goal":
        dispatch(openModalState({ id: "update-goal", entity: entity.id }));
        break;
      case "transaction":
        dispatch(
          openModalState({ id: "update-transaction", entity: entity.id })
        );
        break;
    }
    setActive(false);
  }

  React.useEffect(() => {
    if (recordMenuListRef.current && active) {
      const recordMenuListElement = recordMenuListRef.current as HTMLElement;
      recordMenuListElement.focus();
    }
  }, [active]);

  return (
    <motion.ul
      className={styles.recordMenuList}
      aria-label="Menu de opções"
      aria-hidden={!active}
      variants={slideLeftVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      role="listbox"
      ref={recordMenuListRef}
      tabIndex={0}
    >
      <li className={styles.recordMenuListItem}>
        <button onClick={handleEdit}>
          <Pencil size={16} />
          <span>Editar</span>
        </button>
      </li>
      <li className={styles.recordMenuListItem}>
        <button onClick={handleDelete}>
          <Trash size={16} />
          <span>Excluir</span>
        </button>
      </li>
    </motion.ul>
  );
};

export default RecordsOptionsMenuList;
