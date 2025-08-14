import { useEffect, useState } from "react";
import { useMazeStore } from "../../stores/maze-store";
import {
  useSetIsMazeRendering,
  useTakeStepInSolution,
} from "@stores/selectors";

const buttonText = {
  STOP: "остановить",
  RESUME: "запустить",
};

let animationDelay = 30;

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
    }, animationDelay);

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
