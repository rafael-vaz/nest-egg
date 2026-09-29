import { Coins } from "lucide-react";

import StackedBarChart from "../charts/stacked-bar-chart";
import Card from "./card";

const SavingsAndExpensesCard = () => {
  const keys = [
    { id: "savings", color: "#15f5ba" },
    { id: "expenses", color: "#e74c3c" },
  ] as const;

  const translations = {
    savings: "Poupado",
    expenses: "Gasto",
  } as const;

  const data = [
    {
      name: "Page A",
      savings: 1200,
      expenses: 800,
    },
    {
      name: "Page B",
      savings: 2200,
      expenses: 1500,
    },
    {
      name: "Page C",
      savings: 1800,
      expenses: 3200,
    },
    {
      name: "Page D",
      savings: 2500,
      expenses: 2100,
    },
    {
      name: "Page E",
      savings: 3000,
      expenses: 4000,
    },
    {
      name: "Page F",
      savings: 2800,
      expenses: 3500,
    },
    {
      name: "Page G",
      savings: 3500,
      expenses: 5000,
    },
  ];
  return (
    <Card
      id="savings-and-expenses"
      title="Poupanças e gastos"
      icon={Coins}
      hasFilter={true}
    >
      <StackedBarChart keys={keys} data={data} translations={translations} />
    </Card>
  );
};

export default SavingsAndExpensesCard;
