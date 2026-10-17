import {
  DemoCollection,
  DemoDataset,
  DemoGoal,
  DemoTransaction,
} from "./types";

const WALLET_BASELINE_CENTAVOS = 425000;

function toDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function daysAgo(now: Date, days: number): string {
  const result = new Date(now);
  result.setDate(result.getDate() - days);
  return toDateOnly(result);
}

function monthsAgo(now: Date, months: number): string {
  const result = new Date(now);
  result.setMonth(result.getMonth() - months);
  return toDateOnly(result);
}

function nowIso(now: Date): string {
  return now.toISOString();
}

/**
 * Builds the fixed, versioned demo dataset used to seed the promo-video
 * demo account. Pure function of `now` — deterministic for a fixed value,
 * so re-running the seed script at a different time still produces a
 * dataset with the same shape and the same wallet baseline, just with
 * dates shifted relative to `now`.
 * @param {Date} now - The instant to anchor relative dates to
 * @return {DemoDataset} The dataset to write for the demo user
 */
export function buildDemoDataset(now: Date): DemoDataset {
  const createdAt = nowIso(now);

  const collections: DemoCollection[] = [
    {
      id: "demo-collection-viagens",
      name: "Viagens",
      goals: [{id: "demo-goal-viagem-praia"}],
      description: "Metas relacionadas a viagens.",
      createdAt,
      updatedAt: createdAt,
    },
    {
      id: "demo-collection-casa-nova",
      name: "Casa nova",
      goals: [{id: "demo-goal-reforma-casa"}],
      description: "Metas relacionadas à casa nova.",
      createdAt,
      updatedAt: createdAt,
    },
  ];

  const goals: DemoGoal[] = [
    {
      id: "demo-goal-curso-online",
      name: "Curso online",
      value: 120000,
      status: "completed",
      collection: null,
      description: null,
      createdAt,
      updatedAt: createdAt,
    },
    {
      id: "demo-goal-viagem-praia",
      name: "Viagem para a praia",
      value: 600000,
      status: "active",
      collection: {id: "demo-collection-viagens"},
      description: null,
      createdAt,
      updatedAt: createdAt,
    },
    {
      id: "demo-goal-reforma-casa",
      name: "Reforma da casa",
      value: 1200000,
      status: "active",
      collection: {id: "demo-collection-casa-nova"},
      description: null,
      createdAt,
      updatedAt: createdAt,
    },
    {
      id: "demo-goal-fundo-emergencia",
      name: "Fundo de emergência",
      value: 1000000,
      status: "waiting",
      collection: null,
      description: null,
      createdAt,
      updatedAt: createdAt,
    },
  ];

  const recurringTransactions: DemoTransaction[] = [
    {
      id: "demo-tx-salario",
      name: "Salário",
      value: 500000,
      type: "credit",
      date: monthsAgo(now, 2),
      category: "income",
      description: null,
      createdAt,
      updatedAt: createdAt,
      hasRecurrence: true,
      recurrence: {
        startDate: monthsAgo(now, 2),
        endDate: null,
        frequency: {rate: 1, category: "month", weekDays: null, order: null},
      },
      occurrenceLog: [
        {
          id: "demo-tx-salario-occ-1",
          date: monthsAgo(now, 2),
          value: 500000,
          type: "credit",
        },
        {
          id: "demo-tx-salario-occ-2",
          date: monthsAgo(now, 1),
          value: 500000,
          type: "credit",
        },
      ],
    },
    {
      id: "demo-tx-aluguel",
      name: "Aluguel",
      value: 180000,
      type: "debt",
      date: monthsAgo(now, 2),
      category: "housing",
      description: null,
      createdAt,
      updatedAt: createdAt,
      hasRecurrence: true,
      recurrence: {
        startDate: monthsAgo(now, 2),
        endDate: null,
        frequency: {rate: 1, category: "month", weekDays: null, order: null},
      },
      occurrenceLog: [
        {
          id: "demo-tx-aluguel-occ-1",
          date: monthsAgo(now, 2),
          value: 180000,
          type: "debt",
        },
        {
          id: "demo-tx-aluguel-occ-2",
          date: monthsAgo(now, 1),
          value: 180000,
          type: "debt",
        },
      ],
    },
    {
      id: "demo-tx-streaming",
      name: "Assinatura streaming",
      value: 3990,
      type: "debt",
      date: monthsAgo(now, 2),
      category: "subscriptions",
      description: null,
      createdAt,
      updatedAt: createdAt,
      hasRecurrence: true,
      recurrence: {
        startDate: monthsAgo(now, 2),
        endDate: null,
        frequency: {rate: 1, category: "month", weekDays: null, order: null},
      },
      occurrenceLog: [
        {
          id: "demo-tx-streaming-occ-1",
          date: monthsAgo(now, 2),
          value: 3990,
          type: "debt",
        },
        {
          id: "demo-tx-streaming-occ-2",
          date: monthsAgo(now, 1),
          value: 3990,
          type: "debt",
        },
      ],
    },
  ];

  const oneOffDefs: {
    id: string;
    name: string;
    value: number;
    category: string;
    daysAgo: number;
  }[] = [
    {id: "demo-tx-mercado-1", name: "Supermercado", value: 32000, category: "food", daysAgo: 3},
    {id: "demo-tx-uber", name: "Corrida de aplicativo", value: 4800, category: "transport", daysAgo: 7},
    {id: "demo-tx-cinema", name: "Cinema", value: 6500, category: "leisure", daysAgo: 11},
    {id: "demo-tx-roupas", name: "Roupas novas", value: 28000, category: "shopping", daysAgo: 14},
    {id: "demo-tx-restaurante", name: "Restaurante", value: 15000, category: "food", daysAgo: 18},
    {id: "demo-tx-combustivel", name: "Combustível", value: 22000, category: "transport", daysAgo: 23},
    {id: "demo-tx-presente", name: "Presente de aniversário", value: 15000, category: "gifts", daysAgo: 27},
    {id: "demo-tx-mercado-2", name: "Supermercado", value: 21000, category: "food", daysAgo: 33},
    {id: "demo-tx-farmacia", name: "Farmácia", value: 9800, category: "health", daysAgo: 38},
    {id: "demo-tx-fone", name: "Fone de ouvido", value: 52920, category: "technology", daysAgo: 45},
  ];

  const oneOffTransactions: DemoTransaction[] = oneOffDefs.map((def) => {
    const date = daysAgo(now, def.daysAgo);
    return {
      id: def.id,
      name: def.name,
      value: def.value,
      type: "debt",
      date,
      category: def.category,
      description: null,
      createdAt,
      updatedAt: createdAt,
      hasRecurrence: false,
      recurrence: null,
      occurrenceLog: [
        {id: `${def.id}-occ-1`, date, value: def.value, type: "debt"},
      ],
    };
  });

  return {
    walletBaselineCentavos: WALLET_BASELINE_CENTAVOS,
    collections,
    goals,
    transactions: [...recurringTransactions, ...oneOffTransactions],
  };
}
