import RecordsContainer from "../records-container/records-container";
import SavingsAndExpensesRecordsContent from "../records-container/savings-and-expenses-records-content";
import Section from "./section";

const SavingsAndExpensesRecords = () => {
  return (
    <Section id="savings-and-expenses-records" title="Poupanças e gastos">
      <RecordsContainer>
        <SavingsAndExpensesRecordsContent />
      </RecordsContainer>
    </Section>
  );
};

export default SavingsAndExpensesRecords;
