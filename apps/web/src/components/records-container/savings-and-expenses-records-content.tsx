import { DatesRangeValue } from "@mantine/dates";
import { BrushCleaning, MoveDown, MoveUp } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";

import { ISavingsAndExpenses } from "../../@types/savings-and-expenses";
import { RootState, useAppDispatch } from "../../store/configure-store";
import { clearAndSetAnnouncementContent } from "../../store/reducers/announcement/announcement-data";
import { monthsMap } from "../../templates/months-map";
import parseLocalDate from "../../utils/date/parse-local-date";
import formatCurrency from "../../utils/text/format-currency";
import getTransactionOccurrences from "../../utils/transaction/get-transaction-occurrences";
import sumOccurrencesByType from "../../utils/transaction/sum-occurrences-by-type";
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

function formatMonthDate(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

const SavingsAndExpensesRecordsContent = () => {
  const dispatch = useAppDispatch();
  const { transactions, loading } = useSelector(
    (state: RootState) => state.userFinances,
  );
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

  const savingsAndExpensesData = React.useMemo<ISavingsAndExpenses[]>(() => {
    const occurrences = getTransactionOccurrences(transactions);

    const monthKeys = new Set<string>();
    occurrences.forEach((occurrence) => {
      const date = parseLocalDate(occurrence.date);
      monthKeys.add(`${date.getFullYear()}-${date.getMonth()}`);
    });

    return Array.from(monthKeys)
      .map((key) => {
        const [yearText, monthText] = key.split("-");
        const year = Number(yearText);
        const month = Number(monthText);
        const firstDay = formatMonthDate(year, month, 1);
        const lastDay = formatMonthDate(
          year,
          month,
          new Date(year, month + 1, 0).getDate(),
        );

        const savings = sumOccurrencesByType(
          occurrences,
          "credit",
          firstDay,
          lastDay,
        );
        const expenses = sumOccurrencesByType(
          occurrences,
          "debt",
          firstDay,
          lastDay,
        );
        const total = savings + expenses;
        const savingsPercentage =
          total > 0 ? Math.round((savings / total) * 100) : 0;
        const expensesPercentage = total > 0 ? 100 - savingsPercentage : 0;

        return {
          year,
          month,
          total,
          savings,
          expenses,
          savingsPercentage,
          expensesPercentage,
        };
      })
      .sort((a, b) => a.year - b.year || a.month - b.month);
  }, [transactions]);

  const filteredSavingsAndExpenses = React.useMemo(() => {
    let filtered: ISavingsAndExpenses[] = savingsAndExpensesData;
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
          const date = parseLocalDate(formatMonthDate(item.year, item.month, 1));
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
  }, [
    savingsAndExpensesData,
    monetaryInterval,
    monthInterval,
    categoryAndPercentageValue,
  ]);

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
              loading
                ? "Carregando lista de poupanças e gastos..."
                : savingsAndExpensesData && savingsAndExpensesData.length > 0
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
