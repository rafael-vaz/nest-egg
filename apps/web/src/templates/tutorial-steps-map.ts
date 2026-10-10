import { Step } from "react-joyride";

import store from "../store/configure-store";
import {
  closeToolMenuState,
  openToolMenuState,
} from "../store/reducers/tool-menu/tool-menu";

const sidebarSpotlightPadding = { top: -2, right: -2, bottom: -2, left: -2 };

export const desktopTutorialSteps: Step[] = [
  {
    target: "#topbar-wallet-button",
    title: "Carteira",
    content:
      "Seu saldo fica sempre visível por aqui, em qualquer tela. Clique para ver os detalhes da carteira.",
    placement: "bottom",
    spotlightRadius: 10,
    blockTargetInteraction: true,
  },
  {
    target: "#topbar-goals-button",
    title: "Metas",
    content:
      "Metas são objetivos financeiros com um valor-alvo definido, como uma viagem. Acesse por aqui.",
    placement: "bottom",
    spotlightRadius: 10,
    blockTargetInteraction: true,
  },
  {
    target: "#topbar-create-button",
    title: "Criar",
    content:
      "Crie uma transação, meta ou coleção nova a qualquer momento por aqui.",
    placement: "bottom",
    spotlightRadius: 10,
    blockTargetInteraction: true,
  },
  {
    target: "#sidebar-item-transactions",
    title: "Transações",
    content:
      "Transações são registros de entrada ou saída de dinheiro da sua carteira. Veja e gerencie por aqui.",
    placement: "right",
    spotlightRadius: 4,
    spotlightPadding: sidebarSpotlightPadding,
    blockTargetInteraction: true,
  },
  {
    target: "#sidebar-item-search",
    title: "Buscar",
    content:
      "Encontre rapidamente metas, coleções ou transações já existentes pelo nome.",
    placement: "right",
    spotlightRadius: 4,
    spotlightPadding: sidebarSpotlightPadding,
    blockTargetInteraction: true,
  },
  {
    target: "#sidebar-item-activities",
    title: "Atividades",
    content:
      "Acompanhe um histórico de tudo o que você criou, editou ou excluiu.",
    placement: "right",
    spotlightRadius: 4,
    spotlightPadding: sidebarSpotlightPadding,
    blockTargetInteraction: true,
  },
  {
    target: "#sidebar-item-help",
    title: "Ajuda",
    content:
      "Sempre que precisar, volte aqui para tirar dúvidas ou rever este tutorial.",
    placement: "right",
    spotlightRadius: 4,
    spotlightPadding: sidebarSpotlightPadding,
    blockTargetInteraction: true,
  },
  {
    target: "#user-menu-button",
    title: "Perfil",
    content: "Acesse e edite seu perfil por aqui.",
    placement: "left",
    spotlightRadius: 0,
    spotlightPadding: sidebarSpotlightPadding,
    blockTargetInteraction: true,
  },
];

export const mobileTutorialSteps: Step[] = [
  {
    target: "#topbar-wallet-button",
    title: "Carteira",
    content:
      "Seu saldo fica sempre visível por aqui, em qualquer tela. Clique para ver os detalhes da carteira.",
    placement: "bottom",
    spotlightRadius: 10,
    blockTargetInteraction: true,
    before: async () => {
      store.dispatch(closeToolMenuState());
    },
  },
  {
    target: "#topbar-goals-button",
    title: "Metas",
    content:
      "Metas são objetivos financeiros com um valor-alvo definido, como uma viagem. Acesse as suas por aqui.",
    placement: "bottom",
    spotlightRadius: 10,
    blockTargetInteraction: true,
    before: async () => {
      store.dispatch(closeToolMenuState());
    },
  },
  {
    target: "#topbar-create-button",
    title: "Criar",
    content:
      "Crie uma transação, meta ou coleção nova a qualquer momento por aqui.",
    placement: "bottom",
    spotlightRadius: 10,
    blockTargetInteraction: true,
    before: async () => {
      store.dispatch(closeToolMenuState());
    },
  },
  {
    target: "#tool-group-transactions",
    title: "Transações",
    content:
      "Transações são registros de entrada ou saída de dinheiro da sua carteira. Veja e gerencie todas por aqui.",
    placement: "right",
    spotlightRadius: 10,
    spotlightPadding: 4,
    blockTargetInteraction: true,
    before: async () => {
      store.dispatch(openToolMenuState());
      await new Promise((resolve) => setTimeout(resolve, 320));
    },
  },
  {
    target: "#tool-item-search",
    title: "Buscar",
    content:
      "Encontre rapidamente metas, coleções ou transações já existentes pelo nome.",
    placement: "right",
    spotlightRadius: 10,
    spotlightPadding: 4,
    blockTargetInteraction: true,
  },
  {
    target: "#tool-item-activities",
    title: "Atividades",
    content:
      "Acompanhe um histórico de tudo o que você criou, editou ou excluiu.",
    placement: "right",
    spotlightRadius: 10,
    spotlightPadding: 4,
    blockTargetInteraction: true,
  },
  {
    target: "#tool-item-help",
    title: "Ajuda",
    content:
      "Sempre que precisar, volte aqui para tirar dúvidas ou rever este tutorial.",
    placement: "right",
    spotlightRadius: 10,
    spotlightPadding: 4,
    blockTargetInteraction: true,
  },
  {
    target: "#tool-menu-profile-button",
    title: "Perfil",
    content: "Acesse e edite seu perfil por aqui.",
    placement: "right",
    spotlightRadius: 15,
    spotlightPadding: 2,
    blockTargetInteraction: true,
  },
];
