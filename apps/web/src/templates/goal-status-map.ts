import { ISelectOption } from "../components/select/select";

type GoalStatusId =
  | "active"
  | "waiting"
  | "completed"
  | "confirm"
  | "unintended";

type GaolStatusColor = "blue" | "orange" | "green" | "purple" | "white";

export interface IGoalStatus extends ISelectOption {
  id: GoalStatusId;
  statusColor: GaolStatusColor;
  value: string;
}

const goalStatusMap: IGoalStatus[] = [
  {
    id: "active",
    value: "Ativa",
    statusColor: "blue",
  },
  {
    id: "waiting",
    value: "Em espera",
    statusColor: "orange",
  },
  {
    id: "completed",
    value: "Concluído",
    statusColor: "green",
  },
  {
    id: "confirm",
    value: "A Confirmar",
    statusColor: "purple",
  },
  {
    id: "unintended",
    value: "Não iniciada",
    statusColor: "white",
  },
];

export default goalStatusMap;
