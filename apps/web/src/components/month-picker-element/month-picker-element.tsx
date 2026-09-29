import "dayjs/locale/pt-br";

import { MantineProvider } from "@mantine/core";
import { DatesProvider, DatesRangeValue, MonthPicker } from "@mantine/dates";
import { useClickOutside } from "@mantine/hooks";
import dayjs from "dayjs";
import { Calendar, CalendarCheck } from "lucide-react";
import { motion } from "motion/react";
import React from "react";

import slideDownVariants from "../../motion/slide-down-variants";
import getPeriodDescription from "../../utils/date/get-period-description";
import Button from "../button/button";
import styles from "./month-picker-element.module.css";

interface IMonthPickerElementProps {
  id: string;
  onChange: (value: DatesRangeValue<string>) => void;
}

const MonthPickerElement = ({ id, onChange }: IMonthPickerElementProps) => {
  dayjs.locale("pt-br");
  const defaultDescription = "Selecionar período";
  const [active, setActive] = React.useState(false);
  const [value, setValue] = React.useState<DatesRangeValue<string>>([
    null,
    null,
  ]);
  const [description, setDescription] = React.useState(defaultDescription);
  const hasActiveFilter = !!(value[0] || value[1]);
  const ref = useClickOutside(() => setActive(false));

  React.useEffect(() => {
    const description = getPeriodDescription(value);
    setDescription(description ? description : defaultDescription);
  }, [value]);

  function handleClickButton() {
    setActive((state) => !state);
  }

  function handleChange(value: DatesRangeValue<string>) {
    setValue(value);
    onChange(value);
  }

  return (
    <div className={styles.monthPickerContainer} ref={ref}>
      <Button
        className={styles.monthPickerButton}
        icon={hasActiveFilter ? CalendarCheck : Calendar}
        text={description}
        color={hasActiveFilter ? "green" : "light-gray"}
        onClick={handleClickButton}
        title={`${active ? "Fechar" : "Abrir"} seleção de período`}
        aria-controls={`${id}-month-range-picker`}
        aria-expanded={active}
      />
      {active && (
        <motion.div
          className={styles.monthPickerList}
          id={`${id}-month-range-picker`}
          variants={slideDownVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          role="listbox"
          tabIndex={0}
        >
          <MantineProvider>
            <DatesProvider settings={{ locale: "pt-br" }}>
              <MonthPicker
                type="range"
                value={value}
                onChange={handleChange}
                monthsListFormat="MMMM"
                yearsListFormat="YYYY"
              />
            </DatesProvider>
          </MantineProvider>
        </motion.div>
      )}
    </div>
  );
};

export default MonthPickerElement;
