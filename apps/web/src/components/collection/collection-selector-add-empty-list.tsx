import { useAppDispatch } from "../../store/configure-store";
import { openModalState } from "../../store/reducers/modal/modal";
import styles from "./collection-selector-add-empty-list.module.css";

const CollectionSelectorAddEmptyList = () => {
  const dispatch = useAppDispatch();
  return (
    <div className={styles.collectionSelectorAddEmptyList}>
      <p>Nenhuma coleção disponível.</p>
      <p>
        <a
          href="#"
          role="button"
          tabIndex={0}
          onClick={() => dispatch(openModalState({ id: "new-collection" }))}
        >
          Crie uma para começar
        </a>
      </p>
    </div>
  );
};

export default CollectionSelectorAddEmptyList;
