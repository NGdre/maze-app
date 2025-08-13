import { CanvasLayer } from "@components/lib/CanvasLayer";
import { colors } from "@constants";
import { createIdToCellMap } from "@models/maze";
import { drawPolygon } from "@models/maze-canvas-rendering";
import { useMazeStore } from "@stores/maze-store";
import { scalePolygon } from "@utils";
import { useCallback, useRef } from "react";
import { bfsVisualSchema } from "src/configs/visual";

export const InnerStateOfAlgoCanvasLayer = () => {
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const change = useMazeStore((state) => state.currVisualMazeChange);
  const cellHistory = useMazeStore((state) => state.cellHistory);
  const cells = useMazeStore((state) => state.mazeInstance?.cells);
  const ctx = ctxRef.current;

  if (ctx && cellHistory.getState().size === 0) ctx.clearRect(0, 0, 9999, 9999);

  if (ctx && change && cells) {
    const map = createIdToCellMap(cells);

    for (const cellChange of change) {
      const cell = map.get(cellChange.id);

      if (!cell) continue;

      const whenPathIsFound =
        cellChange.color === bfsVisualSchema.colors.foundPath.line;

      if (whenPathIsFound) {
        drawPolygon(ctx, scalePolygon(cell.getPoints(), 1), colors.EMPTY_CELL);
      } else
        drawPolygon(
          ctx,
          scalePolygon(cell.getPoints(), cellChange.color ? 0.5 : 1),
          cellChange.color || colors.EMPTY_CELL
        );
    }
  }

  const renderPath = useCallback(function (ctx: CanvasRenderingContext2D) {
    if (!ctxRef.current) ctxRef.current = ctx;
  }, []);

  return <CanvasLayer onRender={renderPath} />;
};
