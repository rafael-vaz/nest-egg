import parse from "html-react-parser";
import { BrushCleaning, ExternalLink, Plus, Tag } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";

import { IGoal } from "../../@types/goal";
import {
  useFiltersQueryParams,
  useSearchQueryParams,
} from "../../hooks/search/use-query-params";
import useSearch from "../../hooks/search/use-search";
import { RootState, useAppDispatch } from "../../store/configure-store";
import { clearAndSetAnnouncementContent } from "../../store/reducers/announcement/announcement-data";
import { openModalState } from "../../store/reducers/modal/modal";
import goalStatusMap, { IGoalStatus } from "../../templates/goal-status-map";
import debounce from "../../utils/debounce";
import getGoalStatusValueById from "../../utils/goal/get-goal-status-value-by-id";
import formatCurrency from "../../utils/text/format-currency";
import Button from "../button/button";
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

const GoalsRecordsContent = () => {
  const dispatch = useAppDispatch();
  const { filters, setFilters } = useFiltersQueryParams();
  const { searchTerm, setSearchTerm } = useSearchQueryParams();
  const {
    defaultItems,
    setDefaultItems,
    searchResult,
    setSearchResult,
    getSearch,
  } = useSearch<IGoal>();
  const { goals, loading } = useSelector(
    (state: RootState) => state.userFinances,
  );
  const [statusFilter, setStatusFilter] = React.useState(filters.status);
  const [monetaryInterval, setMonetaryInterval] = React.useState({
    start: filters.minValue ?? 0,
    end: filters.maxValue ?? 0,
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

  const handleChangeStatusFilter = React.useCallback(
    (value: string) => {
      setStatusFilter(value);
      setFilters({ status: value });
    },
    [setFilters],
  );

  const handleAddNewGoal = React.useCallback(() => {
    dispatch(openModalState({ id: "new-goal" }));
  }, [dispatch]);

  const clearFilters = React.useCallback(() => {
    setSearchResult(null);
    setMonetaryInterval({ start: 0, end: 0 });
    setStatusFilter("all");
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
    setDefaultItems(goals);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goals]);

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
      setStatusFilter(filters.status);
    }
  }, [filters.minValue, filters.maxValue, filters.status]);

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
    const { start, end } = monetaryInterval;
    return !!searchResult || start > 0 || end > 0 || statusFilter !== "all";
  }, [searchResult, monetaryInterval, statusFilter]);

  const tableColumns = [
    "Nome",
    "Valor (R$)",
    "Status",
    "Viabilidade",
    "Coleção",
    "Descrição",
  ];

  const searchedGoals = React.useMemo(() => {
    const baseList = searchResult ?? defaultItems;
    let filtered = baseList;

    if (filtered) {
      if (statusFilter !== "all") {
        filtered = filtered?.filter((goal) => goal.status === statusFilter);
      }

      // eslint-disable-next-line prefer-const
      let { start, end } = monetaryInterval;
      if (end < start) {
        end = 0;
      }

      filtered = filtered?.filter((goal) => {
        const minOk = start === 0 || goal.value >= start;
        const maxOk = end === 0 || goal.value <= end;

        return minOk && maxOk;
      });
    }

    return filtered ?? [];
  }, [searchResult, defaultItems, statusFilter, monetaryInterval]);

  return (
    <>
      <header className={styles.recordsContainerHeader}>
        <InputSearch
          id="goals-list-search"
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
            id="status"
            groups={[
              {
                children: [
                  { id: "all", value: "Todos", statusColor: "white" },
                  ...goalStatusMap,
                ] as IGoalStatus[],
              },
            ]}
            value={statusFilter}
            hasNoMargin={true}
            onChange={handleChangeStatusFilter}
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
              title="Adicionar nova meta"
              aria-label="Adicionar nova meta"
              onClick={handleAddNewGoal}
            />
          </div>
        </div>
      </header>
      <div className={styles.recordsContainerContent}>
        {searchedGoals && searchedGoals.length > 0 ? (
          <Table id="goals-list">
            <TableHeader>
              <TableRow>
                {tableColumns.map((name) => (
                  <TableHeaderCell key={name}>{name}</TableHeaderCell>
                ))}
                <TableHeaderCell> </TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {searchedGoals?.map((goal) => (
                <TableRow key={goal.id}>
                  <TableDataCell>{goal.name}</TableDataCell>
                  <TableDataCell>
                    {formatCurrency(`${goal.value}`, false)}
                  </TableDataCell>
                  <TableDataCell>
                    <div className={styles.recordFlex}>
                      <Tag
                        size={16}
                        className={styles.recordStatusAccent}
                        data-status={goal.status}
                      />
                      {getGoalStatusValueById(goal.status)}
                    </div>
                  </TableDataCell>
                  <TableDataCell>20%</TableDataCell>
                  <TableDataCell>
                    {goal.collection ? (
                      <div className={styles.recordFlex}>
                        <Button
                          icon={ExternalLink}
                          text="Acessar"
                          aria-label={`Acessar coleção`}
                          color="transparent"
                          className={styles.recordsContainerLink}
                          onClick={() =>
                            dispatch(
                              openModalState({
                                id: "update-collection",
                                entity: goal.collection!.id,
                              }),
                            )
                          }
                        />
                      </div>
                    ) : (
                      <span className="formWarningText">...</span>
                    )}
                  </TableDataCell>
                  <TableDataCell>
                    {goal.description ? (
                      parse(goal.description)
                    ) : (
                      <span className="formWarningText">...</span>
                    )}
                  </TableDataCell>
                  <TableDataCell>
                    <RecordsOptionsMenu
                      entity={{ id: goal.id, name: goal.name, type: "goal" }}
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
                ? "Carregando lista de metas..."
                : defaultItems && defaultItems.length > 0
                  ? "Nenhuma meta encontrada para o filtro selecionado."
                  : "Sua lista de metas está vazia. Que tal criar a primeira agora?"
            }`}
          />
        )}
      </div>
    </>
  );
};

export default GoalsRecordsContent;
