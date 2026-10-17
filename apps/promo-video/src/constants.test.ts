import {describe, expect, it} from "vitest";
import {FPS, SCENES, TOTAL_DURATION_IN_FRAMES} from "./constants";

const SCENE_ORDER = [
  "opening",
  "dashboard",
  "transaction",
  "reconciliation",
  "goals",
  "resources",
  "profile",
  "closing",
];

describe("constants", () => {
  it("has exactly 8 scenes, in the approved order", () => {
    expect(SCENES).toHaveLength(8);
    expect(SCENES.map((s) => s.id)).toEqual(SCENE_ORDER);
  });

  it("scene durations sum to the total composition length", () => {
    const sum = SCENES.reduce((acc, s) => acc + s.durationInFrames, 0);
    expect(sum).toBe(TOTAL_DURATION_IN_FRAMES);
  });

  it("opening caption matches the approved copy", () => {
    expect(SCENES.find((s) => s.id === "opening")!.caption).toBe(
      "Pare de perder o controle do seu dinheiro.",
    );
  });

  it("dashboard caption matches the approved copy", () => {
    expect(SCENES.find((s) => s.id === "dashboard")!.caption).toBe(
      "Veja seu saldo e seus gastos do mês, sempre atualizados.",
    );
  });

  it("transaction caption matches the approved copy", () => {
    expect(SCENES.find((s) => s.id === "transaction")!.caption).toBe(
      "Registre transações em segundos — até recorrentes.",
    );
  });

  it("reconciliation caption matches the approved copy", () => {
    expect(SCENES.find((s) => s.id === "reconciliation")!.caption).toBe(
      "O saldo se atualiza sozinho a cada transação.",
    );
  });

  it("goals caption matches the approved copy", () => {
    expect(SCENES.find((s) => s.id === "goals")!.caption).toBe(
      "Organize metas por coleção e acompanhe o progresso.",
    );
  });

  it("resources caption matches the approved copy", () => {
    expect(SCENES.find((s) => s.id === "resources")!.caption).toBe(
      "Calculadora, relatórios e histórico de atividades — tudo em um só lugar.",
    );
  });

  it("profile caption matches the approved copy", () => {
    expect(SCENES.find((s) => s.id === "profile")!.caption).toBe(
      "Um resumo completo da sua jornada financeira.",
    );
  });

  it("closing caption matches the approved copy", () => {
    expect(SCENES.find((s) => s.id === "closing")!.caption).toBe(
      "nest-egg — sua vida financeira, organizada.",
    );
  });

  it("fps is 30", () => {
    expect(FPS).toBe(30);
  });
});
