import styles from "./empty-selection.module.css";

interface IEmptySelectionProps {
  text?: string;
}

const EmptySelection = ({ text }: IEmptySelectionProps) => {
  return (
    <div className={styles.emptySelection}>
      <p>{text ?? "Nenhuma seleção."}</p>
    </div>
  );
};

export default EmptySelection;
