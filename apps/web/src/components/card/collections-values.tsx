import { CircleDollarSign } from "lucide-react";

import PieChartComponent from "../charts/pie-chart";
import Card from "./card";

const CollectionValues = () => {
  const data = [
    { name: "a. 0 - 500", value: 20, color: "#9d9baf" },
    { name: "b. 501 - 2.000", value: 35, color: "#e67e22" },
    { name: "c. 2.001 - 5.000", value: 60, color: "#836fff" },
    { name: "d. 5.001 acima", value: 90, color: "#15f5ba" },
  ];
  return (
    <Card
      id="collections-progress"
      title="Resumo de valores"
      icon={CircleDollarSign}
    >
      <PieChartComponent data={data} />
    </Card>
  );
};

export default CollectionValues;
