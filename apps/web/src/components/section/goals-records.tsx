import GoalsRecordsContent from "../records-container/goals-records-content";
import RecordsContainer from "../records-container/records-container";
import Section from "./section";

const GoalsRecords = () => {
  return (
    <Section id="goals-records" title="Registros de metas">
      <RecordsContainer>
        <GoalsRecordsContent />
      </RecordsContainer>
    </Section>
  );
};

export default GoalsRecords;
