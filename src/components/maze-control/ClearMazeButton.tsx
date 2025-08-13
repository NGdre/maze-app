import { useMazeStore } from "../../stores/maze-store";

const ClearMazeButton = () => {
  const clearMaze = useMazeStore((state) => state.resetSolverState);
  const isMazeRendering = useMazeStore((state) => state.isMazeRendering);
  return (
    <button
      onClick={() => {
        clearMaze();
      }}
      disabled={isMazeRendering}
    >
      Очистить
    </button>
  );
};

export default ClearMazeButton;
