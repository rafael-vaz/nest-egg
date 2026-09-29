import { ISelectOption } from "../components/select/select";

type TransactionCategoryId =
  | "food"
  | "housing"
  | "transport"
  | "health"
  | "education"
  | "leisure"
  | "shopping"
  | "services"
  | "subscriptions"
  | "travel"
  | "debts"
  | "investment"
  | "income"
  | "gifts"
  | "taxes"
  | "pets"
  | "personalCare"
  | "technology"
  | "savings"
  | "other";

interface ITransactionCategory extends ISelectOption {
  id: TransactionCategoryId;
  value: string;
}

const transactionCategoryMap: ITransactionCategory[] = [
  { id: "food", value: "Alimentação" },
  { id: "housing", value: "Moradia" },
  { id: "transport", value: "Transporte" },
  { id: "health", value: "Saúde" },
  { id: "education", value: "Educação" },
  { id: "leisure", value: "Lazer" },
  { id: "shopping", value: "Compras" },
  { id: "services", value: "Serviços" },
  { id: "subscriptions", value: "Assinaturas" },
  { id: "travel", value: "Viagens" },
  { id: "debts", value: "Dívidas" },
  { id: "investment", value: "Investimentos" },
  { id: "income", value: "Renda" },
  { id: "gifts", value: "Presentes / Doações" },
  { id: "taxes", value: "Impostos / Taxas" },
  { id: "pets", value: "Animais de estimação" },
  { id: "personalCare", value: "Beleza / Cuidados pessoais" },
  { id: "technology", value: "Tecnologia" },
  { id: "savings", value: "Poupança" },
  { id: "other", value: "Outros" },
];

export default transactionCategoryMap;
