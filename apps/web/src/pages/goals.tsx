import Head from "../components/head/Head";
import CurrentSituationGoals from "../components/section/current-situation-goals";
import GoalsRecords from "../components/section/goals-records";
import Separator from "../components/separator/separator";
import Title from "../components/title/title";

const Goals = () => {
  return (
    <>
      <Head pageTitle="Metas" />
      <Title text="Metas" />
      <Separator margin="medium" />
      <CurrentSituationGoals />
      <GoalsRecords />
    </>
  );
};

export default Goals;
