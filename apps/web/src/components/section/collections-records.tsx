import CollectionsRecordsContent from "../records-container/collections-records-content";
import RecordsContainer from "../records-container/records-container";
import Section from "./section";

const CollectionsRecords = () => {
  return (
    <Section id="collections-records" title="Registros de coleções">
      <RecordsContainer>
        <CollectionsRecordsContent />
      </RecordsContainer>
    </Section>
  );
};

export default CollectionsRecords;
