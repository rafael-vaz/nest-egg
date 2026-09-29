import {
  createParser,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryState,
  useQueryStates,
} from "nuqs";

const parseAsLocalDate = createParser({
  parse(value: string) {
    if (!value) return null;
    const [year, month, day] = value.split("-").map(Number);
    if (!year || !month || !day) return null;
    return new Date(year, month - 1, day);
  },
  serialize(value: Date) {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  },
});

export function useSearchQueryParams() {
  const searchEntityIds = ["goals", "transactions", "collections"] as const;
  const [searchTerm, setSearchTerm] = useQueryState(
    "searchTerm",
    parseAsString.withDefault(""),
  );
  const [entity, setEntity] = useQueryState(
    "entity",
    parseAsStringLiteral(searchEntityIds),
  );
  return {
    searchTerm,
    setSearchTerm,
    entity,
    setEntity,
  };
}

export function useFiltersQueryParams() {
  const [filters, setFilters] = useQueryStates({
    startDate: parseAsLocalDate,
    endDate: parseAsLocalDate,
    minValue: parseAsInteger,
    maxValue: parseAsInteger,
    status: parseAsString.withDefault("all"),
    id: parseAsString,
  });

  return {
    filters,
    setFilters,
  };
}

export function useModalQueryParam() {
  const [modal, setModal] = useQueryState("modal", parseAsString);
  const openModal = (modalName: string) => setModal(modalName);
  const closeModal = () => setModal(null);

  return {
    modal,
    openModal,
    closeModal,
    isOpen: (modalName: string) => modal === modalName,
  };
}
