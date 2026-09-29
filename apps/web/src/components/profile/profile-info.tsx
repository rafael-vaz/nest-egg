import profileCardsMap from "../../templates/profile-cards-map";
import GridContainer from "../grid-container/grid-container";
import ProfileCard from "./profile-card";

const ProfileInfo = () => {
  const cards = profileCardsMap.map((card) => {
    return <ProfileCard {...card} />;
  });
  return <GridContainer columns={2}>{...cards}</GridContainer>;
};

export default ProfileInfo;
