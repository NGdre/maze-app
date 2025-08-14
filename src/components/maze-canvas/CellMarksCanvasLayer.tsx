import { CanvasLayer } from "@components/lib/CanvasLayer";
import { colors } from "@constants";
import { createCellFinder } from "@models/maze";
import { fillPolygonWithCircle } from "@models/maze-canvas-rendering";
import { identity } from "lodash";
import { useCallback } from "react";
import { useEndId, useMazeCells, useStartId } from "@stores/selectors";

export const CellMarksCanvasLayer = () => {
  const cells = useMazeCells();
  const startId = useStartId();
  const endId = useEndId();

  const findCell = useCallback(cells ? createCellFinder(cells) : identity, [
    cells,
  ]);

  const renderCellMarks = useCallback(
    function (ctx: CanvasRenderingContext2D, width: number) {
      if (!ctx || width === 0 || !cells || !startId || !endId) return;

      ctx.reset();

      const startCell = findCell(startId);

      if (startCell) fillPolygonWithCircle(ctx, startCell, colors.START_CELL);

      const endCell = findCell(endId);

      if (endCell) fillPolygonWithCircle(ctx, endCell, colors.END_CELL);
    },
    [cells, startId, endId]
  );

  return <CanvasLayer onRender={renderCellMarks} />;
};
