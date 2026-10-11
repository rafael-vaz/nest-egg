import { CircleDollarSign } from "lucide-react";
import { useSelector } from "react-redux";

import { RootState } from "../../store/configure-store";
import bucketGoalsByValue from "../../utils/goal/bucket-goals-by-value";
import PieChartComponent from "../charts/pie-chart";
import Card from "./card";

const CollectionValues = () => {
  const { goals } = useSelector((state: RootState) => state.userFinances);
  const buckets = bucketGoalsByValue(goals);

  const data = [
    { name: "a. 0 - 500", value: buckets["0 - 500"], color: "#9d9baf" },
    {
      name: "b. 501 - 2.000",
      value: buckets["501 - 2.000"],
      color: "#e67e22",
    },
    {
      name: "c. 2.001 - 5.000",
      value: buckets["2.001 - 5.000"],
      color: "#836fff",
    },
    {
      name: "d. 5.001 acima",
      value: buckets["5.001 acima"],
      color: "#15f5ba",
    },
  ];

  return (
    <Card
      id="collections-values"
      title="Resumo de valores"
      icon={CircleDollarSign}
    >
      <PieChartComponent data={data} />
    </Card>
  );
};

export default CollectionValues;
