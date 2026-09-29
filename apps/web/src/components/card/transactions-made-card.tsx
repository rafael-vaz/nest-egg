import { DatesRangeValue } from "@mantine/dates";
import { ChartCandlestick } from "lucide-react";
import React from "react";

import StackedAreaChart from "../charts/stacked-area-chart";
import Card from "./card";

const TransactionsMadeCard = () => {
  const [filteredData, setFilteredData] = React.useState<
    DatesRangeValue<string>
  >([null, null]);

  const keys = [
    { id: "credit", color: "#15f5ba" },
    { id: "debt", color: "#e74c3c" },
  ] as const;

  const translations = {
    debt: "Débito",
    credit: "Crédito",
  } as const;

  React.useEffect(() => {
    /*  console.log(filteredData); */
  }, [filteredData]);

  const data = [
    {
      name: "Page A",
      debt: 1200,
      credit: 800,
    },
    {
      name: "Page B",
      debt: 2200,
      credit: 1500,
    },
    {
      name: "Page C",
      debt: 1800,
      credit: 3200,
    },
    {
      name: "Page D",
      debt: 2500,
      credit: 2100,
    },
    {
      name: "Page E",
      debt: 3000,
      credit: 4000,
    },
    {
      name: "Page F",
      debt: 2800,
      credit: 3500,
    },
    {
      name: "Page G",
      debt: 3500,
      credit: 5000,
    },
  ];

  function onFilterChange(value: DatesRangeValue<string>) {
    setFilteredData(value);
  }

  return (
    <Card
      id="transactions-made"
      title="Transações realizadas"
      icon={ChartCandlestick}
      hasFilter={true}
      onFilterChange={onFilterChange}
    >
      <StackedAreaChart keys={keys} data={data} translations={translations} />
    </Card>
  );
};

export default TransactionsMadeCard;
