import Head from "../components/head/Head";
import CollectionsRecords from "../components/section/collections-records";
import CurrentSituationCollections from "../components/section/current-situation-collections";
import Separator from "../components/separator/separator";
import Title from "../components/title/title";

const Collections = () => {
  return (
    <>
      <Head pageTitle="Coleções" />
      <Title text="Coleções" />
      <Separator margin="medium" />
      <CurrentSituationCollections />
      <CollectionsRecords />
    </>
  );
};

export default Collections;
