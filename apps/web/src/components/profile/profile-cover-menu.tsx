import styles from "./profile-cover-menu.module.css";
import ProfileCoverMenuList from "./profile-cover-menu-list";

const ProfileCoverMenu = () => {
  return (
    <div className={styles.profileCoverMenu}>
      <ProfileCoverMenuList />
    </div>
  );
};

export default ProfileCoverMenu;
