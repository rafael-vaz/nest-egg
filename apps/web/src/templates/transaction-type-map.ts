import {
  Banknote,
  BanknoteArrowDown,
  BanknoteArrowUp,
  LucideProps,
} from "lucide-react";

export type TransactionOptionType = "credit" | "debt" | "all";

export interface ITransactionTypeMap {
  id: TransactionOptionType;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref">>;
  value: string;
}

const transactionTypesMap: ITransactionTypeMap[] = [
  {
    id: "credit",
    icon: BanknoteArrowUp,
    value: "Crédito",
  },
  {
    id: "debt",
    icon: BanknoteArrowDown,
    value: "Débito",
  },
  {
    id: "all",
    icon: Banknote,
    value: "Todos",
  },
];

export default transactionTypesMap;
