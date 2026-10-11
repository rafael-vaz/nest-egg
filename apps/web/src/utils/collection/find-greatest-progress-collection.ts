import { ICollection } from "../../@types/collection";
import { IGoal } from "../../@types/goal";

export interface IGreatestProgressCollection {
  collection: ICollection;
  completedCount: number;
  totalCount: number;
  remaining: number;
}

function findGreatestProgressCollection(
  collections: ICollection[],
  goals: IGoal[],
  walletValue: number,
): IGreatestProgressCollection | null {
  const candidates = collections
    .map((collection): IGreatestProgressCollection | null => {
      const goalIds = new Set((collection.goals ?? []).map((goal) => goal.id));
      const collectionGoals = goals.filter((goal) => goalIds.has(goal.id));

      if (collectionGoals.length === 0) return null;

      const completedCount = collectionGoals.filter(
        (goal) => goal.status === "completed",
      ).length;

      const remaining = collectionGoals
        .filter((goal) => goal.status !== "completed")
        .reduce(
          (total, goal) => total + Math.max(0, goal.value - walletValue),
          0,
        );

      return {
        collection,
        completedCount,
        totalCount: collectionGoals.length,
        remaining,
      };
    })
    .filter((candidate): candidate is IGreatestProgressCollection =>
      Boolean(candidate),
    );

  if (candidates.length === 0) return null;

  return candidates.reduce((best, candidate) => {
    const bestRatio = best.completedCount / best.totalCount;
    const candidateRatio = candidate.completedCount / candidate.totalCount;
    return candidateRatio > bestRatio ? candidate : best;
  });
}

export default findGreatestProgressCollection;
