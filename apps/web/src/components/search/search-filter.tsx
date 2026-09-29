import {
  useFiltersQueryParams,
  useSearchQueryParams,
} from "../../hooks/search/use-query-params";
import { entitiesMap } from "../../templates/entities-map";
import Button from "../button/button";
import styles from "./search-filter.module.css";

interface SearchFilterProps {
  activeEntity: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setEntity: (value: any | null) => void;
}

const SearchFilter = ({ activeEntity, setEntity }: SearchFilterProps) => {
  const { setFilters } = useFiltersQueryParams();
  const { setSearchTerm } = useSearchQueryParams();
  return (
    <ul className={styles.searchFilter} role="tablist">
      {entitiesMap.map(({ id, value }) => {
        const active = activeEntity === id ? true : false;
        return (
          <li role="presentation" key={id}>
            <Button
              id={id}
              role="tab"
              aria-selected={active}
              aria-controls={`${id}-search-section`}
              className={styles.searchFilterItem}
              data-active={active}
              onClick={() => {
                setSearchTerm(null);
                setFilters(null);
                setEntity(id);
              }}
              text={value}
            />
          </li>
        );
      })}
    </ul>
  );
};

export default SearchFilter;
