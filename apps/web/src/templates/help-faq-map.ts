export interface IHelpFaqItem {
  id: string;
  question: string;
  answer: string;
}

const helpFaqMap: IHelpFaqItem[] = [
  {
    id: "wallet-value",
    question: "O valor da carteira é calculado automaticamente?",
    answer:
      "Sim. Toda transação de crédito ou débito que você registra, incluindo ocorrências de transações recorrentes, ajusta o valor da carteira automaticamente. Você também pode editar o valor manualmente a qualquer momento pelo ícone de lápis no card da carteira.",
  },
  {
    id: "recurrence",
    question: "Como funciona a recorrência de uma transação?",
    answer:
      "Ao ativar a recorrência na criação ou edição de uma transação, ela passa a gerar ocorrências automáticas (diárias, semanais, mensais, etc.), sem que você precise recriá-la manualmente a cada período.",
  },
  {
    id: "goal-collection-link",
    question: "O que acontece quando vinculo uma meta a uma coleção?",
    answer:
      "A meta passa a aparecer agrupada dentro da coleção escolhida. Isso não altera o valor nem o status da meta, é só uma forma de organizar metas relacionadas por tema.",
  },
  {
    id: "edit-delete",
    question:
      "Dá para editar ou excluir uma transação, meta ou coleção depois de criada?",
    answer:
      "Sim, a qualquer momento. Excluir uma coleção não apaga as metas vinculadas a ela, elas só deixam de estar agrupadas.",
  },
  {
    id: "activities",
    question: "O que é o histórico de atividades?",
    answer:
      "Um registro cronológico de tudo o que você criou, editou ou excluiu na ferramenta (transações, metas, coleções, carteira e perfil), para você acompanhar o que mudou e quando.",
  },
  {
    id: "search",
    question: "Como funciona a busca?",
    answer:
      "A busca permite encontrar rapidamente metas, coleções ou transações já existentes pelo nome, sem precisar navegar manualmente até a lista completa.",
  },
  {
    id: "calculator",
    question: "Para que serve a calculadora?",
    answer:
      "Ela fica disponível em qualquer tela para ajudar em cálculos rápidos, inclusive com funções científicas como seno, cosseno, logaritmo e raiz, sem precisar sair da ferramenta.",
  },
];

export default helpFaqMap;
