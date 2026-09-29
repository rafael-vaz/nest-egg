import React from "react";

import debounce from "../../utils/debounce";
import PercentageProgress from "../percentage-progress/percentage-progress";
import Select, { ISelectGroup } from "../select/select";
import styles from "./category-and-percentage-picker.module.css";

export interface ICategoryAndPercentagePickerValue {
  category: string;
  percentage: number;
}

interface ICategoryAndPercentagePickerProps {
  id: string;
  groups: ISelectGroup[];
  value: ICategoryAndPercentagePickerValue;
  onChange?: (value: ICategoryAndPercentagePickerValue) => void;
}
const CategoryAndPercentagePicker = ({
  id,
  groups,
  value,
  onChange,
}: ICategoryAndPercentagePickerProps) => {
  const [percentage, setPercentage] = React.useState(value.percentage);
  const [category, setCategory] = React.useState(value.category);

  const debouncedChange = React.useMemo(() => {
    if (!onChange) return undefined;
    return debounce(onChange, 200);
  }, [onChange]);

  React.useEffect(() => {
    setPercentage(value.percentage);
  }, [value.percentage]);

  React.useEffect(() => {
    setCategory(value.category);
  }, [value.category]);

  React.useEffect(() => {
    if (debouncedChange) debouncedChange({ category, percentage });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, percentage]);

  const handleCategoryChange = React.useCallback((newCat: string) => {
    setCategory(newCat);
  }, []);

  const handlePercentageChange = React.useCallback((newValue: number) => {
    setPercentage(newValue);
  }, []);

  return (
    <div id={id} className={styles.categoryAndPercentagePicker}>
      <Select
        id={`${id}-select`}
        groups={groups}
        onChange={handleCategoryChange}
        value={category}
        className={styles.categoryAndPercentagePickerSelect}
        hasNoMargin={true}
      />
      <PercentageProgress
        onChange={handlePercentageChange}
        value={percentage}
        className={styles.categoryAndPercentagePickerSlider}
      />
    </div>
  );
};

export default CategoryAndPercentagePicker;
