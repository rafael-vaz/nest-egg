import parse from "html-react-parser";
import { BrushCleaning, Plus } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";

import { ICollection } from "../../@types/collection";
import { IGoal } from "../../@types/goal";
import {
  useFiltersQueryParams,
  useSearchQueryParams,
} from "../../hooks/search/use-query-params";
import useSearch from "../../hooks/search/use-search";
import { RootState, useAppDispatch } from "../../store/configure-store";
import { clearAndSetAnnouncementContent } from "../../store/reducers/announcement/announcement-data";
import { openModalState } from "../../store/reducers/modal/modal";
import calculateTotalGoalsValue from "../../utils/collection/calculateTotalGoalsValue";
import getCompletedGoalRate from "../../utils/collection/getCompletedGoalRate";
import debounce from "../../utils/debounce";
import formatCurrency from "../../utils/text/format-currency";
import Button from "../button/button";
import InputSearch from "../input/input-search";
import MonetaryValueInterval from "../monetary-value-interval/monetary-value-interval";
import Table from "../table/table";
import TableBody from "../table/table-body";
import TableDataCell from "../table/table-data-cell";
import TableHeader from "../table/table-header";
import TableHeaderCell from "../table/table-header-cell";
import TableRow from "../table/table-row";
import styles from "./records-container.module.css";
import RecordsContainerEmptyList from "./records-container-empty-list";
import RecordsOptionsMenu from "./records-options-menu";

type FormatedCollection = Omit<ICollection, "goals"> & {
  goals: IGoal[] | null;
  value: number;
  completedGoalRate: number;
};

const CollectionsRecordsContent = () => {
  const dispatch = useAppDispatch();
  const { filters, setFilters } = useFiltersQueryParams();
  const { searchTerm, setSearchTerm } = useSearchQueryParams();
  const {
    defaultItems,
    setDefaultItems,
    searchResult,
    setSearchResult,
    getSearch,
  } = useSearch<FormatedCollection>();
  const { collections, goals, loading } = useSelector(
    (state: RootState) => state.userFinances,
  );
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

  const handleAddNewGoal = React.useCallback(() => {
    dispatch(openModalState({ id: "new-collection" }));
  }, [dispatch]);

  const clearFilters = React.useCallback(() => {
    setSearchResult(null);
    setMonetaryInterval({ start: 0, end: 0 });
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
    const formatedCollections = collections?.map((collection) => {
      const collectionGoals =
        collection.goals?.map((collectionGoal) => {
          return goals.find((goal) => goal.id === collectionGoal.id)!;
        }) ?? null;
      return {
        ...collection,
        goals: collectionGoals,
        value: collectionGoals ? calculateTotalGoalsValue(collectionGoals) : 0,
        completedGoalRate: collectionGoals
          ? getCompletedGoalRate(collectionGoals)
          : 0,
      };
    });
    setDefaultItems(formatedCollections);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collections, goals]);

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
  }, [filters.minValue, filters.maxValue]);

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
    return !!searchResult || start > 0 || end > 0;
  }, [searchResult, monetaryInterval]);

  const tableColumns = [
    "Nome",
    "Total metas",
    "Metas concluídas",
    "Valor total (R$)",
    "Descrição",
  ];

  const searchedCollections = React.useMemo(() => {
    const baseList = searchResult ?? defaultItems;
    let filtered = baseList;

    if (filtered) {
      // eslint-disable-next-line prefer-const
      let { start, end } = monetaryInterval;
      if (end < start) {
        end = 0;
      }

      filtered = filtered?.filter((collection) => {
        const minOk = start === 0 || collection.value >= start;
        const maxOk = end === 0 || collection.value <= end;

        return minOk && maxOk;
      });
    }

    return filtered ?? [];
  }, [searchResult, defaultItems, monetaryInterval]);

  return (
    <>
      <header className={styles.recordsContainerHeader}>
        <InputSearch
          id="collections-list-search"
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
              title="Adicionar nova coleção"
              aria-label="Adicionar nova coleção"
              onClick={handleAddNewGoal}
            />
          </div>
        </div>
      </header>
      <div className={styles.recordsContainerContent}>
        {searchedCollections && searchedCollections.length > 0 ? (
          <Table id="collections-list">
            <TableHeader>
              <TableRow>
                {tableColumns.map((name) => (
                  <TableHeaderCell key={name}>{name}</TableHeaderCell>
                ))}
                <TableHeaderCell> </TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {searchedCollections?.map((collection) => (
                <TableRow key={collection.id}>
                  <TableDataCell>{collection.name}</TableDataCell>
                  <TableDataCell>{collection.goals?.length ?? 0}</TableDataCell>
                  <TableDataCell>
                    {`${collection.completedGoalRate * 100}%`}
                  </TableDataCell>
                  <TableDataCell>
                    {formatCurrency(`${collection.value}`, false)}
                  </TableDataCell>
                  <TableDataCell>
                    {collection.description ? (
                      parse(collection.description)
                    ) : (
                      <span className="formWarningText">...</span>
                    )}
                  </TableDataCell>
                  <TableDataCell>
                    <RecordsOptionsMenu
                      entity={{
                        id: collection.id,
                        name: collection.name,
                        type: "collection",
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
                ? "Carregando lista de coleções..."
                : defaultItems && defaultItems.length > 0
                  ? "Nenhuma coleção encontrada para o filtro selecionado."
                  : "Sua lista de coleções está vazia. Que tal criar a primeira agora?"
            }`}
          />
        )}
      </div>
    </>
  );
};

export default CollectionsRecordsContent;
