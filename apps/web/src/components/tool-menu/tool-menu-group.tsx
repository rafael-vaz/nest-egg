import {
  ChevronRight,
  CirclePlus,
  LucideProps,
  RefreshCcw,
  Tag,
} from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { ICollection } from "../../@types/collection";
import { IGoal } from "../../@types/goal";
import { ModalId } from "../../@types/modal";
import { ITransaction } from "../../@types/transaction";
import useSearch from "../../hooks/search/use-search";
import { RootState, useAppDispatch } from "../../store/configure-store";
import { openModalState } from "../../store/reducers/modal/modal";
import { closeToolMenuState } from "../../store/reducers/tool-menu/tool-menu";
import debounce from "../../utils/debounce";
import getGoalStatusColorById from "../../utils/goal/get-goal-status-color-by-id";
import getGoalStatusValueById from "../../utils/goal/get-goal-status-value-by-id";
import sortByKey from "../../utils/sort-by-key";
import formatCurrency from "../../utils/text/format-currency";
import getLatestOccurrenceDate from "../../utils/transaction/get-last-occurrence-date";
import Button from "../button/button";
import InputSearch from "../input/input-search";
import ToolMenuEmptyList from "./tool-menu-empty-list";
import styles from "./tool-menu-group.module.css";
import ToolMenuGroupItem from "./tool-menu-group-item";
import ToolMenuGroupList from "./tool-menu-group-list";

interface IToolMenuGroup {
  id: string;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref">>;
  title: string;
  hasAddButton?: boolean;
}

const ToolMenuGroup = ({ id, icon: Icon, title }: IToolMenuGroup) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [active, setActive] = React.useState(false);
  const [showContent, setShowContent] = React.useState(false);
  const [isControlFocus, setControlFocus] = React.useState(false);
  const [activeIcon, setActiveIcon] =
    React.useState<React.ForwardRefExoticComponent<Omit<LucideProps, "ref">>>(
      Icon,
    );
  const { collections, goals, transactions } = useSelector(
    (state: RootState) => state.userFinances,
  );
  const {
    defaultItems,
    setDefaultItems,
    searchResult,
    setSearchResult,
    getSearch,
  } = useSearch<IGoal | ICollection | ITransaction>();
  const debounceGetSearch = debounce(getSearch, 200);
  const [searchedItems, setSearchedItems] = React.useState<Array<
    ICollection | IGoal | ITransaction
  > | null>(getGroupItems());

  const [isHeaderFocus, setHeaderFocus] = React.useState(false);
  const controlRef = React.useRef(null);
  const actionRef = React.useRef(null);
  const controlDescription = `${active ? "Esconder" : "Mostrar"} conteúdo`;

  function handleActionButtonClick(id: string) {
    dispatch(openModalState({ id: `new-${id.slice(0, -1)}` as ModalId }));
  }

  function handleToggleActive() {
    if (active) {
      setActive(false);
    } else {
      setShowContent(true);
      requestAnimationFrame(() => {
        setActive(true);
      });
    }
  }

  function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    const searchTerm = event.target.value;
    if (searchTerm) {
      debounceGetSearch(searchTerm, ["name"]);
    } else {
      setSearchResult(null);
    }
  }

  function handleGroupClick(event: React.MouseEvent) {
    const target = event.target;
    if (target != controlRef.current && target != actionRef.current) {
      navigate(`/${id}`);
      dispatch(closeToolMenuState());
    }
  }

  React.useEffect(() => {
    const items = getGroupItems();
    setDefaultItems(items);
    setSearchedItems(items);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (searchResult) {
      setSearchedItems(searchResult);
    } else {
      setSearchedItems(defaultItems);
    }
  }, [searchResult, defaultItems]);

  function getGroupItems() {
    switch (id) {
      case "collections":
        return sortByKey<ICollection>(collections, "name");
      case "goals":
        return sortByKey<IGoal>(goals, "name");
      case "transactions":
        return sortByKey<ITransaction>(transactions, "name");
      default:
        return null;
    }
  }

  function getGroupContent() {
    let content = null;
    let currentItems = null;
    if (searchedItems && searchedItems.length > 0) {
      switch (id) {
        case "collections":
          currentItems = searchedItems as ICollection[];
          content = currentItems.map((collection) => {
            const index = collection.goals?.length ?? 0;
            const label = index > 1 ? "metas" : "meta";
            return (
              <ToolMenuGroupItem
                id={`${collection.id}`}
                key={collection.id}
                text={collection.name}
                value={`${index} ${label}`}
                onClick={() =>
                  dispatch(
                    openModalState({
                      id: "update-collection",
                      entity: collection.id,
                    }),
                  )
                }
              />
            );
          });
          break;
        case "goals":
          currentItems = searchedItems as IGoal[];
          content = currentItems.map((goal) => {
            return (
              <ToolMenuGroupItem
                id={`${goal.id}`}
                icon={Tag}
                iconDescription={getGoalStatusValueById(goal.status)}
                iconColor={getGoalStatusColorById(goal.status)}
                key={goal.id}
                text={goal.name}
                value={`${formatCurrency(`${goal.value}`)}`}
                onClick={() =>
                  dispatch(
                    openModalState({
                      id: "update-goal",
                      entity: goal.id,
                    }),
                  )
                }
              />
            );
          });
          break;
        case "transactions":
          currentItems = searchedItems as ITransaction[];
          content = currentItems.map((transaction) => {
            const isCredit = transaction.type === "credit";
            const transactionDate = transaction.occurrenceLog
              ? getLatestOccurrenceDate(transaction.occurrenceLog)
              : new Date(transaction.date as Date);
            return (
              <ToolMenuGroupItem
                id={`${transaction.id}`}
                key={transaction.id}
                text={transaction.name}
                value={`${isCredit ? "+" : "-"} ${formatCurrency(
                  `${transaction.value}`,
                )}`}
                valueColor={`${isCredit ? "green" : "red"}`}
                valueDescription={`${
                  isCredit ? "Crédito" : "Débito"
                } de ${formatCurrency(`${transaction.value}`)}`}
                date={transactionDate}
                icon={RefreshCcw}
                iconColor={transaction.hasRecurrence ? "green" : "gray"}
                iconDescription={
                  transaction.hasRecurrence
                    ? "É recorrente"
                    : "Não é recorrente"
                }
                onClick={() =>
                  dispatch(
                    openModalState({
                      id: "update-transaction",
                      entity: transaction.id,
                    }),
                  )
                }
              />
            );
          });
          break;
      }
    }
    return content;
  }

  return (
    <div
      id={`tool-group-${id}`}
      aria-label={title}
      className={styles.toolMenuGroup}
      data-active={active}
      tabIndex={0}
    >
      <header
        onClick={handleGroupClick}
        className={styles.toolMenuGroupHeader}
        onMouseEnter={() => {
          setHeaderFocus(true);
          setActiveIcon(ChevronRight);
        }}
        onMouseLeave={() => {
          if (isControlFocus) {
            setActiveIcon(ChevronRight);
          } else {
            setActiveIcon(Icon);
          }
          setHeaderFocus(false);
        }}
      >
        <div className={styles.toolMenuGroupHeaderName}>
          <Button
            icon={activeIcon}
            size="small"
            color="transparent"
            aria-label={controlDescription}
            title={controlDescription}
            className={`${styles.toolMenuGroupHeaderButton} ${styles.toolMenuGroupHeaderControl}`}
            onClick={handleToggleActive}
            aria-controls={`group-${id}-list`}
            aria-expanded={active}
            onFocus={() => {
              setControlFocus(true);
              setActiveIcon(ChevronRight);
            }}
            onBlur={() => {
              setControlFocus(false);
              if (!isHeaderFocus) setActiveIcon(Icon);
            }}
            ref={controlRef}
          />
          <span>{title}</span>
        </div>
        <Button
          icon={CirclePlus}
          size="small"
          color="transparent"
          className={`${styles.toolMenuGroupHeaderButton} ${styles.toolMenuGroupHeaderActionButton}`}
          title="Criar"
          aria-label="Criar"
          onClick={() => handleActionButtonClick(id)}
          ref={actionRef}
        />
      </header>

      <div
        id={`group-${id}-list`}
        className={`${styles.toolMenuGroupContent} smoothScrollbar`}
        role="listbox"
        tabIndex={0}
        hidden={!showContent}
        aria-hidden={!showContent}
        onTransitionEnd={() => {
          if (!active) setShowContent(false);
        }}
      >
        {defaultItems && defaultItems.length > 0 ? (
          <ToolMenuGroupList>
            <>
              {defaultItems && defaultItems.length > 3 && (
                <InputSearch
                  id={`group-${id}-search`}
                  placeholder="Buscar"
                  hasNoMargin={true}
                  className={styles.toolMenuGroupSearchInput}
                  onChange={handleSearch}
                />
              )}
              {defaultItems && getGroupContent()}
            </>
          </ToolMenuGroupList>
        ) : (
          <ToolMenuEmptyList text="Nenhum registro encontrado." />
        )}
      </div>
    </div>
  );
};

export default ToolMenuGroup;
