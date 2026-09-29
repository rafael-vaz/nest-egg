import Separator from "../separator/separator";
import styles from "./profile.module.css";
import ProfileFooter from "./profile-footer";
import ProfileForm from "./profile-form";
import ProfileHeader from "./profile-header";
import ProfileInfo from "./profile-info";

interface IProfileProps {
  onClose: () => void;
}

const Profile = ({ onClose }: IProfileProps) => {
  return (
    <div className={styles.profile}>
      <ProfileHeader onClose={onClose} />
      <ProfileForm />
      <Separator />
      <ProfileInfo />
      <ProfileFooter />
    </div>
  );
};

export default Profile;
