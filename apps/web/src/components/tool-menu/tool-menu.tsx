import React from "react";
import { useSelector } from "react-redux";

import { RootState } from "../../store/configure-store";
import toolMenuItemsMap from "../../templates/tool-menu-items-map";
import styles from "./tool-menu.module.css";
import ToolMenuBackground from "./tool-menu-background";
import ToolMenuCollection from "./tool-menu-collection";
import ToolMenuGroup from "./tool-menu-group";
import ToolMenuHeader from "./tool-menu-header";
import ToolMenuItem from "./tool-menu-item";

const ToolMenu = () => {
  const { isOpen } = useSelector((state: RootState) => state.toolMenu);
  const [shouldRender, setShouldRender] = React.useState(isOpen);
  const toolMenuRef = React.useRef(null);

  React.useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    }
  }, [isOpen]);

  const handleAnimationEnd = () => {
    if (!isOpen) {
      setShouldRender(false);
    }
  };

  return (
    shouldRender && (
      <ToolMenuBackground data-active={isOpen}>
        <aside
          className={styles.toolMenu}
          aria-label="Menu de ferramentas"
          data-active={isOpen}
          onAnimationEnd={handleAnimationEnd}
          ref={toolMenuRef}
        >
          <ToolMenuHeader />

          <div className={`${styles.toolMenuContent} smoothScrollbar`}>
            {toolMenuItemsMap.map((menuCollection) => {
              return (
                <ToolMenuCollection
                  id={menuCollection.id}
                  title={menuCollection.title}
                  key={menuCollection.id}
                >
                  {menuCollection.content.map((item) => {
                    if (item.type === "default") {
                      return (
                        <ToolMenuItem
                          id={item.id}
                          key={item.id}
                          icon={item.icon}
                          text={`${item.text}`}
                        />
                      );
                    } else if (item.type === "group") {
                      return (
                        <ToolMenuGroup
                          id={item.id}
                          key={item.id}
                          icon={item.icon}
                          title={`${item.title}`}
                        />
                      );
                    }
                  })}
                </ToolMenuCollection>
              );
            })}
          </div>
        </aside>
      </ToolMenuBackground>
    )
  );
};

export default ToolMenu;
