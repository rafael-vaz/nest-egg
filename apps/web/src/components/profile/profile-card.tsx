import { LucideProps } from "lucide-react";
import React from "react";

import styles from "./profile-card.module.css";

interface IProfileCardProps {
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref">>;
  title: string;
  value: string;
}

const ProfileCard = ({ icon: Icon, title, value }: IProfileCardProps) => {
  return (
    <div className={styles.profileCard} tabIndex={0}>
      <header className={styles.profileCardHeader}>
        <h4 className={styles.profileCardTitle}>
          <Icon size={16} />
          <span>{title}</span>
        </h4>
      </header>
      <div className={styles.profileCardValue}>
        <span>{value}</span>
      </div>
    </div>
  );
};

export default ProfileCard;
