import { DatesRangeValue } from "@mantine/dates";
import { LucideProps } from "lucide-react";
import React, { ReactNode } from "react";

import MonthPickerElement from "../month-picker-element/month-picker-element";
import styles from "./card.module.css";

type IconColor = "default" | "red" | "green";

interface ICardProps {
  id: string;
  title: string;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref">>;
  iconColor?: IconColor;
  hasFilter?: boolean;
  onFilterChange?: (value: DatesRangeValue<string>) => void;
  children: ReactNode;
}

const Card = ({
  id,
  title,
  icon: Icon,
  iconColor = "default",
  hasFilter = false,
  onFilterChange = () => {},
  children,
}: ICardProps) => {
  return (
    <div id={id} className={styles.card} tabIndex={0}>
      <header className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>
          <Icon size={20} data-color={iconColor} />
          <span>{title}</span>
        </h3>
        {hasFilter && <MonthPickerElement id={id} onChange={onFilterChange} />}
      </header>
      <div className={styles.cardContent}>{children}</div>
    </div>
  );
};

export default Card;
