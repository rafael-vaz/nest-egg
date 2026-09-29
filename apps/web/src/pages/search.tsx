import Head from "../components/head/Head";
import SearchRecords from "../components/search/search-records";
import Separator from "../components/separator/separator";
import Title from "../components/title/title";

const Search = () => {
  return (
    <>
      <Head pageTitle="Buscar" />
      <Title text="Buscar" />
      <Separator margin="medium" />
      <SearchRecords />
    </>
  );
};

export default Search;
