import { ArrowLeft, Trash } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";

import avatar from "../../assets/img/user/avatar.svg";
import { RootState, useAppDispatch } from "../../store/configure-store";
import { setModalLoadingState } from "../../store/reducers/modal/modal";
import {
  deletePhotoThunk,
  updatePhotoThunk,
} from "../../store/thunks/user/user-file";
import Button from "../button/button";
import FilepickerButton from "../filepicker/filepicker-button";
import Spinner from "../spinner/spinner";
import ProfileCoverMenu from "./profile-cover-menu";
import styles from "./profile-header.module.css";

interface IProfileHeaderProps {
  onClose: () => void;
}

const ProfileHeader = ({ onClose }: IProfileHeaderProps) => {
  const { authUser } = useSelector((state: RootState) => state.userAuth);
  const { loading } = useSelector((state: RootState) => state.userFile);
  const [coverLoadState, setCoverLoadingState] = React.useState(false);
  const [photoLoadState, setAvatarLoadingState] = React.useState(false);
  const isImagesLoaded = coverLoadState && photoLoadState;
  const dispatch = useAppDispatch();

  const hasPhoto = Boolean(authUser?.photoURL);
  const isDeleting = loading.photo.delete;
  const isUpdating = loading.photo.update;

  React.useEffect(() => {
    return () => {
      setCoverLoadingState(false);
      setAvatarLoadingState(false);
    };
  }, []);

  React.useEffect(() => {
    dispatch(setModalLoadingState(!isImagesLoaded));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isImagesLoaded]);

  const renderPhotoAction = () => {
    if (hasPhoto) {
      if (isDeleting) {
        return <Spinner size="small" />;
      }
      return (
        <Button
          id="remove-user-photo"
          icon={Trash}
          size="small"
          color="dark-gray"
          aria-label="Remover foto"
          title="Remover foto"
          onClick={() => dispatch(deletePhotoThunk())}
        />
      );
    } else {
      if (isUpdating) {
        return <Spinner size="small" />;
      }
      return (
        <FilepickerButton
          id="update-user-photo"
          label="Selecionar foto"
          defaultFileName="photo"
          defaultCategory="image"
          onUpload={(file: File) => dispatch(updatePhotoThunk(file))}
        />
      );
    }
  };

  return (
    <header className={styles.profileHeader}>
      <div className={styles.profileHeaderButtons}>
        <Button
          icon={ArrowLeft}
          size="small"
          aria-label="Voltar"
          color="dark-gray"
          title="Voltar"
          onClick={onClose}
        />
        <ProfileCoverMenu />
      </div>
      <div className={`${styles.profileHeaderCover}`}>
        <img
          src={authUser!.coverURL}
          height={160}
          width={600}
          alt="Imagem de capa do usuário"
          onLoad={() => setAvatarLoadingState(true)}
        />
      </div>
      <div className={styles.profileHeaderUserPhotoContainer}>
        <div className={styles.profileHeaderUserPhoto} tabIndex={0}>
          <img
            src={authUser!.photoURL ?? avatar}
            height={120}
            width={120}
            alt="Foto do usuário"
            onLoad={() => setCoverLoadingState(true)}
          />
          <div
            className={styles.profileHeaderUserPhotoControls}
            data-loading={isDeleting || isUpdating}
          >
            {renderPhotoAction()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default ProfileHeader;
