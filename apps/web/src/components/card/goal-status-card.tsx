import { ChartColumnDecreasing } from "lucide-react";
import { useSelector } from "react-redux";

import { RootState } from "../../store/configure-store";
import PieChartComponent from "../charts/pie-chart";
import Card from "./card";

const GoalStatusCard = () => {
  const { goals } = useSelector((state: RootState) => state.userFinances);

  const countByStatus = (status: string) =>
    goals.filter((goal) => goal.status === status).length;

  const data = [
    { name: "Concluída", value: countByStatus("completed"), color: "#15f5ba" },
    { name: "A confirmar", value: countByStatus("confirm"), color: "#836fff" },
    { name: "Em espera", value: countByStatus("waiting"), color: "#e67e22" },
    {
      name: "Não iniciada",
      value: countByStatus("unintended"),
      color: "#9d9baf",
    },
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
