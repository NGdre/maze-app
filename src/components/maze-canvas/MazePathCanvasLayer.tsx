import { CanvasLayer } from "@components/lib/CanvasLayer";
import { PATH_WIDTH } from "@constants";
import { createIdToCellMap, PolygonCell } from "@models/maze";
import { drawLine } from "@models/maze-canvas-rendering";
import { useMazeStore } from "@stores/maze-store";
import { useCallback, useRef } from "react";
import { bfsVisualSchema } from "src/configs/visual";

export const MazePathCanvasLayer = () => {
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const prevCellRef = useRef<PolygonCell | null>(null);

  const change = useMazeStore((state) => state.currVisualMazeChange);
  const cells = useMazeStore((state) => state.mazeInstance?.cells);

  const ctx = ctxRef.current;
  const prev = prevCellRef.current;

  if (ctx && change && cells) {
    const map = createIdToCellMap(cells);

    for (const cellChange of change) {
      const cell = map.get(cellChange.id);

      const whenPathIsFound =
        cellChange.color === bfsVisualSchema.colors.foundPath.line;

      if (!whenPathIsFound || !cell) continue;

      if (prev === null) {
        prevCellRef.current = cell;
        continue;
      }

      if (cellChange.color !== null) {
        const connectDots = drawLine({
          ctx,
          strokeStyle: cellChange.color,
          lineWidth: PATH_WIDTH,
        });

        connectDots(prev.center.x, prev.center.y, cell.center.x, cell.center.y);

        prevCellRef.current = cell;
      }
    }
  }
  const renderPath = useCallback(function (ctx: CanvasRenderingContext2D) {
    if (!ctxRef.current) ctxRef.current = ctx;
  }, []);

  return <CanvasLayer onRender={renderPath} />;
};
