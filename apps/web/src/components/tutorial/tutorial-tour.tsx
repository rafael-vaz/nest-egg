import React from "react";
import { STATUS, useJoyride } from "react-joyride";
import { useSelector } from "react-redux";

import { RootState, useAppDispatch } from "../../store/configure-store";
import { startTutorial, stopTutorial } from "../../store/reducers/tutorial/tutorial";
import { updateAuthUser } from "../../store/reducers/user/user-auth";
import { updateUserThunk } from "../../store/thunks/user/user-data";
import tutorialSteps from "../../templates/tutorial-steps-map";
import { shouldAutoStartTutorial } from "../../utils/tutorial/should-auto-start-tutorial";

const TutorialTour = () => {
  const dispatch = useAppDispatch();
  const { run } = useSelector((state: RootState) => state.tutorial);
  const { authUser } = useSelector((state: RootState) => state.userAuth);
  const hasAutoStarted = React.useRef(false);

  const { Tour } = useJoyride({
    continuous: true,
    run,
    steps: tutorialSteps,
    options: {
      showProgress: true,
      backgroundColor: "var(--ne-c7)",
      primaryColor: "var(--ne-c11)",
      textColor: "var(--ne-c1)",
      overlayColor: "rgba(0, 0, 0, 0.6)",
      arrowColor: "var(--ne-c7)",
      zIndex: 1000,
    },
    locale: {
      back: "Voltar",
      close: "Fechar",
      last: "Concluir",
      next: "Próximo",
      skip: "Pular",
    },
    onEvent: (data) => {
      if (data.status === STATUS.FINISHED || data.status === STATUS.SKIPPED) {
        dispatch(stopTutorial());
        if (authUser?.uid) {
          dispatch(
            updateUserThunk({ uid: authUser.uid, hasSeenTutorial: true }),
          );
          dispatch(updateAuthUser({ hasSeenTutorial: true }));
        }
      }
    },
  });

  React.useEffect(() => {
    if (hasAutoStarted.current || !authUser?.uid) return;

    const isDesktopViewport = window.matchMedia(
      "(min-width: 31.25rem)",
    ).matches;

    if (shouldAutoStartTutorial(authUser.hasSeenTutorial, isDesktopViewport)) {
      hasAutoStarted.current = true;
      dispatch(startTutorial());
    }
  }, [authUser, dispatch]);

  return Tour;
};

export default TutorialTour;
