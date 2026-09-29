import React from "react";

import Loader from "./loader";
import styles from "./loader-box.module.css";

interface ILoaderBoxProps {
  text: string;
}
const LoaderBox = ({ text }: ILoaderBoxProps) => {
  const loaderBoxRef = React.useRef(null);

  React.useEffect(() => {
    if (loaderBoxRef.current) {
      const loaderBoxElement = loaderBoxRef.current as HTMLElement;
      loaderBoxElement.focus();
    }
  }, []);

  return (
    <div
      className={`${styles.loaderBox} noVisualFocus`}
      role="status"
      aria-live="polite"
      aria-describedby="loader-box-text"
      tabIndex={-1}
      ref={loaderBoxRef}
    >
      <p id="loader-box-text">{text}</p>
      <Loader />
    </div>
  );
};

export default LoaderBox;
