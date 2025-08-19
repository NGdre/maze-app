import { CanvasLayer } from "@components/lib/CanvasLayer";
import { colors, FILL_TO_CELL_RATIO } from "@constants";
import { createIdToCellMap } from "@models/maze";
import { drawPolygon } from "@models/maze-canvas-rendering";
import {
  useCellHistory,
  useCurrVisualMazeChange,
  useMazeCells,
} from "@stores/selectors";
import { scalePolygon } from "@utils";
import { useCallback, useRef } from "react";

const ERASE_CELL_RATIO = 1;

export const InnerStateOfAlgoCanvasLayer = () => {
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const change = useCurrVisualMazeChange();
  const cellHistory = useCellHistory();
  const cells = useMazeCells();

  const ctx = ctxRef.current;

  if (ctx && cellHistory.getState().size === 0) ctx.clearRect(0, 0, 9999, 9999);

  if (ctx && change && cells) {
    const idToCellMap = createIdToCellMap(cells);

    for (const cellChange of change) {
      const currCell = idToCellMap.get(cellChange.id);

      if (!currCell) continue;

      const isPathCell = cellChange.isPathCell;

      const drawPolygonArgs = isPathCell
        ? { scaleFactor: ERASE_CELL_RATIO, color: colors.EMPTY_CELL }
        : {
            scaleFactor: FILL_TO_CELL_RATIO,
            color:
              (cellChange.color as string | undefined) || colors.EMPTY_CELL,
          };

      drawPolygon(
        ctx,
        scalePolygon(currCell.getPoints(), drawPolygonArgs.scaleFactor),
        drawPolygonArgs.color
      );
    }
  }

  const renderPath = useCallback(function (ctx: CanvasRenderingContext2D) {
    if (!ctxRef.current) ctxRef.current = ctx;
  }, []);

  return <CanvasLayer onRender={renderPath} />;
};
