import { LucideProps } from "lucide-react";
import React from "react";

import styles from "./status-tag.module.css";

interface IStatusTagProps {
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref">>;
  name: string;
  value: string;
}

const StatusTag = ({ icon: Icon, name, value }: IStatusTagProps) => {
  return (
    <div className={styles.statusTag}>
      <Icon size={14} />
      <p>
        {name}: {value}
      </p>
    </div>
  );
};

export default StatusTag;
