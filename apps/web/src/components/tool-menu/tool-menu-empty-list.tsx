import styles from "./tool-menu-empty-list.module.css";

interface IToolMenuEmptyListProps {
  text: string;
}

const ToolMenuEmptyList = ({ text }: IToolMenuEmptyListProps) => {
  return (
    <div className={styles.toolMenuEmptyList}>
      <p>{text}</p>
    </div>
  );
};

export default ToolMenuEmptyList;
