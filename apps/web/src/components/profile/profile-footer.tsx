import { Trash2 } from "lucide-react";

import { useAppDispatch } from "../../store/configure-store";
import { openConfirmationModalState } from "../../store/reducers/modal/confirmation-modal";
import Button from "../button/button";
import styles from "./profile-footer.module.css";
import ProfileRecoveryPasswordButton from "./profile-recovery-password-button";

const ProfileFooter = () => {
  const dispatch = useAppDispatch();
  return (
    <footer className={styles.profileFooter}>
      <Button
        aria-label="Deletar conta"
        text="Deletar conta"
        icon={Trash2}
        color="transparent"
        className={styles.profileFooterDeleteAccountButton}
        onClick={() =>
          dispatch(
            openConfirmationModalState({ id: "confirm-remove-user-account" })
          )
        }
      />
      <ProfileRecoveryPasswordButton />
    </footer>
  );
};

export default ProfileFooter;
