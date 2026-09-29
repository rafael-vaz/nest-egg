import { Banknote, FolderCheck, ListChecks, LucideProps } from "lucide-react";
import React, { ReactNode } from "react";

import { useSearchQueryParams } from "../../hooks/search/use-query-params";
import CollectionsRecordsContent from "../records-container/collections-records-content";
import GoalsRecordsContent from "../records-container/goals-records-content";
import recordsContainerStyles from "../records-container/records-container.module.css";
import TransactionsRecordsContent from "../records-container/transactions-records-content";
import SearchFilter from "./search-filter";
import styles from "./search-records.module.css";

type SearchEntityId = "goals" | "transactions" | "collections";

interface ISearchEntityContent {
  id: SearchEntityId;
  title: string;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref">>;
  records: ReactNode;
}
const SearchRecords = () => {
  const { entity, setEntity } = useSearchQueryParams();
  const searchEntitiesContentMap: ISearchEntityContent[] = [
    {
      id: "goals",
      title: "Metas",
      icon: ListChecks,
      records: <GoalsRecordsContent />,
    },
    {
      id: "collections",
      title: "Coleções",
      icon: FolderCheck,
      records: <CollectionsRecordsContent />,
    },
    {
      id: "transactions",
      title: "Transações",
      icon: Banknote,
      records: <TransactionsRecordsContent />,
    },
  ];

  function getSearchEntityContent(entityId: string) {
    const entity = searchEntitiesContentMap.find(
      (entity) => entity.id === entityId,
    );
    if (!entity) return <></>;
    const { id, title, icon: Icon, records } = entity;
    return (
      <section
        id={`${id}-search-section`}
        className={`${styles.searchSection} smoothScrollbar`}
        role="tabpanel"
      >
        <h4 className={styles.searchSectionTitle}>
          <Icon size={16} />
          <span>{title}</span>
        </h4>
        {records}
      </section>
    );
  }

  React.useEffect(() => {
    if (!entity) setEntity("goals");
  }, [entity, setEntity]);

  React.useEffect(() => {
    return () => {
      setEntity(null);
    };
  }, [setEntity]);

  return (
    entity && (
      <div className={recordsContainerStyles.recordsContainer}>
        <SearchFilter activeEntity={entity} setEntity={setEntity} />
        {getSearchEntityContent(entity)}
      </div>
    )
  );
};

export default SearchRecords;
