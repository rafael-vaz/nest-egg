import RecordsContainer from "../records-container/records-container";
import TransactionsRecordsContent from "../records-container/transactions-records-content";
import Section from "./section";

const TransactionsRecords = () => {
  return (
    <Section id="transactions-records" title="Registros de trasações">
      <RecordsContainer>
        <TransactionsRecordsContent />
      </RecordsContainer>
    </Section>
  );
};

export default TransactionsRecords;
