import { CircleDollarSign } from "lucide-react";
import { useSelector } from "react-redux";

import { RootState } from "../../store/configure-store";
import bucketGoalsByProgress from "../../utils/goal/bucket-goals-by-progress";
import PieChartComponent from "../charts/pie-chart";
import Card from "./card";

const GoalsFeasibility = () => {
  const { authUser } = useSelector((state: RootState) => state.userAuth);
  const { goals } = useSelector((state: RootState) => state.userFinances);
  const walletValue = authUser?.wallet ?? 0;
  const buckets = bucketGoalsByProgress(goals, walletValue);

  const data = [
    { name: "0 - 25%", value: buckets["0 - 25%"], color: "#9d9baf" },
    { name: "25 - 50%", value: buckets["25 - 50%"], color: "#e67e22" },
    { name: "50 - 75%", value: buckets["50 - 75%"], color: "#836fff" },
    { name: "75 - 100%", value: buckets["75 - 100%"], color: "#15f5ba" },
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
