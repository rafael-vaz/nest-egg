import { Search, SearchX } from "lucide-react";
import React from "react";

import { IGoal } from "../../@types/goal";
import useSearch from "../../hooks/search/use-search";
import debounce from "../../utils/debounce";
import Button from "../button/button";
import InfoBox from "../info-box/info-box";
import InputSearch from "../input/input-search";
import Label from "../label/label";
import GoalSelectorAdd from "./goal-selector-add";
import styles from "./goal-selector-header.module.css";

interface IGoalSelectorHeaderProps {
  setSearchedGoals: React.Dispatch<React.SetStateAction<IGoal[] | null>>;
  selectedGoals: IGoal[] | null;
  noCollectGoals: boolean;
  setSelectedGoals: React.Dispatch<React.SetStateAction<IGoal[] | null>>;
}

const GoalSelectorHeader = ({
  noCollectGoals,
  selectedGoals,
  setSearchedGoals,
  setSelectedGoals,
}: IGoalSelectorHeaderProps) => {
  const [activeSearch, setActiveSearch] = React.useState(false);
  const searchInputRef = React.useRef(null);
  const searchButtonDescription = `${
    activeSearch ? "Fechar" : "Abrir"
  } busca de metas seleciondas`;
  const hasSearch = selectedGoals && selectedGoals.length > 1;
  const {
    defaultItems,
    setDefaultItems,
    searchResult,
    setSearchResult,
    getSearch,
  } = useSearch<IGoal>();

  function handleSearchToggle(event: React.MouseEvent) {
    event.preventDefault();
    setActiveSearch((state) => !state);
    setTimeout(() => {
      if (searchInputRef.current) {
        const searchButtonElement = searchInputRef.current as HTMLInputElement;
        searchButtonElement.focus();
      }
    }, 100);
  }

  const debounceGetSearch = debounce(getSearch, 500);

  function handleSearch(event: React.ChangeEvent) {
    const target = event.target as HTMLInputElement;
    const searchTerm = target.value;
    if (searchTerm && searchTerm.length > 0) {
      debounceGetSearch(searchTerm, ["name", "value"]);
      setSearchedGoals(searchResult ? searchResult : defaultItems);
    } else {
      setSearchResult(null);
      setSearchedGoals(null);
    }
  }

  React.useEffect(() => {
    setDefaultItems(selectedGoals);
    setSearchResult(null);
    setSearchedGoals(null);
    if (searchInputRef.current) {
      const searchInputElement = searchInputRef.current as HTMLInputElement;
      searchInputElement.value = "";
    }
  }, [setDefaultItems, setSearchResult, setSearchedGoals, selectedGoals]);

  return (
    <header className={styles.goalSelectorHeader}>
      <div className={styles.goalSelectorHeaderContent}>
        <Label
          text="Metas atribuídas"
          counter={selectedGoals ? selectedGoals.length : 0}
          tabIndex={0}
          hasMargin={false}
        />
        <div className={styles.goalSelectorHeaderControls}>
          {hasSearch && (
            <Button
              size="small"
              title={searchButtonDescription}
              aria-label={searchButtonDescription}
              color="light-gray"
              icon={activeSearch ? SearchX : Search}
              onClick={handleSearchToggle}
            />
          )}
          <InfoBox
            id="goal-selector-infobox"
            label="Saiba mais"
            text="Apenas metas sem coleção serão exibidas na listagem."
            size="small"
          />
          <GoalSelectorAdd
            noCollectGoals={noCollectGoals}
            selectedGoals={selectedGoals}
            setSelectedGoals={setSelectedGoals}
          />
        </div>
      </div>
      {activeSearch && hasSearch && (
        <InputSearch
          id="search-collection-goals"
          placeholder="Buscar metas selecionadas"
          aria-label="Buscar metas selecionadas"
          onChange={handleSearch}
          ref={searchInputRef}
        />
      )}
    </header>
  );
};

export default GoalSelectorHeader;
