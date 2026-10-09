import { BrushCleaning } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";

import {
  ActivityEntityType,
  ActivityType,
  IActivity,
} from "../../@types/activity";
import { RootState, useAppDispatch } from "../../store/configure-store";
import { readAllActivitiesThunk } from "../../store/thunks/activity/activity-data";
import activityActionMap from "../../templates/activity-action-map";
import activityEntityMap from "../../templates/activity-entity-map";
import { ActivityAction } from "../../utils/activity/get-activity-action-by-type";
import getGoalStatusValueById from "../../utils/goal/get-goal-status-value-by-id";
import formatCurrency from "../../utils/text/format-currency";
import getTransactionCategoryById from "../../utils/transaction/get-transaction-category-by-id";
import Button from "../button/button";
import recordsContainerStyles from "../records-container/records-container.module.css";
import RecordsContainerEmptyList from "../records-container/records-container-empty-list";
import Select from "../select/select";
import ActivitiesItem from "./activities-item";
import styles from "./activities-list.module.css";

export interface IActivityTitle {
  name: string | null;
  suffix: string;
}

interface IActivityDisplay {
  title: (activity: IActivity) => IActivityTitle;
  details: (activity: IActivity) => string[];
}

function formatCurrencyChange(from: unknown, to: unknown): string {
  return `${formatCurrency(String(from))} → ${formatCurrency(String(to))}`;
}

const ACTIVITY_DISPLAY_MAP: Record<ActivityType, IActivityDisplay> = {
  "transaction.created": {
    title: ({ entity }) => ({ name: entity.name, suffix: "foi criada" }),
    details: () => [],
  },
  "transaction.updated": {
    title: ({ entity }) => ({ name: entity.name, suffix: "foi editada" }),
    details: ({ changes }) => {
      if (!changes) return [];
      const lines: string[] = [];

      if (changes.value) {
        lines.push(
          `Valor: ${formatCurrencyChange(changes.value.from, changes.value.to)}`,
        );
      }
      if (changes.category) {
        const from = getTransactionCategoryById(
          changes.category.from as never,
        );
        const to = getTransactionCategoryById(changes.category.to as never);
        lines.push(`Categoria: ${from} → ${to}`);
      }
      if (changes.description) {
        lines.push("Descrição alterada");
      }
      if (changes.recurrence) {
        if (!changes.recurrence.from) lines.push("Recorrência adicionada");
        else if (!changes.recurrence.to) lines.push("Recorrência removida");
        else lines.push("Recorrência alterada");
      }

      return lines;
    },
  },
  "transaction.deleted": {
    title: ({ entity }) => ({ name: entity.name, suffix: "foi excluída" }),
    details: () => [],
  },

  "goal.created": {
    title: ({ entity }) => ({ name: entity.name, suffix: "foi criada" }),
    details: () => [],
  },
  "goal.updated": {
    title: ({ entity }) => ({ name: entity.name, suffix: "foi editada" }),
    details: ({ changes }) => {
      if (!changes) return [];
      const lines: string[] = [];

      if (changes.value) {
        lines.push(
          `Valor: ${formatCurrencyChange(changes.value.from, changes.value.to)}`,
        );
      }
      if (changes.status) {
        const from = getGoalStatusValueById(changes.status.from as never);
        const to = getGoalStatusValueById(changes.status.to as never);
        lines.push(`Status: ${from} → ${to}`);
      }
      if (changes.collection) {
        if (!changes.collection.from) lines.push("Adicionada a uma coleção");
        else if (!changes.collection.to) lines.push("Removida da coleção");
        else lines.push("Movida para outra coleção");
      }

      return lines;
    },
  },
  "goal.deleted": {
    title: ({ entity }) => ({ name: entity.name, suffix: "foi excluída" }),
    details: () => [],
  },

  "collection.created": {
    title: ({ entity }) => ({ name: entity.name, suffix: "foi criada" }),
    details: () => [],
  },
  "collection.updated": {
    title: ({ entity }) => ({ name: entity.name, suffix: "foi editada" }),
    details: ({ changes }) => {
      if (!changes?.name) return [];
      return [`Nome: ${changes.name.from} → ${changes.name.to}`];
    },
  },
  "collection.deleted": {
    title: ({ entity }) => ({ name: entity.name, suffix: "foi excluída" }),
    details: () => [],
  },

  "wallet.updated": {
    title: () => ({ name: null, suffix: "Valor da carteira foi alterado" }),
    details: ({ changes }) => {
      if (!changes?.value) return [];
      return [formatCurrencyChange(changes.value.from, changes.value.to)];
    },
  },

  "profile.updated": {
    title: () => ({ name: null, suffix: "Perfil foi atualizado" }),
    details: ({ changes }) => {
      if (!changes) return [];
      const lines: string[] = [];

      if (changes.name) {
        lines.push(`Nome: ${changes.name.from} → ${changes.name.to}`);
      }
      if (changes.dateOfBirth) {
        lines.push("Data de nascimento alterada");
      }
      if (changes.coverURL) {
        lines.push("Capa do perfil alterada");
      }

      return lines;
    },
  },
  "profile.photo_updated": {
    title: () => ({ name: null, suffix: "Foto de perfil foi atualizada" }),
    details: () => [],
  },
  "profile.photo_removed": {
    title: () => ({ name: null, suffix: "Foto de perfil foi removida" }),
    details: () => [],
  },
};

const ActivitiesList = () => {
  const dispatch = useAppDispatch();
  const { authUser } = useSelector((state: RootState) => state.userAuth);
  const { loading } = useSelector((state: RootState) => state.activityData);
  const [activities, setActivities] = React.useState<IActivity[] | null>(
    null,
  );
  const [entityFilter, setEntityFilter] = React.useState<
    ActivityEntityType | "all"
  >("all");
  const [actionFilter, setActionFilter] = React.useState<
    ActivityAction | "all"
  >("all");

  React.useEffect(() => {
    if (!authUser?.uid) return;
    dispatch(readAllActivitiesThunk({ userId: authUser.uid }))
      .unwrap()
      .then((result) => setActivities(result ?? []))
      .catch(() => setActivities([]));
  }, [authUser?.uid, dispatch]);

  const filteredActivities = React.useMemo(() => {
    if (!activities) return [];

    return activities
      .filter(
        (activity) =>
          entityFilter === "all" || activity.entity.type === entityFilter,
      )
      .filter((activity) => {
        if (actionFilter === "all") return true;
        return activity.type.endsWith(".created")
          ? actionFilter === "created"
          : activity.type.endsWith(".deleted") ||
              activity.type === "profile.photo_removed"
            ? actionFilter === "deleted"
            : actionFilter === "updated";
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [activities, entityFilter, actionFilter]);

  const hasFilters = entityFilter !== "all" || actionFilter !== "all";

  function clearFilters() {
    setEntityFilter("all");
    setActionFilter("all");
  }

  return (
    <>
      <header className={styles.activitiesListHeader}>
        <div className={recordsContainerStyles.recordsContainerHeaderFilters}>
          <Select
            id="activities-entity-filter"
            groups={[
              {
                children: [
                  { id: "all", value: "Todas as entidades" },
                  ...activityEntityMap,
                ],
              },
            ]}
            value={entityFilter}
            hasNoMargin={true}
            onChange={(value) =>
              setEntityFilter(value as ActivityEntityType | "all")
            }
          />
          <Select
            id="activities-action-filter"
            groups={[
              {
                children: [
                  { id: "all", value: "Todas as categorias" },
                  ...activityActionMap,
                ],
              },
            ]}
            value={actionFilter}
            hasNoMargin={true}
            onChange={(value) =>
              setActionFilter(value as ActivityAction | "all")
            }
          />
          <Button
            icon={BrushCleaning}
            color="light-gray"
            size="small"
            title="Limpar filtros"
            aria-label="Limpar filtros"
            disabled={!hasFilters}
            onClick={clearFilters}
          />
        </div>
      </header>
      {filteredActivities.length > 0 ? (
        <ul className={styles.activitiesList}>
          {filteredActivities.map((activity) => (
            <ActivitiesItem key={activity.id} activity={activity} />
          ))}
        </ul>
      ) : (
        <RecordsContainerEmptyList
          text={
            loading
              ? "Carregando atividades..."
              : hasFilters
                ? "Nenhuma atividade encontrada para o filtro selecionado."
                : "Nenhuma atividade registrada ainda."
          }
        />
      )}
    </>
  );
};

export default ActivitiesList;
export { ACTIVITY_DISPLAY_MAP };
