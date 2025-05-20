import { useMazeStore } from "../../stores/maze-store";
import RunAndWaitButton from "../lib/RunAndWaitButton";

const pathFindingbuttonText = {
  FINDING: "нахожу путь...",
  FIND: "Найти путь в лабиринте",
};

const PathFindingButton = () => {
  const isLoading = false;

  const solveMaze = useMazeStore((state) => state.solveMaze);
  const setIsMazeRendering = useMazeStore((state) => state.setIsMazeRendering);

  return (
    <RunAndWaitButton
      onClick={() => {
        setIsMazeRendering(true);
        solveMaze();
      }}
      waitText={pathFindingbuttonText.FINDING}
      runText={pathFindingbuttonText.FIND}
      isLoading={isLoading}
    />
  );
};

export default PathFindingButton;
