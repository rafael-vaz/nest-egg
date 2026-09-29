export type EntityId = "collections" | "goals" | "transactions";

export interface IEntity {
  id: EntityId;
  value: string;
}

export const entitiesMap: IEntity[] = [
  { id: "goals", value: "Metas" },
  { id: "collections", value: "Coleções" },
  { id: "transactions", value: "Transações" },
];
