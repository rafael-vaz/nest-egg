import { ReactNode } from "react";

import styles from "./tool-menu-collection.module.css";

interface IToolMenuCollectionProps {
  id: string;
  title: string;
  children: ReactNode;
}

const ToolMenuCollection = ({
  id,
  title,
  children,
}: IToolMenuCollectionProps) => {
  return (
    <section
      id={`tool-menu-collection-${id}`}
      aria-labelledby={`collection-title-${id}`}
      className={styles.toolMenuCollection}
      tabIndex={0}
    >
      <p
        id={`collection-title-${id}`}
        className={styles.toolMenuCollectionTitle}
      >
        {title}
      </p>
      <div className={styles.toolMenuCollectionContent}>{children}</div>
    </section>
  );
};

export default ToolMenuCollection;
