import { useIsMazeRendering, useSetIsMazeRendering } from "@stores/selectors";
import { useMazeStore } from "../../stores/maze-store";
import RunAndWaitButton from "../lib/RunAndWaitButton";

const mazeGenerationbuttonText = {
  RENDERING: "Рисую лабиринт...",
  RENDER: "Нарисовать лабиринт",
};

const MazeGenerationButton = () => {
  const isMazeRendering = useIsMazeRendering();
  const setIsMazeRendering = useSetIsMazeRendering();

  const generateMaze = useMazeStore((state) => state.generateMaze);

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
