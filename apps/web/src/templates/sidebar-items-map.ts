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

interface ISidebarItem {
  id: string;
  label: string;
  description: string;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref">>;
}

const sidebarItemsMap: ISidebarItem[] = [
  {
    id: "wallet",
    label: "Carteira",
    description: "Acessar carteira",
    icon: Wallet,
  },
  {
    id: "collections",
    label: "Coleções",
    description: "Acessar coleções",
    icon: FolderCheck,
  },
  {
    id: "goals",
    label: "Metas",
    description: "Acessar metas",
    icon: ListChecks,
  },
  {
    id: "transactions",
    label: "Transações",
    description: "Acessar transações",
    icon: Banknote,
  },
  {
    id: "search",
    label: "Buscar",
    description: "Acessar página de busca",
    icon: Search,
  },
  {
    id: "create",
    label: "Criar",
    description: "Acessar menu de criação",
    icon: Plus,
  },
  {
    id: "activities",
    label: "Atividades",
    description: "Ver histórico de atividades",
    icon: Activity,
  },
  {
    id: "help",
    label: "Ajuda",
    description: "Abrir painel de ajuda",
    icon: Info,
  },
  {
    id: "home",
    label: "Início",
    description: "Ir para página inicial",
    icon: Home,
  },
];

export default sidebarItemsMap;
