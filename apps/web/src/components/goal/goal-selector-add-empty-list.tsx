import { useAppDispatch } from "../../store/configure-store";
import { openModalState } from "../../store/reducers/modal/modal";
import styles from "./goal-selector-add-empty-list.module.css";

const GoalSelectorAddEmptyList = () => {
  const dispatch = useAppDispatch();
  return (
    <div className={styles.goalSelectorAddEmptyList}>
      <p>Nenhuma meta disponível.</p>
      <p>
        <a
          href="#"
          role="button"
          tabIndex={0}
          onClick={() => dispatch(openModalState({ id: "new-goal" }))}
        >
          Crie uma para começar
        </a>
      </p>
    </div>
  );
};

export default GoalSelectorAddEmptyList;
