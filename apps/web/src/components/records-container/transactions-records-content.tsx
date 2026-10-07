import parse from "html-react-parser";
import {
  BrushCleaning,
  MoveDown,
  MoveUp,
  Plus,
  RefreshCcw,
} from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";

import { ITransaction } from "../../@types/transaction";
import {
  useFiltersQueryParams,
  useSearchQueryParams,
} from "../../hooks/search/use-query-params";
import useSearch from "../../hooks/search/use-search";
import { RootState, useAppDispatch } from "../../store/configure-store";
import { clearAndSetAnnouncementContent } from "../../store/reducers/announcement/announcement-data";
import { openModalState } from "../../store/reducers/modal/modal";
import { ITransactionTypeMap } from "../../templates/transaction-type-map";
import formatShortDate from "../../utils/date/format-short-date";
import debounce from "../../utils/debounce";
import formatCurrency from "../../utils/text/format-currency";
import getLatestOccurrenceDate from "../../utils/transaction/get-last-occurrence-date";
import getRecurrenceDescription from "../../utils/transaction/get-recurrence-description";
import getTransactionCategoryById from "../../utils/transaction/get-transaction-category-by-id";
import getTransactionTypeById from "../../utils/transaction/get-transaction-type-by-id";
import Button from "../button/button";
import DateRangeSelector from "../date-range-selector/date-range-selector";
import InputSearch from "../input/input-search";
import MonetaryValueInterval from "../monetary-value-interval/monetary-value-interval";
import Select from "../select/select";
import Table from "../table/table";
import TableBody from "../table/table-body";
import TableDataCell from "../table/table-data-cell";
import TableHeader from "../table/table-header";
import TableHeaderCell from "../table/table-header-cell";
import TableRow from "../table/table-row";
import styles from "./records-container.module.css";
import RecordsContainerEmptyList from "./records-container-empty-list";
import RecordsOptionsMenu from "./records-options-menu";

function getTransactionSortDate(transaction: ITransaction): Date {
  if (transaction.occurrenceLog && transaction.occurrenceLog.length > 0) {
    return getLatestOccurrenceDate(transaction.occurrenceLog);
  }
  return new Date((transaction.date ?? transaction.createdAt) as string);
}

interface IMonetaryInterval {
  start: number;
  end: number;
}

interface IDateInterval {
  start: Date | null;
  end: Date | null;
}

const TransactionsRecordsContent = () => {
  const dispatch = useAppDispatch();
  const { filters, setFilters } = useFiltersQueryParams();
  const { searchTerm, setSearchTerm } = useSearchQueryParams();
  const {
    defaultItems,
    setDefaultItems,
    searchResult,
    setSearchResult,
    getSearch,
  } = useSearch<ITransaction>();
  const { transactions, loading } = useSelector(
    (state: RootState) => state.userFinances,
  );
  const [typeFilter, setTypeFilter] = React.useState(filters.status);
  const [monetaryInterval, setMonetaryInterval] =
    React.useState<IMonetaryInterval>({
      start: filters.minValue ?? 0,
      end: filters.maxValue ?? 0,
    });
  const [dateInterval, setDateInterval] = React.useState<IDateInterval>({
    start: filters.startDate ?? null,
    end: filters.endDate ?? null,
  });
  const searchInputRef = React.useRef(null);
  const monetaryIntervalStartInputRef = React.useRef(null);
  const monetaryIntervalEndInputRef = React.useRef(null);
  const hasMonetaryIntervalMounted = React.useRef(false);

  const debounceGetSearch = React.useMemo(
    () => debounce(getSearch, 200),
    [getSearch],
  );

  const debouncedSetSearchTerm = React.useMemo(
    () =>
      debounce((value: string | null) => {
        setSearchTerm(value);
      }, 300),
    [setSearchTerm],
  );

  const dateRangeValue = React.useMemo<
    [Date | null, Date | null] | null
  >(() => {
    return dateInterval.start || dateInterval.end
      ? [dateInterval.start, dateInterval.end]
      : null;
  }, [dateInterval]);

  const handleSearch = React.useCallback(
    (event: React.ChangeEvent) => {
      const target = event.target as HTMLInputElement;
      const value = target.value;

      if (value) {
        debounceGetSearch(value, ["name", "description"]);
        debouncedSetSearchTerm(value);
      } else {
        setSearchResult(null);
        debouncedSetSearchTerm(null);
      }
    },
    [debounceGetSearch, debouncedSetSearchTerm, setSearchResult],
  );

  const handleChangeMonetaryInterval = React.useCallback(
    (startValue: number, endValue: number) => {
      if (!hasMonetaryIntervalMounted.current) {
        hasMonetaryIntervalMounted.current = true;
        setMonetaryInterval({
          start: startValue,
          end: endValue,
        });
        return;
      }

      setMonetaryInterval({
        start: startValue,
        end: endValue,
      });

      if (startValue === 0 && endValue === 0) {
        setFilters({
          minValue: null,
          maxValue: null,
        });
      } else {
        setFilters({
          minValue: startValue,
          maxValue: endValue,
        });
      }
    },
    [setFilters],
  );

  const handleChangeDateInterverval = React.useCallback(
    (date: Date | [Date | null, Date | null] | null) => {
      if (date && Array.isArray(date)) {
        setDateInterval({ start: date[0], end: date[1] });
        setFilters({
          startDate: date[0] ?? null,
          endDate: date[1] ?? null,
        });
      } else {
        setDateInterval({ start: null, end: null });
        setFilters({
          startDate: null,
          endDate: null,
        });
      }
    },
    [setFilters],
  );

  const handleChangeTypeFilter = React.useCallback(
    (value: string) => {
      setTypeFilter(value);
      setFilters({ status: value });
    },
    [setFilters],
  );

  const handleAddNewGoal = React.useCallback(() => {
    dispatch(openModalState({ id: "new-transaction" }));
  }, [dispatch]);

  const clearFilters = React.useCallback(() => {
    setSearchResult(null);
    setMonetaryInterval({ start: 0, end: 0 });
    setDateInterval({ start: null, end: null });
    setTypeFilter("all");
    if (searchInputRef.current) {
      const searchInputElement = searchInputRef.current as HTMLInputElement;
      searchInputElement.value = "";
    }
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
    dispatch(clearAndSetAnnouncementContent("Limpeza de filtro realizada."));
    setFilters({
      startDate: null,
      endDate: null,
      minValue: null,
      maxValue: null,
      status: "all",
    });
    setSearchTerm(null);
  }, [dispatch, setFilters, setSearchResult, setSearchTerm]);

  React.useEffect(() => {
    setDefaultItems(transactions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions]);

  React.useEffect(() => {
    if (filters.minValue !== null || filters.maxValue !== null) {
      setMonetaryInterval({
        start: filters.minValue ?? 0,
        end: filters.maxValue ?? 0,
      });

      if (monetaryIntervalStartInputRef.current && filters.minValue !== null) {
        const startInput =
          monetaryIntervalStartInputRef.current as HTMLInputElement;
        startInput.value = formatCurrency(`${filters.minValue}`);
      }

      if (monetaryIntervalEndInputRef.current && filters.maxValue !== null) {
        const endInput =
          monetaryIntervalEndInputRef.current as HTMLInputElement;
        endInput.value = formatCurrency(`${filters.maxValue}`);
      }
    }
    if (filters.status) {
      setTypeFilter(filters.status);
    }
    if (filters.startDate || filters.endDate) {
      setDateInterval({
        start: filters.startDate ?? null,
        end: filters.endDate ?? null,
      });
    }
  }, [
    filters.minValue,
    filters.maxValue,
    filters.status,
    filters.startDate,
    filters.endDate,
  ]);

  React.useEffect(() => {
    if (searchTerm && searchInputRef.current) {
      const searchInputElement = searchInputRef.current as HTMLInputElement;
      searchInputElement.value = searchTerm;
      if (defaultItems && defaultItems.length > 0) {
        getSearch(searchTerm, ["name", "description"]);
      }
    } else if (searchTerm === null && searchInputRef.current) {
      const searchInputElement = searchInputRef.current as HTMLInputElement;
      searchInputElement.value = "";
      setSearchResult(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, defaultItems, setSearchResult]);

  const filteredStatus = React.useMemo(() => {
    return (
      !!searchResult ||
      monetaryInterval.start > 0 ||
      monetaryInterval.end > 0 ||
      typeFilter !== "all" ||
      !!dateInterval.start ||
      !!dateInterval.end
    );
  }, [searchResult, monetaryInterval, typeFilter, dateInterval]);

  const tableColumns = [
    "Nome",
    "Valor (R$)",
    "Tipo",
    "Categoria",
    "Ocorreu em",
    "Recorrência",
    "Descrição",
  ];

  const searchedTransactions = React.useMemo(() => {
    const baseList = searchResult ?? defaultItems;
    let filtered = baseList;

    if (filtered) {
      if (typeFilter !== "all") {
        filtered = filtered?.filter(
          (transaction) => transaction.type === typeFilter,
        );
      }

      // eslint-disable-next-line prefer-const
      let { start, end } = monetaryInterval;
      if (end < start) {
        end = 0;
      }

      filtered = filtered?.filter((transaction) => {
        const minOk = start === 0 || transaction.value >= start;
        const maxOk = end === 0 || transaction.value <= end;

        return minOk && maxOk;
      });

      const { start: startDate, end: endDate } = dateInterval;

      if (startDate || endDate) {
        filtered = filtered.filter((transaction) => {
          const txDate = new Date(transaction.date as string);

          const afterStart = !startDate || txDate >= startDate;
          const beforeEnd = !endDate || txDate <= endDate;

          return afterStart && beforeEnd;
        });
      }

      filtered = [...filtered].sort(
        (a, b) =>
          getTransactionSortDate(b).getTime() -
          getTransactionSortDate(a).getTime(),
      );
    }

    return filtered ?? [];
  }, [searchResult, defaultItems, typeFilter, monetaryInterval, dateInterval]);

  return (
    <>
      <header className={styles.recordsContainerHeader}>
        <InputSearch
          id="transactions-list-search"
          hasNoMargin={true}
          placeholder="Buscar por nome ou descrição"
          onChange={handleSearch}
          ref={searchInputRef}
        />
        <div className={styles.recordsContainerHeaderFilters}>
          <MonetaryValueInterval
            startInputRef={monetaryIntervalStartInputRef}
            endInputRef={monetaryIntervalEndInputRef}
            onChange={handleChangeMonetaryInterval}
          />
          <Select
            id="type"
            groups={[
              {
                children: [
                  { id: "all", value: "Todos" },
                  { id: "credit", value: "Crédito" },
                  { id: "debt", value: "Débito" },
                ] as ITransactionTypeMap[],
              },
            ]}
            value={typeFilter}
            hasNoMargin={true}
            onChange={handleChangeTypeFilter}
          />
          <DateRangeSelector
            id="transactions-list-data-range-filter"
            onChange={handleChangeDateInterverval}
            value={dateRangeValue}
            hasNoMargin={true}
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
            <Button
              icon={Plus}
              color="green"
              size="small"
              title="Adicionar nova transação"
              aria-label="Adicionar nova transação"
              onClick={handleAddNewGoal}
            />
          </div>
        </div>
      </header>
      <div className={styles.recordsContainerContent}>
        {searchedTransactions && searchedTransactions.length > 0 ? (
          <Table id="transactions-list">
            <TableHeader>
              <TableRow>
                {tableColumns.map((name) => (
                  <TableHeaderCell key={name}>{name}</TableHeaderCell>
                ))}
                <TableHeaderCell> </TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {searchedTransactions?.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableDataCell>{transaction.name}</TableDataCell>

                  <TableDataCell>
                    <div className={styles.recordFlex}>
                      {transaction.type === "debt" ? (
                        <MoveDown
                          size={16}
                          className={styles.recordStatusAccent}
                          data-status={transaction.type}
                        />
                      ) : (
                        <MoveUp
                          size={16}
                          className={styles.recordStatusAccent}
                          data-status={transaction.type}
                        />
                      )}
                      {formatCurrency(`${transaction.value}`, false)}
                    </div>
                  </TableDataCell>
                  <TableDataCell>
                    {getTransactionTypeById(transaction.type)}
                  </TableDataCell>
                  <TableDataCell>
                    {getTransactionCategoryById(transaction.category)}
                  </TableDataCell>
                  <TableDataCell>
                    {transaction.occurrenceLog
                      ? formatShortDate(
                          getLatestOccurrenceDate(transaction.occurrenceLog),
                        )
                      : "Pendente"}
                  </TableDataCell>
                  <TableDataCell width={160}>
                    {transaction.recurrence ? (
                      <div>
                        <RefreshCcw
                          size={16}
                          color="#15f5ba"
                          aria-label="É recorrente"
                        />
                        <p className="formWarningText">
                          {getRecurrenceDescription(transaction.recurrence)}
                        </p>
                      </div>
                    ) : (
                      <RefreshCcw
                        size={16}
                        color="#4e4d5b"
                        aria-label="Não é recorrente"
                      />
                    )}
                  </TableDataCell>
                  <TableDataCell>
                    {transaction.description ? (
                      parse(transaction.description)
                    ) : (
                      <span className="formWarningText">...</span>
                    )}
                  </TableDataCell>
                  <TableDataCell>
                    <RecordsOptionsMenu
                      entity={{
                        id: transaction.id,
                        name: transaction.name,
                        type: "transaction",
                      }}
                    />
                  </TableDataCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <RecordsContainerEmptyList
            text={`${
              loading
                ? "Carregando lista de transações..."
                : defaultItems && defaultItems.length > 0
                  ? "Nenhuma transação encontrada para o filtro selecionado."
                  : "Sua lista de transações está vazia. Que tal criar a primeira agora?"
            }`}
          />
        )}
      </div>
    </>
  );
};

export default TransactionsRecordsContent;
