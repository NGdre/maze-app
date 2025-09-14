import { CanvasLayer } from "@components/lib/CanvasLayer";
import { colors } from "@constants";
import { createIdToCellMap } from "@models/maze";
import { drawPolygon } from "@models/maze-canvas-rendering";
import { TextInBoxRenderer } from "@models/text-in-box-renderer";
import {
  useCellHistory,
  useCurrVisualMazeChange,
  useMazeCells,
} from "@stores/selectors";
import { scalePolygon } from "@utils";
import { useCallback, useRef } from "react";
import fontForNumbers from "../../assets/fonts/BarlowCondensed-Light.ttf";
import { buildTextInCellConfig } from "src/configs/visual";
import { AStarText } from "@solvers/a-star";

const fontForNumbersName = "Barlow Condensed";
const ERASE_CELL_RATIO = 1;

// InnerStateOfAlgoCanvasLayer явно неудачное название
export const TextInCellsCanvasLayer = () => {
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const change = useCurrVisualMazeChange();
  const cellHistory = useCellHistory();
  const cells = useMazeCells();

  const ctx = ctxRef.current;

  if (ctx && cellHistory.getState().size === 0) ctx.clearRect(0, 0, 9999, 9999);

  if (ctx && change && cells) {
    const idToCellMap = createIdToCellMap(cells);

    const renderer = new TextInBoxRenderer(ctx);

    for (const cellChange of change) {
      const currCell = idToCellMap.get(cellChange.id);

      if (!currCell) continue;

      const isPathCell = cellChange.isPathCell;

      if (isPathCell || !cellChange.text) {
        drawPolygon(
          ctx,
          scalePolygon(currCell.getPoints(), ERASE_CELL_RATIO),
          colors.EMPTY_CELL
        );
        continue;
      }

      if (!cellChange.text) continue;

      const currCellPos = currCell.getPoints()[0];

      const textInCellConfig = buildTextInCellConfig(
        Object.assign(currCellPos, { size: currCell.edgeLength }),
        cellChange.text as AStarText
      );

      renderer.addBox(textInCellConfig);
      renderer.render();
    }
  }

  const renderPath = useCallback(async function (
    ctx: CanvasRenderingContext2D
  ) {
    if (!ctxRef.current) {
      ctxRef.current = ctx;

      const loadFont = async () => {
        try {
          const font = new FontFace(
            fontForNumbersName,
            `url(${fontForNumbers})`
          );
          await font.load();
          document.fonts.add(font);
        } catch (error) {
          console.error("Error loading font:", error);
        }
      };

      loadFont();
    }
  },
  []);

  return <CanvasLayer onRender={renderPath} />;
};
