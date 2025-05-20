import { useMazeStore } from "../../stores/maze-store";
import RunAndWaitButton from "../lib/RunAndWaitButton";

const mazeGenerationbuttonText = {
  RENDERING: "Рисую лабиринт...",
  RENDER: "Нарисовать лабиринт",
};

const MazeGenerationButton = () => {
  const isMazeRendering = useMazeStore((state) => state.isMazeRendering);

  const generateMaze = useMazeStore((state) => state.generateMaze);
  const setIsMazeRendering = useMazeStore((state) => state.setIsMazeRendering);

  const isLoading = isMazeRendering;

  return (
    <RunAndWaitButton
      onClick={() => {
        setIsMazeRendering(true);
        generateMaze();
      }}
      waitText={mazeGenerationbuttonText.RENDERING}
      runText={mazeGenerationbuttonText.RENDER}
      isLoading={isLoading}
    />
  );
};

export default MazeGenerationButton;
