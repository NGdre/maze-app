import { TimeDirection, useMazeStore } from "../../stores/maze-store";

const TakeSolutionStepButton = ({
  direction,
}: {
  direction: TimeDirection;
}) => {
  const takeStepInSolution = useMazeStore((state) => state.takeStepInSolution);

  return (
    <button
      onClick={() => {
        takeStepInSolution(direction);
      }}
    >
      {direction}
    </button>
  );
};

export default TakeSolutionStepButton;
