import React from "react";
import { useSelector } from "react-redux";

import createActivityService from "../../services/activity/create-activity";
import { RootState, useAppDispatch } from "../../store/configure-store";
import { updateAuthUser } from "../../store/reducers/user/user-auth";
import { updateUserThunk } from "../../store/thunks/user/user-data";
import Skeleton from "../skeleton/skeleton";
import styles from "./profile-cover-menu-list-item.module.css";

export interface IProfileCoverMenuListItemProps {
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
  coverURL: string;
  coverAlt: string;
}

const ProfileCoverMenuListItem = ({
  setActive,
  coverURL,
  coverAlt,
}: IProfileCoverMenuListItemProps) => {
  const loading = useSelector((state: RootState) => state.userData.loading);
  const { authUser } = useSelector((state: RootState) => state.userAuth);
  const [isLoading, setLoading] = React.useState(true);
  const dispatch = useAppDispatch();
  const isSelected = coverURL === authUser?.coverURL;
  const description = isSelected ? "Capa selecionada" : "Selecionar capa";

  async function changeCover() {
    if (authUser?.uid && !isSelected) {
      if (loading.update) return;
      setActive(false);

      const previousCoverURL = authUser.coverURL ?? null;

      await dispatch(
        updateUserThunk({ uid: authUser.uid, coverURL }),
      ).unwrap();
      dispatch(updateAuthUser({ coverURL }));

      await createActivityService(
        {
          type: "profile.updated",
          entity: { type: "profile", id: null, name: null },
          changes: { coverURL: { from: previousCoverURL, to: coverURL } },
        },
        authUser.uid,
      );
    }
  }

  async function handleClick() {
    await changeCover();
  }

  async function handleKeyDown(event: React.KeyboardEvent<HTMLLIElement>) {
    if (event.key === "Enter" && authUser?.uid) {
      await changeCover();
    }
  }

  return (
    <li
      className={styles.profileCoverMenuListItem}
      tabIndex={0}
      data-loading-state={isLoading}
      data-selected={coverURL === authUser?.coverURL}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={description}
      title={description}
    >
      {isLoading && (
        <Skeleton className={styles.profileCoverMenuListItemSkeleton} />
      )}
      <img
        src={coverURL}
        alt={coverAlt}
        onLoad={() => setLoading(false)}
        onError={() => setLoading(false)}
      />
    </li>
  );
};

export default ProfileCoverMenuListItem;
