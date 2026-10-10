import { Step } from "react-joyride";

const tutorialSteps: Step[] = [
  {
    target: "#topbar-wallet-button",
    title: "Carteira",
    content:
      "Seu saldo fica sempre visível por aqui, em qualquer tela. Clique para ver os detalhes da carteira.",
    placement: "bottom",
  },
  {
    target: "#topbar-goals-button",
    title: "Metas",
    content: "Acesso rápido às suas metas.",
    placement: "bottom",
  },
  {
    target: "#topbar-create-button",
    title: "Criar",
    content:
      "Crie uma transação, meta ou coleção nova a qualquer momento por aqui.",
    placement: "bottom",
  },
  {
    target: "#sidebar-item-transactions",
    title: "Transações",
    content: "Veja e gerencie todas as suas transações.",
    placement: "right",
  },
  {
    target: "#sidebar-item-search",
    title: "Buscar",
    content:
      "Encontre rapidamente metas, coleções ou transações já existentes pelo nome.",
    placement: "right",
  },
  {
    target: "#sidebar-item-activities",
    title: "Atividades",
    content:
      "Acompanhe um histórico de tudo o que você criou, editou ou excluiu.",
    placement: "right",
  },
  {
    target: "#sidebar-item-help",
    title: "Ajuda",
    content:
      "Sempre que precisar, volte aqui para tirar dúvidas ou rever este tutorial.",
    placement: "right",
  },
  {
    target: "#user-menu-button",
    title: "Perfil",
    content: "Acesse e edite seu perfil por aqui.",
    placement: "left",
  },
];

export default tutorialSteps;
