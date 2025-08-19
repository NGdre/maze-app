import { useIsMazeRendering, useSetIsMazeRendering } from "@stores/selectors";
import { useMazeStore } from "../../stores/maze-store";
import RunAndWaitButton from "../lib/RunAndWaitButton";

const pathFindingbuttonText = {
  FINDING: "нахожу путь...",
  FIND: "Найти путь в лабиринте",
};

const PathFindingButton = () => {
  const isMazeRendering = useIsMazeRendering();
  const setIsMazeRendering = useSetIsMazeRendering();

  const solveMaze = useMazeStore((state) => state.solveMaze);

  return (
    <RunAndWaitButton
      onClick={() => {
        setIsMazeRendering(true);
        solveMaze();
      }}
      waitText={pathFindingbuttonText.FINDING}
      runText={pathFindingbuttonText.FIND}
      isLoading={isMazeRendering}
    />
  );
};

export default PathFindingButton;
