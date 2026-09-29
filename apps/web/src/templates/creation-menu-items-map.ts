import { Banknote, CheckCircle, FolderCheck, LucideProps } from "lucide-react";

export type CreationMenuListItemId =
  | "new-goal"
  | "new-collection"
  | "new-transaction";

interface ICreationMenuListItem {
  id: CreationMenuListItemId;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref">>;
  title: string;
  description: string;
}

const creationMenuItemsMap: ICreationMenuListItem[] = [
  {
    id: "new-goal",
    icon: CheckCircle,
    title: "Meta",
    description: "Crie uma nova meta financeira.",
  },
  {
    id: "new-collection",
    icon: FolderCheck,
    title: "Coleção",
    description: "Crie uma coleção e agrupe suas metas.",
  },
  {
    id: "new-transaction",
    icon: Banknote,
    title: "Transação",
    description: "Adicione uma transação à sua carteira.",
  },
];

export default creationMenuItemsMap;
