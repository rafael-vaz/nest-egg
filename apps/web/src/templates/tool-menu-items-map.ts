import {
  Activity,
  Banknote,
  FolderCheck,
  Home,
  Info,
  ListChecks,
  LucideProps,
  Plus,
  Search,
  Wallet,
} from "lucide-react";

export type ToolMenuItemType = "default" | "group";

export interface IToolMenuItem {
  id: string;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref">>;
  title?: string;
  text?: string;
  hasAddButton?: boolean;
  type: ToolMenuItemType;
}

export interface IToolMenuCollection {
  id: string;
  title: string;
  content: Array<IToolMenuItem>;
}

const toolMenuItemsMap: Array<IToolMenuCollection> = [
  {
    id: "resources",
    title: "Meus Recursos",
    content: [
      { id: "home", icon: Home, text: "Início", type: "default" },
      { id: "wallet", icon: Wallet, text: "Carteira", type: "default" },
      {
        id: "collections",
        icon: FolderCheck,
        title: "Coleções",
        hasAddButton: true,
        type: "group",
      },
      {
        id: "goals",
        icon: ListChecks,
        title: "Metas",
        hasAddButton: true,
        type: "group",
      },
      {
        id: "transactions",
        icon: Banknote,
        title: "Transações",
        hasAddButton: true,
        type: "group",
      },
    ],
  },
  {
    id: "tools",
    title: "Ferramentas",
    content: [
      { id: "create", icon: Plus, text: "Criar", type: "default" },
      { id: "search", icon: Search, text: "Pesquisar", type: "default" },
      { id: "activities", icon: Activity, text: "Atividades", type: "default" },
      { id: "help", icon: Info, text: "Ajuda", type: "default" },
    ],
  },
];

export default toolMenuItemsMap;
