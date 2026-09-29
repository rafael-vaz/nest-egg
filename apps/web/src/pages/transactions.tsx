import Head from "../components/head/Head";
import SummaryOfOperations from "../components/section/summary-of-operations";
import TransactionsRecords from "../components/section/transactions-records";
import Separator from "../components/separator/separator";
import Title from "../components/title/title";

const Transactions = () => {
  return (
    <>
      <Head pageTitle="Transações" />
      <Title text="Transações" />
      <Separator margin="medium" />
      <SummaryOfOperations />
      <TransactionsRecords />
    </>
  );
};

export default Transactions;
