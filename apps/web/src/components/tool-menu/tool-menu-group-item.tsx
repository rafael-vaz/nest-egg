import { LucideProps } from "lucide-react";
import React from "react";

import formatDefaultDate from "../../utils/date/format-default-date";
import formatShortDate from "../../utils/date/format-short-date";
import formatToDateTime from "../../utils/date/format-to-date-time";
import styles from "./tool-menu-group-item.module.css";

type Colors =
  | "default"
  | "white"
  | "red"
  | "green"
  | "blue"
  | "yellow"
  | "purple"
  | "orange"
  | "gray";

interface IToolMenuGroupItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  id: string;
  icon?: React.ForwardRefExoticComponent<Omit<LucideProps, "ref">>;
  iconDescription?: string;
  iconColor?: Colors;
  text: string;
  value: string;
  valueColor?: Colors;
  valueDescription?: string;
  date?: Date;
  onClick?: () => void;
}

const ToolMenuGroupItem = ({
  id,
  icon: Icon,
  iconDescription = "",
  iconColor = "default",
  text,
  value,
  valueColor = "default",
  valueDescription = "",
  date,
  onClick,
}: IToolMenuGroupItemProps) => {
  return (
    <li
      id={id}
      className={styles.toolMenuGroupItem}
      data-value-color={valueColor}
      data-icon-color={iconColor}
      tabIndex={0}
      onClick={onClick}
    >
      {Icon && (
        <span aria-label={iconDescription} title={iconDescription}>
          <Icon size={16} />
        </span>
      )}
      <div className={styles.toolGroupItemContent}>
        <p>{text}</p>
        <span className={styles.mainValue} aria-label={valueDescription}>
          <span aria-hidden={!!valueDescription}>{value}</span>
        </span>
        {date && (
          <time
            lang="pt-BR"
            dateTime={formatToDateTime(date)}
            className={styles.dateValue}
          >
            <span aria-hidden={true}>{formatShortDate(date)}</span>
            <span className="visuallyHidden">{formatDefaultDate(date)}</span>
          </time>
        )}
      </div>
    </li>
  );
};

export default ToolMenuGroupItem;
