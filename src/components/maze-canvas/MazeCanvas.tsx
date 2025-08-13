import { useMazeStore } from "src/stores/maze-store";
import { CanvasLayersContainer } from "@components/lib/CanvasLayersContainer";
import { CellMarksCanvasLayer } from "./CellMarksCanvasLayer";
import { MazeCanvasLayer } from "./MazeCanvasLayer";
import { MazePathCanvasLayer } from "./MazePathCanvasLayer";
import { CursorInteractionCanvasLayer } from "./CursorInteractionCanvasLayer";
import { InnerStateOfAlgoCanvasLayer } from "./InnerStateOfAlgoCanvasLayer";

export function MazeCanvasImproved() {
  const rows = useMazeStore((state) => state.rowsAmount);
  const columns = useMazeStore((state) => state.columnsAmount);
  const aspect = columns / rows;

  return (
    <CanvasLayersContainer targetAspect={aspect}>
      <InnerStateOfAlgoCanvasLayer />
      <MazeCanvasLayer />
      <MazePathCanvasLayer />
      <CellMarksCanvasLayer />
      <CursorInteractionCanvasLayer />
    </CanvasLayersContainer>
  );
}
