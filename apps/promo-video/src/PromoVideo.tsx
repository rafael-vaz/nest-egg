import {linearTiming, TransitionSeries} from "@remotion/transitions";
import {fade} from "@remotion/transitions/fade";
import {slide} from "@remotion/transitions/slide";
import {SCENES} from "./constants";
import {Scene01Opening} from "./scenes/Scene01Opening";
import {Scene02Dashboard} from "./scenes/Scene02Dashboard";
import {Scene03Transaction} from "./scenes/Scene03Transaction";
import {Scene04Reconciliation} from "./scenes/Scene04Reconciliation";
import {Scene05Goals} from "./scenes/Scene05Goals";
import {Scene06Resources} from "./scenes/Scene06Resources";
import {Scene07Profile} from "./scenes/Scene07Profile";
import {Scene08Closing} from "./scenes/Scene08Closing";

// TransitionSeries overlaps each Transition's duration between the two
// sequences it borders, shrinking the series' total length below the sum
// of its sequences' durationInFrames (see Remotion's transitions docs).
// To keep the composition's actual rendered length exactly
// TOTAL_DURATION_IN_FRAMES (locked in constants.ts/tested in Task 1,
// not something this task may silently shrink), every scene except the
// opening is padded by TRANSITION_DURATION frames — it donates that
// padding to the transition on its left — so the 7 transitions' total
// overlap (7 x 15 = 105 frames) is exactly offset by the 105 extra
// frames distributed across scenes 2-8.
const TRANSITION_DURATION = 15;

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
        const scene = SCENES.find((s) => s.id === id)!;
        const padding = index === 0 ? 0 : TRANSITION_DURATION;
        const elements = [
          <TransitionSeries.Sequence
            key={`seq-${id}`}
            durationInFrames={scene.durationInFrames + padding}
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
