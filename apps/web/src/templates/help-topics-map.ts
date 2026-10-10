import { Banknote, FolderCheck, ListChecks, LucideProps } from "lucide-react";
import React from "react";

export type HelpTopicId = "transactions" | "goals" | "collections";

export interface IHelpTopic {
  id: HelpTopicId;
  label: string;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref">>;
  description: string;
}

const helpTopicsMap: IHelpTopic[] = [
  {
    id: "transactions",
    label: "Transações",
    icon: Banknote,
    description:
      "Registros de entrada (crédito) ou saída (débito) de dinheiro da sua carteira. Podem ser únicas ou recorrentes, e cada uma pertence a uma categoria que ajuda a organizar seus gastos e ganhos.",
  },
  {
    id: "goals",
    label: "Metas",
    icon: ListChecks,
    description:
      "Objetivos financeiros com um valor-alvo a alcançar, como uma viagem, uma compra ou uma reserva de emergência. Acompanhe o progresso e o status de cada uma.",
  },
  {
    id: "collections",
    label: "Coleções",
    icon: FolderCheck,
    description:
      'Agrupamentos de metas relacionadas por tema, como "Viagens" ou "Eletrônicos", úteis para organizar várias metas que fazem sentido juntas.',
  },
];

export default helpTopicsMap;
