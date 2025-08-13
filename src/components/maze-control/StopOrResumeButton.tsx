import { useEffect, useState } from "react";
import { useMazeStore } from "../../stores/maze-store";

const buttonText = {
  STOP: "остановить",
  RESUME: "запустить",
};

let animationDelay = 30;

const StopOrResumeButton = () => {
  const takeStepInSolution = useMazeStore((state) => state.takeStepInSolution);
  const [shouldWork, setShouldWork] = useState(false);

  useEffect(() => {
    if (!shouldWork) return;

    const animationTimer = setInterval(() => {
      const success = takeStepInSolution("forward");

      if (!success) setShouldWork(false);
    }, animationDelay);

    return () => clearInterval(animationTimer);
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
