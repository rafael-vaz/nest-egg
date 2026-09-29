import { Info } from "lucide-react";
import { motion } from "motion/react";
import React from "react";

import slideDownVariants from "../../motion/slide-down-variants";
import Button from "../button/button";
import styles from "./info-box.module.css";

interface IInforBoxProps {
  id: string;
  label: string;
  text: string;
  size?: "small" | "x-small";
}

function InfoBox({ id, label, text, size = "small" }: IInforBoxProps) {
  const [active, setActive] = React.useState(false);
  const infoBoxRef = React.useRef(null);
  const infoBoxContentRef = React.useRef(null);

  function handleClick(event: React.MouseEvent) {
    event.preventDefault();
    setActive((state) => !state);
  }

  function handleOutsideCLick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (infoBoxRef.current) {
      const infoBoxElement = infoBoxRef.current as HTMLElement;
      if (!infoBoxElement.contains(target) || target === infoBoxRef.current) {
        setActive(false);
      }
    }
  }

  function handleOutsideKeyDown(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    if (infoBoxRef.current && event.key === "Enter") {
      const infoBoxElement = infoBoxRef.current as HTMLElement;
      if (!infoBoxElement.contains(target)) {
        setActive(false);
      }
    }
  }

  function handleFocusContent() {
    if (infoBoxContentRef.current) {
      const infoBoxContentElement = infoBoxContentRef.current as HTMLDivElement;
      infoBoxContentElement.focus();
    }
  }

  React.useEffect(() => {
    setTimeout(() => handleFocusContent(), 50);
    if (!active) return;
    window.document.addEventListener("click", handleOutsideCLick);
    window.document.addEventListener("keydown", handleOutsideKeyDown);
    return () => {
      window.document.removeEventListener("click", handleOutsideCLick);
      window.document.removeEventListener("keydown", handleOutsideKeyDown);
    };
  }, [active]);

  return (
    <div className={styles.infoBoxContainer} ref={infoBoxRef}>
      <Button
        icon={Info}
        size={size}
        color={"light-gray"}
        role={"combobox"}
        title={label}
        aria-label={label}
        aria-haspopup={"dialog"}
        aria-controls={`${id}-dialog`}
        onClick={handleClick}
      />
      {active && (
        <motion.div
          key={id}
          variants={slideDownVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          id={`${id}-dialog`}
          role={"dialog"}
          aria-label="Aviso de conteúdo"
          className={styles.infoBoxContent}
          tabIndex={0}
          ref={infoBoxContentRef}
        >
          <p>{text}</p>
        </motion.div>
      )}
    </div>
  );
}

export default InfoBox;
