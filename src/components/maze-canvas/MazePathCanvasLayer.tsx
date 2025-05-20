import { CanvasLayer } from "@components/lib/CanvasLayer";
import { PATH_WIDTH, colors } from "@constants";
import { drawPath } from "@models/maze-canvas-rendering";
import { useMazeStore } from "@stores/maze-store";
import { useCallback } from "react";

export const MazePathCanvasLayer = () => {
  const setIsMazeRendering = useMazeStore((state) => state.setIsMazeRendering);
  const path = useMazeStore((state) => state.mazeSolution);

  const renderPath = useCallback(
    function (ctx: CanvasRenderingContext2D, width: number) {
      if (width <= 0 || path.length === 0) return;

      ctx.reset();

      drawPath(ctx, path, {
        lineWidth: PATH_WIDTH,
        pathColor: colors.PATH_COLOR,
      });

      setIsMazeRendering(false);
    },
    [path]
  );

  return <CanvasLayer onRender={renderPath} />;
};
