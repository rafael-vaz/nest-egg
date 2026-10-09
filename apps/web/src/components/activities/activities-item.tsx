import { Pencil, Plus, Trash } from "lucide-react";

import { IActivity } from "../../@types/activity";
import { ModalId } from "../../@types/modal";
import { useAppDispatch } from "../../store/configure-store";
import { openModalState } from "../../store/reducers/modal/modal";
import getActivityActionByType from "../../utils/activity/get-activity-action-by-type";
import getActivityEntityById from "../../utils/activity/get-activity-entity-by-id";
import formatDefaultDate from "../../utils/date/format-default-date";
import formatRelativeDate from "../../utils/date/format-relative-date";
import formatToDateTime from "../../utils/date/format-to-date-time";
import styles from "./activities-item.module.css";
import { ACTIVITY_DISPLAY_MAP } from "./activities-list";

const ACTION_ICON_MAP = {
  created: Plus,
  updated: Pencil,
  deleted: Trash,
};

function getLinkTarget(
  activity: IActivity,
): { id: ModalId; entity?: string } | null {
  if (activity.entity.type === "profile") return { id: "profile" };

  if (getActivityActionByType(activity.type) === "deleted") return null;
  if (!activity.entity.id) return null;

  switch (activity.entity.type) {
    case "transaction":
      return { id: "update-transaction", entity: activity.entity.id };
    case "goal":
      return { id: "update-goal", entity: activity.entity.id };
    case "collection":
      return { id: "update-collection", entity: activity.entity.id };
    default:
      return null;
  }
}

interface IActivitiesItemProps {
  activity: IActivity;
}

const ActivitiesItem = ({ activity }: IActivitiesItemProps) => {
  const dispatch = useAppDispatch();
  const action = getActivityActionByType(activity.type);
  const entityInfo = getActivityEntityById(activity.entity.type);
  const display = ACTIVITY_DISPLAY_MAP[activity.type];
  const ActionIcon = ACTION_ICON_MAP[action];
  const createdAt = new Date(activity.createdAt);
  const linkTarget = getLinkTarget(activity);

  function handleClick() {
    if (!linkTarget) return;
    dispatch(openModalState(linkTarget));
  }

  const title = display.title(activity);

  const content = (
    <>
      {entityInfo && (
        <span className={styles.activitiesItemEntity}>
          <entityInfo.icon size={14} />
          <span>{entityInfo.value}</span>
        </span>
      )}
      <p className={styles.activitiesItemTitle}>
        {title.name && (
          <span
            className={
              linkTarget ? styles.activitiesItemEntityLink : undefined
            }
          >
            {title.name}
          </span>
        )}{" "}
        {title.suffix}
      </p>
      {display.details(activity).map((line) => (
        <p key={line} className={styles.activitiesItemDetail}>
          {line}
        </p>
      ))}
      <time
        lang="pt-BR"
        dateTime={formatToDateTime(createdAt)}
        className={styles.activitiesItemDate}
      >
        <span aria-hidden={true}>{formatRelativeDate(createdAt)}</span>
        <span className="visuallyHidden">{formatDefaultDate(createdAt)}</span>
      </time>
    </>
  );

  return (
    <li className={styles.activitiesItem} data-action={action}>
      <span className={styles.activitiesItemIcon}>
        <ActionIcon size={16} />
      </span>
      {linkTarget ? (
        <button
          type="button"
          className={styles.activitiesItemContent}
          onClick={handleClick}
        >
          {content}
        </button>
      ) : (
        <div className={styles.activitiesItemContent}>{content}</div>
      )}
    </li>
  );
};

export default ActivitiesItem;
