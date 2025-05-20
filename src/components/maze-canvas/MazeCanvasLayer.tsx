import { CanvasLayer } from "@components/lib/CanvasLayer";
import { WALLS_WIDTH } from "@constants";
import { drawWalls } from "@models/maze-canvas-rendering";
import { useCallback } from "react";
import { useMazeStore } from "@stores/maze-store";

export const MazeCanvasLayer = () => {
  const columns = useMazeStore((state) => state.columnsAmount);
  const cells = useMazeStore((state) => state.mazeInstance?.cells);
  const setIsMazeRendering = useMazeStore((state) => state.setIsMazeRendering);

  const initMaze = useMazeStore((state) => state.initMaze);

  const renderMaze = useCallback(
    function (ctx: CanvasRenderingContext2D, width: number) {
      if (width === 0) return;

      const cellSize = width / columns;

      if (!cells) {
        initMaze(cellSize);
        return;
      }

      ctx.reset();

      drawWalls(ctx, cells, {
        lineWidth: WALLS_WIDTH,
      });

      setIsMazeRendering(false);
    },
    [columns, cells]
  );

  return <CanvasLayer onRender={renderMaze} />;
};
