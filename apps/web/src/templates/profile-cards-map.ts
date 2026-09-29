import {
  Banknote,
  FolderCheck,
  ListChecks,
  LucideProps,
  Trophy,
} from "lucide-react";

interface IProfileCard {
  id: string;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref">>;
  title: string;
  value: string;
}

const profileCardsMap: IProfileCard[] = [
  {
    id: "completed-goals",
    icon: Trophy,
    title: "Metas concluídas",
    value: "0",
  },
  {
    id: "recurrence-transactions",
    icon: Banknote,
    title: "Transações recorrentes",
    value: "0",
  },
  {
    id: "amount-goals",
    icon: ListChecks,
    title: "Total de metas",
    value: "0",
  },
  {
    id: "amount-collections",
    icon: FolderCheck,
    title: "Total de coleções",
    value: "0",
  },
];

export default profileCardsMap;
