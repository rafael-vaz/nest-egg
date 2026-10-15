import { useSelector } from "react-redux";

import { RootState } from "../../store/configure-store";
import profileCardsMap from "../../templates/profile-cards-map";
import getProfileCardValues from "../../utils/profile/get-profile-card-values";
import GridContainer from "../grid-container/grid-container";
import ProfileCard from "./profile-card";

const ProfileInfo = () => {
  const { goals, collections, transactions } = useSelector(
    (state: RootState) => state.userFinances,
  );
  const cardValues = getProfileCardValues({ goals, collections, transactions });

  const cards = profileCardsMap.map((card) => {
    return (
      <ProfileCard
        key={card.id}
        {...card}
        value={`${cardValues[card.id] ?? 0}`}
      />
    );
  });
  return <GridContainer columns={2}>{...cards}</GridContainer>;
};

export default ProfileInfo;
