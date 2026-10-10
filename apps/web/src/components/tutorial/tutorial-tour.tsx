import React from "react";
import { STATUS, useJoyride } from "react-joyride";
import { useSelector } from "react-redux";

import { RootState, useAppDispatch } from "../../store/configure-store";
import { closeToolMenuState } from "../../store/reducers/tool-menu/tool-menu";
import { startTutorial, stopTutorial } from "../../store/reducers/tutorial/tutorial";
import { updateAuthUser } from "../../store/reducers/user/user-auth";
import { updateUserThunk } from "../../store/thunks/user/user-data";
import {
  desktopTutorialSteps,
  mobileTutorialSteps,
} from "../../templates/tutorial-steps-map";
import { shouldAutoStartTutorial } from "../../utils/tutorial/should-auto-start-tutorial";
import TutorialTooltip from "./tutorial-tooltip";

const TutorialTour = () => {
  const dispatch = useAppDispatch();
  const { run } = useSelector((state: RootState) => state.tutorial);
  const { authUser } = useSelector((state: RootState) => state.userAuth);
  const hasAutoStarted = React.useRef(false);
  const [isDesktopViewport, setIsDesktopViewport] = React.useState(
    () => window.matchMedia("(min-width: 31.25rem)").matches,
  );

  React.useEffect(() => {
    const query = window.matchMedia("(min-width: 31.25rem)");
    const handleChange = () => setIsDesktopViewport(query.matches);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  const { Tour } = useJoyride({
    continuous: true,
    run,
    steps: isDesktopViewport ? desktopTutorialSteps : mobileTutorialSteps,
    tooltipComponent: TutorialTooltip,
    options: {
      closeButtonAction: "skip",
      skipBeacon: true,
      spotlightPadding: 4,
      overlayColor: "rgba(0, 0, 0, 0.6)",
      arrowColor: "var(--ne-c7)",
      zIndex: 1000,
    },
    styles: {
      spotlight: {
        stroke: "var(--ne-c11)",
        strokeWidth: 2,
      },
    },
    locale: {
      back: "Voltar",
      close: "Fechar",
      last: "Concluir",
      next: "Próximo",
    },
    onEvent: (data) => {
      if (data.status === STATUS.FINISHED || data.status === STATUS.SKIPPED) {
        dispatch(stopTutorial());
        dispatch(closeToolMenuState());
        if (authUser?.uid) {
          dispatch(
            updateUserThunk({
              uid: authUser.uid,
              hasSeenTutorial: true,
              hasAlert: false,
            }),
          );
          dispatch(updateAuthUser({ hasSeenTutorial: true }));
        }
      }
    },
  });

  React.useEffect(() => {
    if (hasAutoStarted.current || !authUser?.uid) return;

    if (shouldAutoStartTutorial(authUser.hasSeenTutorial)) {
      hasAutoStarted.current = true;
      dispatch(startTutorial());
    }
  }, [authUser, dispatch]);

  return Tour;
};

export default TutorialTour;
