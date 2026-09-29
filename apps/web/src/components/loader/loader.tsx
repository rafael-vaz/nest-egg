import styles from "./loader.module.css";

const Loader = () => {
  return (
    <div className={styles.loader}>
      <div className={styles.loaderPoint}></div>
      <div className={styles.loaderPoint}></div>
      <div className={styles.loaderPoint}></div>
    </div>
  );
};

export default Loader;
