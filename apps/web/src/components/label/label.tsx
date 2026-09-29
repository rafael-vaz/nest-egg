import React from "react";

import InfoBox from "../info-box/info-box";
import styles from "./label.module.css";

interface ILabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  text: string;
  counter?: number;
  infoBox?: string;
  hasMargin?: boolean;
  isRequired?: boolean;
}

const Label = ({
  htmlFor,
  text,
  counter,
  infoBox,
  hasMargin = true,
  isRequired = true,
  ...props
}: ILabelProps) => {
  return (
    <div className={styles.labelContainer} data-has-margin={hasMargin}>
      <label htmlFor={htmlFor} className={styles.label} {...props}>
        {text}
        {counter !== undefined && (
          <span className={styles.counter}>{`(${counter})`}</span>
        )}
        {!isRequired && <span className={styles.opcional}>{"(opcional)"}</span>}
      </label>
      {infoBox && (
        <InfoBox
          id="goal-status-infobox"
          text={infoBox}
          label="Saiba mais"
          size="x-small"
        />
      )}
    </div>
  );
};

export default Label;
