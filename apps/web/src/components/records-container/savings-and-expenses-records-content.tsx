import { DatesRangeValue } from "@mantine/dates";
import { BrushCleaning, MoveDown, MoveUp } from "lucide-react";
import React from "react";

import { ISavingsAndExpenses } from "../../@types/savings-and-expenses";
import { useAppDispatch } from "../../store/configure-store";
import { clearAndSetAnnouncementContent } from "../../store/reducers/announcement/announcement-data";
import { monthsMap } from "../../templates/months-map";
import formatCurrency from "../../utils/text/format-currency";
import Button from "../button/button";
import CategoryAndPercentagePicker, {
  ICategoryAndPercentagePickerValue,
} from "../category-and-percentage-picker/category-and-percentage-picker";
import MonetaryValueInterval from "../monetary-value-interval/monetary-value-interval";
import MonthPickerElement from "../month-picker-element/month-picker-element";
import Table from "../table/table";
import TableBody from "../table/table-body";
import TableDataCell from "../table/table-data-cell";
import TableHeader from "../table/table-header";
import TableHeaderCell from "../table/table-header-cell";
import TableRow from "../table/table-row";
import styles from "./records-container.module.css";
import RecordsContainerEmptyList from "./records-container-empty-list";

const SavingsAndExpensesRecordsContent = () => {
  const dispatch = useAppDispatch();
  const [filteredStatus, setFilteredStatus] = React.useState(false);
  const [categoryAndPercentageValue, setCategoryAndPercentageValue] =
    React.useState({
      category: "savings",
      percentage: 0,
    });
  const [monetaryInterval, setMonetaryInterval] = React.useState({
    start: 0,
    end: 0,
  });
  const [monthInterval, setMonthInterval] = React.useState<
    DatesRangeValue<string>
  >([null, null]);
  const monetaryIntervalStartInputRef = React.useRef(null);
  const monetaryIntervalEndInputRef = React.useRef(null);

  function handleChangeMonetaryInterval(startValue: number, endValue: number) {
    setMonetaryInterval({
      start: startValue,
      end: endValue,
    });
  }

  function handleChangeCategoryAndPercentageValue(
    value: ICategoryAndPercentagePickerValue
  ) {
    setCategoryAndPercentageValue(value);
  }

  function handleChangeMonthInterval(value: DatesRangeValue<string>) {
    setMonthInterval(value);
  }

  function clearFilters() {
    setMonetaryInterval({ start: 0, end: 0 });
    if (monetaryIntervalStartInputRef.current) {
      const monetaryIntervalStartInputElement =
        monetaryIntervalStartInputRef.current as HTMLInputElement;
      monetaryIntervalStartInputElement.value = "";
    }
    if (monetaryIntervalEndInputRef.current) {
      const monetaryIntervalEndInputElement =
        monetaryIntervalEndInputRef.current as HTMLInputElement;
      monetaryIntervalEndInputElement.value = "";
    }
    if (categoryAndPercentageValue.percentage > 0) {
      setCategoryAndPercentageValue((state) => ({ ...state, percentage: 0 }));
    }
    dispatch(clearAndSetAnnouncementContent("Limpeza de filtro realizada."));
  }

  React.useEffect(() => {
    const { start, end } = monetaryInterval;
    const [startMonth, endMonth] = monthInterval;

    if (
      start > 0 ||
      end > 0 ||
      startMonth ||
      endMonth ||
      categoryAndPercentageValue.percentage > 0
    ) {
      setFilteredStatus(true);
    } else {
      setFilteredStatus(false);
    }
  }, [monthInterval, monetaryInterval, categoryAndPercentageValue]);

  const groupMap = [
    {
      id: "savings",
      value: "Poupado",
    },
    {
      id: "expenses",
      value: "Gasto",
    },
  ];

  const tableColumns = [
    "Ano",
    "Mês",
    "Total (R$)",
    "Poupado (R$)",
    "Gasto (R$)",
  ];

  const savingsAndExpensesData: ISavingsAndExpenses[] = [
    {
      year: 2023,
      month: 0,
      total: 4500,
      savings: 1200,
      expenses: 3300,
      savingsPercentage: 27,
      expensesPercentage: 73,
    },
    {
      year: 2023,
      month: 1,
      total: 4700,
      savings: 1300,
      expenses: 3400,
      savingsPercentage: 28,
      expensesPercentage: 72,
    },
    {
      year: 2023,
      month: 2,
      total: 4900,
      savings: 1100,
      expenses: 3800,
      savingsPercentage: 22,
      expensesPercentage: 78,
    },
    {
      year: 2023,
      month: 3,
      total: 5100,
      savings: 1400,
      expenses: 3700,
      savingsPercentage: 27,
      expensesPercentage: 73,
    },
    {
      year: 2023,
      month: 4,
      total: 5300,
      savings: 1500,
      expenses: 3800,
      savingsPercentage: 28,
      expensesPercentage: 72,
    },
    {
      year: 2023,
      month: 5,
      total: 5500,
      savings: 1600,
      expenses: 3900,
      savingsPercentage: 29,
      expensesPercentage: 71,
    },
    {
      year: 2024,
      month: 0,
      total: 5800,
      savings: 1700,
      expenses: 4100,
      savingsPercentage: 29,
      expensesPercentage: 71,
    },
    {
      year: 2024,
      month: 1,
      total: 5600,
      savings: 1500,
      expenses: 4100,
      savingsPercentage: 27,
      expensesPercentage: 73,
    },
    {
      year: 2024,
      month: 2,
      total: 6000,
      savings: 2000,
      expenses: 4000,
      savingsPercentage: 33,
      expensesPercentage: 67,
    },
    {
      year: 2024,
      month: 3,
      total: 6200,
      savings: 2100,
      expenses: 4100,
      savingsPercentage: 34,
      expensesPercentage: 66,
    },
    {
      year: 2024,
      month: 4,
      total: 6400,
      savings: 1900,
      expenses: 4500,
      savingsPercentage: 30,
      expensesPercentage: 70,
    },
    {
      year: 2024,
      month: 5,
      total: 6600,
      savings: 2200,
      expenses: 4400,
      savingsPercentage: 33,
      expensesPercentage: 67,
    },
    {
      year: 2024,
      month: 6,
      total: 6800,
      savings: 2300,
      expenses: 4500,
      savingsPercentage: 34,
      expensesPercentage: 66,
    },
    {
      year: 2024,
      month: 7,
      total: 7000,
      savings: 2400,
      expenses: 4600,
      savingsPercentage: 34,
      expensesPercentage: 66,
    },
    {
      year: 2024,
      month: 8,
      total: 7200,
      savings: 2500,
      expenses: 4700,
      savingsPercentage: 35,
      expensesPercentage: 65,
    },
    {
      year: 2025,
      month: 0,
      total: 7400,
      savings: 2600,
      expenses: 4800,
      savingsPercentage: 35,
      expensesPercentage: 65,
    },
    {
      year: 2025,
      month: 1,
      total: 7600,
      savings: 2700,
      expenses: 4900,
      savingsPercentage: 36,
      expensesPercentage: 64,
    },
    {
      year: 2025,
      month: 2,
      total: 7800,
      savings: 2800,
      expenses: 5000,
      savingsPercentage: 36,
      expensesPercentage: 64,
    },
    {
      year: 2025,
      month: 3,
      total: 8000,
      savings: 2900,
      expenses: 5100,
      savingsPercentage: 36,
      expensesPercentage: 64,
    },
    {
      year: 2025,
      month: 4,
      total: 8300,
      savings: 3100,
      expenses: 5200,
      savingsPercentage: 37,
      expensesPercentage: 63,
    },
    {
      year: 2025,
      month: 5,
      total: 8500,
      savings: 3300,
      expenses: 5200,
      savingsPercentage: 39,
      expensesPercentage: 61,
    },
    {
      year: 2025,
      month: 6,
      total: 8700,
      savings: 3400,
      expenses: 5300,
      savingsPercentage: 39,
      expensesPercentage: 61,
    },
    {
      year: 2025,
      month: 7,
      total: 8900,
      savings: 3200,
      expenses: 5700,
      savingsPercentage: 36,
      expensesPercentage: 64,
    },
    {
      year: 2025,
      month: 8,
      total: 9100,
      savings: 3500,
      expenses: 5600,
      savingsPercentage: 38,
      expensesPercentage: 62,
    },
    {
      year: 2025,
      month: 9,
      total: 9300,
      savings: 3600,
      expenses: 5700,
      savingsPercentage: 39,
      expensesPercentage: 61,
    },
    {
      year: 2025,
      month: 10,
      total: 9500,
      savings: 3800,
      expenses: 5700,
      savingsPercentage: 40,
      expensesPercentage: 60,
    },
    {
      year: 2025,
      month: 11,
      total: 9700,
      savings: 4000,
      expenses: 5700,
      savingsPercentage: 41,
      expensesPercentage: 59,
    },
  ];

  const filteredSavingsAndExpenses = React.useMemo(() => {
    let filtered = savingsAndExpensesData;
    const [startDate, endDate] = monthInterval;

    if (filtered) {
      // eslint-disable-next-line prefer-const
      let { start, end } = monetaryInterval;
      if (end < start) {
        end = 0;
      }

      filtered = filtered?.filter((item) => {
        const minOk = start === 0 || item.total >= start;
        const maxOk = end === 0 || item.total <= end;

        return minOk && maxOk;
      });

      if (startDate || endDate) {
        filtered = filtered.filter((item) => {
          const formatedStartDate = startDate ? new Date(startDate) : null;
          const formatedEndDate = endDate ? new Date(endDate) : null;
          const date = new Date(`${item.year}-0${item.month + 1}-01`);
          const afterStart = !formatedStartDate || date >= formatedStartDate;
          const beforeEnd = !formatedEndDate || date <= formatedEndDate;
          return afterStart && beforeEnd;
        });
      }

      if (categoryAndPercentageValue.percentage > 0) {
        filtered = filtered.filter((item) => {
          if (categoryAndPercentageValue.category === "savings") {
            return (
              item.savingsPercentage >= categoryAndPercentageValue.percentage
            );
          }
          if (categoryAndPercentageValue.category === "expenses") {
            return (
              item.expensesPercentage >= categoryAndPercentageValue.percentage
            );
          }
        });
      }
    }
    return filtered ?? [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monetaryInterval, monthInterval, categoryAndPercentageValue]);

  return (
    <>
      <header className={styles.recordsContainerHeader}>
        <MonetaryValueInterval
          startInputRef={monetaryIntervalStartInputRef}
          endInputRef={monetaryIntervalEndInputRef}
          onChange={handleChangeMonetaryInterval}
        />
        <div className={styles.recordsContainerHeaderFilters}>
          <CategoryAndPercentagePicker
            id="savings-and-expenses"
            groups={[{ children: groupMap }]}
            onChange={handleChangeCategoryAndPercentageValue}
            value={categoryAndPercentageValue}
          />
          <MonthPickerElement
            id="savings-and-expenses"
            onChange={handleChangeMonthInterval}
          />
          <div className={styles.recordsContainerHeaderControls}>
            <Button
              icon={BrushCleaning}
              color="light-gray"
              size="small"
              title="Limpar filtros"
              aria-label="Limpar filtros"
              disabled={!filteredStatus}
              onClick={clearFilters}
            />
          </div>
        </div>
      </header>
      <div className={styles.recordsContainerContent}>
        {filteredSavingsAndExpenses && filteredSavingsAndExpenses.length > 0 ? (
          <Table id="savings-and-expenses-list">
            <TableHeader>
              <TableRow>
                {tableColumns.map((name) => (
                  <TableHeaderCell key={name}>{name}</TableHeaderCell>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSavingsAndExpenses?.map((savingsAndExpenses, index) => (
                <TableRow key={index}>
                  <TableDataCell>{savingsAndExpenses.year}</TableDataCell>
                  <TableDataCell>
                    {monthsMap[savingsAndExpenses.month].value}
                  </TableDataCell>
                  <TableDataCell>
                    {formatCurrency(`${savingsAndExpenses.total}`, false)}
                  </TableDataCell>
                  <TableDataCell>
                    <div className={styles.recordFlex}>
                      <MoveUp
                        size={16}
                        className={styles.recordStatusAccent}
                        data-status={"credit"}
                      />
                      {formatCurrency(`${savingsAndExpenses.savings}`, false)}
                      <span>{`(${savingsAndExpenses.savingsPercentage}%)`}</span>
                    </div>
                  </TableDataCell>
                  <TableDataCell>
                    <div className={styles.recordFlex}>
                      <MoveDown
                        size={16}
                        className={styles.recordStatusAccent}
                        data-status={"debt"}
                      />
                      {formatCurrency(`${savingsAndExpenses.expenses}`, false)}
                      <span>{`(${savingsAndExpenses.expensesPercentage}%)`}</span>
                    </div>
                  </TableDataCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <RecordsContainerEmptyList
            text={`${
              savingsAndExpensesData && savingsAndExpensesData.length > 0
                ? "Nenhum item encontrado para o filtro selecionado."
                : "Sua lista de poupanças e gastos está vazia."
            }`}
          />
        )}
      </div>
    </>
  );
};

export default SavingsAndExpensesRecordsContent;
