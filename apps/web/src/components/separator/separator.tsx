import styles from "./separator.module.css";

interface ISeparatorProps {
  margin?: "large" | "medium" | "small";
}

const Separator = ({ margin = "large" }: ISeparatorProps) => {
  return <hr className={styles.separator} data-margin={margin} />;
};

export default Separator;
