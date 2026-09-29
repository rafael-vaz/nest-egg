import creationMenuItemsMap from "../../templates/creation-menu-items-map";
import styles from "./creation-menu-list.module.css";
import CreationMenuListItem from "./creation-menu-list-item";

const CreationMenuList = () => {
  const items = creationMenuItemsMap.map((item) => (
    <CreationMenuListItem
      id={item.id}
      icon={item.icon}
      title={item.title}
      description={item.description}
    />
  ));
  return <ul className={styles.creationMenuList}>{...items}</ul>;
};

export default CreationMenuList;
