import { useEffect, useState } from "react";
import {
  useSetIsMazeRendering,
  useTakeStepInSolution,
} from "@stores/selectors";
import { VISIALIZATION_ANIMATION_DELAY } from "@constants";

const buttonText = {
  STOP: "остановить",
  RESUME: "запустить",
};

const StopOrResumeButton = () => {
  const takeStepInSolution = useTakeStepInSolution();
  const [shouldWork, setShouldWork] = useState(false);
  const setIsMazeRendering = useSetIsMazeRendering();

  useEffect(() => {
    if (!shouldWork) {
      setIsMazeRendering(false);
      return;
    }

    setIsMazeRendering(true);

    const animationTimer = setInterval(() => {
      const success = takeStepInSolution("forward");

      if (!success) setShouldWork(false);
    }, VISIALIZATION_ANIMATION_DELAY);

    return () => {
      setIsMazeRendering(false);
      clearInterval(animationTimer);
    };
  }, [shouldWork]);

  return (
    <button
      onClick={() => {
        setShouldWork(!shouldWork);
      }}
    >
      {shouldWork ? buttonText.STOP : buttonText.RESUME}
    </button>
  );
};

export default StopOrResumeButton;
