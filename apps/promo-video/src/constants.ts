import {loadFont as loadUbuntu} from "@remotion/google-fonts/Ubuntu";
import {loadFont as loadRoboto} from "@remotion/google-fonts/Roboto";

const ubuntu = loadUbuntu("normal", {
  weights: ["400", "500", "700"],
  subsets: ["latin"],
});
const roboto = loadRoboto("normal", {
  weights: ["400", "500", "700"],
  subsets: ["latin"],
});

export const FPS = 30;

export const COLORS = {
  bg: "#212121",
  bgDark: "#000",
  accentStart: "#836fff",
  accentEnd: "#15f5ba",
  textPrimary: "#fff",
  textSecondary: "#b9b8ca",
};

export const FONTS = {
  title: ubuntu.fontFamily,
  content: roboto.fontFamily,
};

export interface IScene {
  id: string;
  title: string;
  durationInFrames: number;
  caption: string;
}

export const SCENES: IScene[] = [
  {
    id: "opening",
    title: "Abertura",
    durationInFrames: 120,
    caption: "Pare de perder o controle do seu dinheiro.",
  },
  {
    id: "dashboard",
    title: "Visão geral",
    durationInFrames: 210,
    caption: "Veja seu saldo e seus gastos do mês, sempre atualizados.",
  },
  {
    id: "transaction",
    title: "Nova transação",
    durationInFrames: 300,
    caption: "Registre transações em segundos — até recorrentes.",
  },
  {
    id: "reconciliation",
    title: "Saldo automático",
    durationInFrames: 180,
    caption: "O saldo se atualiza sozinho a cada transação.",
  },
  {
    id: "goals",
    title: "Metas e coleções",
    durationInFrames: 300,
    caption: "Organize metas por coleção e acompanhe o progresso.",
  },
  {
    id: "resources",
    title: "Mais recursos",
    durationInFrames: 270,
    caption:
      "Calculadora, relatórios e histórico de atividades — tudo em um só lugar.",
  },
  {
    id: "profile",
    title: "Perfil",
    durationInFrames: 180,
    caption: "Um resumo completo da sua jornada financeira.",
  },
  {
    id: "closing",
    title: "Encerramento",
    durationInFrames: 180,
    caption: "nest-egg — sua vida financeira, organizada.",
  },
];

// Independent literal (not derived from SCENES) so constants.test.ts's sum
// assertion actually catches a per-scene duration drifting from the total,
// instead of trivially matching itself.
export const TOTAL_DURATION_IN_FRAMES = 1740;

export const CLOSING_URL = "nest-egg-ef466.web.app";
