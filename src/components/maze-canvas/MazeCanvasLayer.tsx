import { CanvasLayer } from "@components/lib/CanvasLayer";
import { colors, WALLS_WIDTH } from "@constants";
import { drawWalls } from "@models/maze-canvas-rendering";
import { useCallback } from "react";
import { useMazeStore } from "@stores/maze-store";
import {
  useColumnsAmount,
  useMazeCells,
  useSetIsMazeRendering,
} from "@stores/selectors";

export const MazeCanvasLayer = () => {
  const columns = useColumnsAmount();
  const cells = useMazeCells();
  const setIsMazeRendering = useSetIsMazeRendering();

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
        wallColor: colors.WALL_COLOR,
      });

      setIsMazeRendering(false);
    },
    [columns, cells]
  );

  return <CanvasLayer onRender={renderMaze} />;
};
