import sidebarItemsMap from "../../templates/sidebar-items-map";
import UserMenu from "../user-menu/user-menu";
import styles from "./sidebar.module.css";
import SidebarControl from "./sidebar-control";
import SidebarItem from "./sidebar-item";

const Sidebar = () => {
  const sidebarItems = sidebarItemsMap.map(
    ({ id, label, description, icon: Icon }) => {
      return (
        <SidebarItem
          id={id}
          label={label}
          descritiption={description}
          icon={Icon}
        />
      );
    }
  );
  return (
    <nav className={styles.sidebar}>
      <ul className={styles.sidebarGroup}>
        <SidebarControl />
        {...sidebarItems.slice(0, 6)}
      </ul>
      <ul className={styles.sidebarGroup}>
        {...sidebarItems.slice(6)}
        <UserMenu />
      </ul>
    </nav>
  );
};

export default Sidebar;
