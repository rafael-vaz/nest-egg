import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  HandCoins,
  LucideProps,
  PiggyBank,
} from "lucide-react";

interface PreviousMonthCard {
  id: string;
  title: string;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref">>;
  transactionType: "credit" | "debt";
}

const previousMonthCardsMap: PreviousMonthCard[] = [
  {
    id: "total-spared",
    title: "Total poupado",
    icon: PiggyBank,
    transactionType: "credit",
  },
  {
    id: "total-expense",
    title: "Total gasto",
    icon: HandCoins,
    transactionType: "debt",
  },
  {
    id: "total-credits",
    title: "Total créditos",
    icon: BanknoteArrowUp,
    transactionType: "credit",
  },
  {
    id: "total-debts",
    title: "Total débitos",
    icon: BanknoteArrowDown,
    transactionType: "debt",
  },
];

export default previousMonthCardsMap;
