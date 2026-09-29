import { CircleDollarSign } from "lucide-react";

import PieChartComponent from "../charts/pie-chart";
import Card from "./card";

const GoalsFeasibility = () => {
  const data = [
    { name: "0 - 25%", value: 20, color: "#9d9baf" },
    { name: "25 - 50%", value: 35, color: "#e67e22" },
    { name: "50 - 75%", value: 60, color: "#836fff" },
    { name: "75 - 100%", value: 90, color: "#15f5ba" },
  ];
  return (
    <Card
      id="goals-feasibility"
      title="Viabilidade das Metas"
      icon={CircleDollarSign}
    >
      <PieChartComponent data={data} />
    </Card>
  );
};

export default GoalsFeasibility;
