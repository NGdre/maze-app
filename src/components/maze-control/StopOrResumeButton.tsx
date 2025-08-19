import { useEffect } from "react";
import {
  useIsMazeRendering,
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
  const isMazeRendering = useIsMazeRendering();
  const setIsMazeRendering = useSetIsMazeRendering();

  useEffect(() => {
    if (!isMazeRendering) {
      setIsMazeRendering(false);
      return;
    }

    setIsMazeRendering(true);

    const animationTimer = setInterval(() => {
      const success = takeStepInSolution("forward");

      if (!success) setIsMazeRendering(false);
    }, VISIALIZATION_ANIMATION_DELAY);

    return () => {
      setIsMazeRendering(false);
      clearInterval(animationTimer);
    };
  }, [isMazeRendering]);

  return (
    <button
      onClick={() => {
        setIsMazeRendering(!isMazeRendering);
      }}
    >
      {isMazeRendering ? buttonText.STOP : buttonText.RESUME}
    </button>
  );
};

export default StopOrResumeButton;
