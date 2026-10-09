import {
  Banknote,
  CircleDollarSign,
  FolderCheck,
  ListChecks,
  LucideProps,
  User,
} from "lucide-react";
import React from "react";

import { ActivityEntityType } from "../@types/activity";

export interface IActivityEntity {
  id: ActivityEntityType;
  value: string;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref">>;
}

const activityEntityMap: IActivityEntity[] = [
  { id: "transaction", value: "Transação", icon: Banknote },
  { id: "goal", value: "Meta", icon: ListChecks },
  { id: "collection", value: "Coleção", icon: FolderCheck },
  { id: "wallet", value: "Carteira", icon: CircleDollarSign },
  { id: "profile", value: "Perfil", icon: User },
];

export default activityEntityMap;
