import logo from "../../assets/img/logo/logo.svg";
import styles from "./logo.module.css";

const Logo = () => {
  return (
    <div className={styles.logoContainer}>
      <img
        className={styles.logoImg}
        src={logo}
        alt="Logo da Nest Egg"
        height={63}
        width={70}
      />
      <h3 className={styles.logoTitle}>Nest Egg</h3>
    </div>
  );
};

export default Logo;
