import {
  Banknote,
  FolderCheck,
  ListChecks,
  LucideProps,
  Trophy,
} from "lucide-react";

export interface IProfileCard {
  id: string;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref">>;
  title: string;
}

const profileCardsMap: IProfileCard[] = [
  {
    id: "completed-goals",
    icon: Trophy,
    title: "Metas concluídas",
  },
  {
    id: "recurrence-transactions",
    icon: Banknote,
    title: "Transações recorrentes",
  },
  {
    id: "amount-goals",
    icon: ListChecks,
    title: "Total de metas",
  },
  {
    id: "amount-collections",
    icon: FolderCheck,
    title: "Total de coleções",
  },
];

export default profileCardsMap;
