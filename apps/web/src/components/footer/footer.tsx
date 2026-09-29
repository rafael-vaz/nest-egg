import styles from "./footer.module.css";

interface IFooterProps {
  backgroundStyle: "transparent" | "solid";
  position: "absolute" | "relative";
}

const Footer = ({ backgroundStyle, position }: IFooterProps) => {
  return (
    <footer
      data-background-style={backgroundStyle}
      data-position={position}
      className={styles.footer}
    >
      <p>
        Desenvolvido com <span>♡</span> por <b>Rafael Vaz</b>
      </p>
    </footer>
  );
};

export default Footer;
