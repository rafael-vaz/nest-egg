import Head from "../components/head/Head";
import BalancesAndMovements from "../components/section/balances-and-movements";
import SavingsAndExpensesRecords from "../components/section/savings-and-expenses-records";
import SummaryOfOperations from "../components/section/summary-of-operations";
import TransactionsRecords from "../components/section/transactions-records";
import Separator from "../components/separator/separator";
import Title from "../components/title/title";

const Wallet = () => {
  return (
    <>
      <Head pageTitle="Carteira" />
      <Title text="Carteira" />
      <Separator margin="medium" />
      <BalancesAndMovements />
      <SummaryOfOperations />
      <TransactionsRecords />
      <SavingsAndExpensesRecords />
    </>
  );
};

export default Wallet;
