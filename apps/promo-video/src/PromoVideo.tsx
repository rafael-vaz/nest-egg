import {linearTiming, TransitionSeries} from "@remotion/transitions";
import {fade} from "@remotion/transitions/fade";
import {slide} from "@remotion/transitions/slide";
import {Scene01Opening} from "./scenes/Scene01Opening";
import {Scene02Dashboard} from "./scenes/Scene02Dashboard";
import {Scene03Transaction} from "./scenes/Scene03Transaction";
import {Scene04Reconciliation} from "./scenes/Scene04Reconciliation";
import {Scene05Goals} from "./scenes/Scene05Goals";
import {Scene06Resources} from "./scenes/Scene06Resources";
import {Scene07Profile} from "./scenes/Scene07Profile";
import {Scene08Closing} from "./scenes/Scene08Closing";
import {PADDED_DURATIONS, TRANSITION_DURATION} from "./timing";

const scenes = [
  {id: "opening", Component: Scene01Opening},
  {id: "dashboard", Component: Scene02Dashboard},
  {id: "transaction", Component: Scene03Transaction},
  {id: "reconciliation", Component: Scene04Reconciliation},
  {id: "goals", Component: Scene05Goals},
  {id: "resources", Component: Scene06Resources},
  {id: "profile", Component: Scene07Profile},
  {id: "closing", Component: Scene08Closing},
] as const;

// Brand <-> UI transitions fade; UI -> UI transitions slide, per the
// spec's composition rules.
const transitionPresentation = (fromId: string, toId: string) => {
  const brandIds = new Set(["opening", "closing"]);
  return brandIds.has(fromId) || brandIds.has(toId) ? fade() : slide();
};

export const PromoVideo: React.FC = () => {
  return (
    <TransitionSeries>
      {scenes.flatMap(({id, Component}, index) => {
        const elements = [
          <TransitionSeries.Sequence
            key={`seq-${id}`}
            durationInFrames={PADDED_DURATIONS[id]}
          >
            <Component />
          </TransitionSeries.Sequence>,
        ];

        if (index < scenes.length - 1) {
          const nextId = scenes[index + 1].id;
          elements.push(
            <TransitionSeries.Transition
              key={`trans-${id}-${nextId}`}
              presentation={transitionPresentation(id, nextId)}
              timing={linearTiming({durationInFrames: TRANSITION_DURATION})}
            />,
          );
        }

        return elements;
      })}
    </TransitionSeries>
  );
};
