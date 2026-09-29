import { ChartColumnDecreasing } from "lucide-react";

import PieChartComponent from "../charts/pie-chart";
import Card from "./card";

const GoalStatusCard = () => {
  const data = [
    { name: "Concluída", value: 400, color: "#15f5ba" },
    { name: "A confirmar", value: 300, color: "#836fff" },
    { name: "Em espera", value: 150, color: "#e67e22" },
    { name: "Não iniciada", value: 200, color: "#9d9baf" },
  ];
  return (
    <Card
      id="goal-status"
      title="Status das metas"
      icon={ChartColumnDecreasing}
    >
      <PieChartComponent data={data} />
    </Card>
  );
};

export default GoalStatusCard;
