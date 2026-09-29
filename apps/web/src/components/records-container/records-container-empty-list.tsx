import styles from "./records-container.module.css";

interface IRecordsContainerEmptyListProps {
  text: string;
}

const RecordsContainerEmptyList = ({
  text,
}: IRecordsContainerEmptyListProps) => {
  return (
    <div className={styles.recordsContainerEmptyList}>
      <p>{text}</p>
    </div>
  );
};

export default RecordsContainerEmptyList;
