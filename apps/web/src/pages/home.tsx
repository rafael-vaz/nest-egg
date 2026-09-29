import Head from "../components/head/Head";
import BalancesAndGoals from "../components/section/balances-and-goals";
import PreviousMonth from "../components/section/previous-month";
import SummaryOfOperations from "../components/section/summary-of-operations";
import Separator from "../components/separator/separator";
import Title from "../components/title/title";

const Home = () => {
  return (
    <>
      <Head pageTitle="Home" />
      <Title text="Visão geral" />
      <Separator margin="medium" />
      <BalancesAndGoals />
      <SummaryOfOperations />
      <PreviousMonth />
    </>
  );
};

export default Home;
