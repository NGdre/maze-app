import { useTakeStepInSolution } from "@stores/selectors";
import { TimeDirection } from "@stores/maze-store";

const TakeSolutionStepButton = ({
  direction,
}: {
  direction: TimeDirection;
}) => {
  const takeStepInSolution = useTakeStepInSolution();

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
