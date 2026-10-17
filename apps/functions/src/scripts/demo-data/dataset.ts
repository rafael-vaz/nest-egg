import {
  DemoCollection,
  DemoDataset,
  DemoGoal,
  DemoTransaction,
  DemoTransactionType,
} from "./types";

const WALLET_BASELINE_CENTAVOS = 425000;

/**
 * Computes a full ISO timestamp a number of days before `now`, pinned to
 * noon UTC to avoid day-boundary edge cases.
 * @param {Date} now - The anchor date
 * @param {number} days - How many days before `now`
 * @return {string} The full ISO timestamp
 */
function daysAgoIso(now: Date, days: number): string {
  const result = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() - days,
    12, 0, 0, 0,
  ));
  return result.toISOString();
}

/**
 * Computes a full ISO timestamp offset by whole months from `now`, pinned
 * to noon UTC to avoid day-boundary edge cases. A negative `monthsOffset`
 * moves into the future — used for a recurring transaction's `date`
 * pointer, which production always leaves pointing at the next
 * not-yet-materialized occurrence (see cron.ts's processTransactionRecurrence).
 * @param {Date} now - The anchor date
 * @param {number} monthsOffset - Months before `now`; negative is after
 * @return {string} The full ISO timestamp
 */
function monthsOffsetIso(now: Date, monthsOffset: number): string {
  const result = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth() - monthsOffset,
    now.getUTCDate(),
    12, 0, 0, 0,
  ));
  return result.toISOString();
}

/**
 * Formats `now` as a full ISO timestamp, for createdAt/updatedAt fields.
 * @param {Date} now - The anchor date
 * @return {string} The formatted timestamp
 */
function nowIso(now: Date): string {
  return now.toISOString();
}

interface IBuildRecurringTransactionParams {
  id: string;
  name: string;
  value: number;
  type: DemoTransactionType;
  category: string;
  now: Date;
  createdAt: string;
}

/**
 * Builds a monthly recurring transaction with 3 past/current occurrences
 * (2 months ago, 1 month ago, and the current month) already logged, and
 * its `date` pointer set one month into the future — the same steady
 * state production's own recurrence processing always leaves a
 * transaction in between runs. This is deliberate: if `date` were in the
 * past (or the occurrence dates didn't match production's own format),
 * the nightly processRecurrences cron would treat every occurrence as
 * unlogged and re-append it, corrupting the seeded wallet balance.
 * @param {IBuildRecurringTransactionParams} params - Transaction fields
 * @return {DemoTransaction} The built recurring transaction
 */
function buildRecurringTransaction(
  params: IBuildRecurringTransactionParams,
): DemoTransaction {
  const {id, name, value, type, category, now, createdAt} = params;

  const occurrenceLog = [2, 1, 0].map((monthsAgo, index) => ({
    id: `${id}-occ-${index + 1}`,
    date: monthsOffsetIso(now, monthsAgo),
    value,
    type,
  }));

  return {
    id,
    name,
    value,
    type,
    date: monthsOffsetIso(now, -1),
    category,
    description: null,
    createdAt,
    updatedAt: createdAt,
    hasRecurrence: true,
    recurrence: {
      startDate: monthsOffsetIso(now, 2),
      endDate: null,
      frequency: {rate: 1, category: "month", weekDays: null, order: null},
    },
    occurrenceLog,
  };
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
      // Exactly one goal may be "active" at a time — the app demotes any
      // other active goal to "waiting" the moment one becomes active
      // (see apps/functions/src/store/thunks/goal/goal-data.ts), and the
      // active-goal card picks whichever Firestore happens to return
      // first when more than one claims the status. This is the goal
      // the video script's "active goal" scene shows.
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
      status: "waiting",
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
    buildRecurringTransaction({
      id: "demo-tx-salario", name: "Salário", value: 500000,
      type: "credit", category: "income", now, createdAt,
    }),
    buildRecurringTransaction({
      id: "demo-tx-aluguel", name: "Aluguel", value: 180000,
      type: "debt", category: "housing", now, createdAt,
    }),
    buildRecurringTransaction({
      id: "demo-tx-streaming", name: "Assinatura streaming", value: 3990,
      type: "debt", category: "subscriptions", now, createdAt,
    }),
  ];

  const oneOffDefs: {
    id: string;
    name: string;
    value: number;
    category: string;
    daysAgo: number;
  }[] = [
    {
      id: "demo-tx-mercado-1", name: "Supermercado",
      value: 45000, category: "food", daysAgo: 3,
    },
    {
      id: "demo-tx-uber", name: "Corrida de aplicativo",
      value: 12000, category: "transport", daysAgo: 7,
    },
    {
      id: "demo-tx-cinema", name: "Cinema",
      value: 18000, category: "leisure", daysAgo: 11,
    },
    {
      id: "demo-tx-roupas", name: "Roupas novas",
      value: 65000, category: "shopping", daysAgo: 14,
    },
    {
      id: "demo-tx-restaurante", name: "Restaurante",
      value: 32000, category: "food", daysAgo: 18,
    },
    {
      id: "demo-tx-combustivel", name: "Combustível",
      value: 48000, category: "transport", daysAgo: 23,
    },
    {
      id: "demo-tx-presente", name: "Presente de aniversário",
      value: 35000, category: "gifts", daysAgo: 27,
    },
    {
      id: "demo-tx-mercado-2", name: "Supermercado",
      value: 51000, category: "food", daysAgo: 33,
    },
    {
      id: "demo-tx-farmacia", name: "Farmácia",
      value: 22000, category: "health", daysAgo: 38,
    },
    {
      id: "demo-tx-celular", name: "Celular seminovo",
      value: 195030, category: "technology", daysAgo: 45,
    },
  ];

  const oneOffTransactions: DemoTransaction[] = oneOffDefs.map((def) => {
    const date = daysAgoIso(now, def.daysAgo);
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
