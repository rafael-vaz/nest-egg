import React from "react";

import filterItemsBySearchName from "../../utils/search/filterItemsBySearchName";

function useSearch<T>() {
  const [defaultItems, setDefaultItems] = React.useState<T[] | null>(null);
  const [searchResult, setSearchResult] = React.useState<T[] | null>(null);

  const getSearch = React.useCallback(
    (searchTerm: string, keys: string[]) => {
      if (defaultItems && defaultItems.length > 0) {
        const result = filterItemsBySearchName(searchTerm, defaultItems, keys);
        if (result && result.length > 0) {
          setSearchResult(result as T[]);
        } else {
          setSearchResult(null);
        }
      }
    },
    [defaultItems]
  );

  return {
    defaultItems,
    setDefaultItems,
    searchResult,
    setSearchResult,
    getSearch,
  };
}

export default useSearch;
