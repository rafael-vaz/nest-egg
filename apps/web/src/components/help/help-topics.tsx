import React from "react";

import helpTopicsMap, { HelpTopicId } from "../../templates/help-topics-map";
import Button from "../button/button";
import Card from "../card/card";
import searchFilterStyles from "../search/search-filter.module.css";
import styles from "./help.module.css";

const HelpTopics = () => {
  const [activeTopic, setActiveTopic] = React.useState<HelpTopicId>(
    helpTopicsMap[0].id,
  );
  const topic = helpTopicsMap.find((item) => item.id === activeTopic)!;

  return (
    <div className={styles.helpTopics}>
      <ul className={searchFilterStyles.searchFilter} role="tablist">
        {helpTopicsMap.map(({ id, label }) => {
          const active = activeTopic === id;
          return (
            <li role="presentation" key={id}>
              <Button
                id={`help-topic-${id}`}
                role="tab"
                aria-selected={active}
                aria-controls={`help-topic-${id}-panel`}
                className={searchFilterStyles.searchFilterItem}
                data-active={active}
                onClick={() => setActiveTopic(id)}
                text={label}
              />
            </li>
          );
        })}
      </ul>
      <div id={`help-topic-${topic.id}-panel`} role="tabpanel">
        <Card id={`help-${topic.id}`} title={topic.label} icon={topic.icon}>
          <p>{topic.description}</p>
        </Card>
      </div>
    </div>
  );
};

export default HelpTopics;
