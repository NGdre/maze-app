import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { DEFAULT_COLUMNS_AMOUNT, DEFAULT_ROWS_AMOUNT } from "@constants";
import {
  createIdToCellMap,
  createRectMaze,
  fillCellsWithOpenNeighbors,
  generateRectMazeId,
  removeWallsBetweenCells,
  type PolygonCell,
  type RectMaze,
} from "@models/maze";
import { getGeneratorByAlgoName } from "@generators/index";
import { generatorNames } from "@generators/index";
import { getFunctionById } from "@solvers/index";
import CellHistory, { TrackableCellChange } from "@models/CellHistory";

export const cellSelectionModes = {
  none: "none",
  start: "start",
  end: "end",
};

export type cellSelectionModes = keyof typeof cellSelectionModes;

export type TimeDirection = "backward" | "forward";

type State = {
  rowsAmount: RectMaze["rows"];
  columnsAmount: RectMaze["cols"];
  isMazeRendering: boolean;
  mazeGenerationAlgorithm: string;
  mazeInstance: RectMaze | null;
  mazeSolution: Array<PolygonCell>;
  startId: string;
  endId: string;
  cellSelection: cellSelectionModes;
  mazeSolverId: number;
  currVisualMazeChange: TrackableCellChange[] | null;
  cellHistory: CellHistory;
  serialSolver: Generator<[], void, any> | null;
};

type Action = {
  updateRowsAmount: (newRowsAmount: State["rowsAmount"]) => void;
  updateColumnsAmount: (newColumnsAmount: State["columnsAmount"]) => void;

  updateMazeGenerationAlgorithm: (
    newAlgorithm: State["mazeGenerationAlgorithm"]
  ) => void;

  initMaze: (edgeLength: number) => void;
  setIsMazeRendering: (newStatus: State["isMazeRendering"]) => void;

  generateMaze: () => void;
  solveMaze: () => void;

  setCellSelection: (cellSelection: State["cellSelection"]) => void;
  setStartId: (startId: State["startId"]) => void;
  setEndId: (endId: State["endId"]) => void;
  setMazeSolverId: (mazeSolverId: State["mazeSolverId"]) => void;

  takeStepInSolution: (direction: TimeDirection) => boolean;
  resetSolverState: () => void;
};

function initSerialSolver(
  startId: string,
  endId: string,
  mazeSolverId: number,
  mazeInstance: RectMaze | null
) {
  const mazeSolver = getFunctionById(mazeSolverId, "SteppedAlgoExecution");

  const maze = mazeInstance;

  if (!mazeSolver || !maze) return false;

  const cells = maze.cells;
  const map = createIdToCellMap(cells);

  return mazeSolver(startId, endId, map);
}

export const useMazeStore = create<State & Action>()(
  immer((set, get) => {
    const cellHistory = new CellHistory();

    return {
      cellHistory,
      serialSolver: null,
      rowsAmount: DEFAULT_ROWS_AMOUNT,
      columnsAmount: DEFAULT_COLUMNS_AMOUNT,
      isMazeRendering: false,
      mazeGenerationAlgorithm: generatorNames[0],
      mazeSolverId: 0,
      mazeInstance: null,
      mazeSolution: [],
      startId: generateRectMazeId(0, 0),
      endId: generateRectMazeId(0, 0),
      cellSelection: "none",
      currVisualMazeChange: null,

      updateRowsAmount: (newRowsAmount) => set({ rowsAmount: newRowsAmount }),

      updateColumnsAmount: (newColumnsAmount) =>
        set({ columnsAmount: newColumnsAmount }),

      updateMazeGenerationAlgorithm: (newAlgorithm) =>
        set({ mazeGenerationAlgorithm: newAlgorithm }),

      setMazeSolverId: (mazeSolverId) => {
        get().resetSolverState();

        set({
          mazeSolverId,
        });
      },

      setIsMazeRendering(newStatus) {
        set({ isMazeRendering: newStatus });
      },

      setCellSelection(cellSelection) {
        set({ cellSelection });
      },

      setStartId(startId) {
        set({ startId });
      },

      setEndId(endId) {
        set({ endId });
      },

      initMaze(edgeLength) {
        const rows = get().rowsAmount;
        const cols = get().columnsAmount;

        set({
          endId: generateRectMazeId(rows - 1, cols - 1),
        });

        const maze = createRectMaze(rows, cols, edgeLength);

        set({ mazeInstance: maze });
      },

      get currIterationStep() {
        return cellHistory.historyIndex;
      },

      resetSolverState: () => {
        cellHistory.clear();
        set({
          serialSolver: null,
          currVisualMazeChange: null,
          mazeSolution: [],
        });
      },

      async generateMaze() {
        const rows = get().rowsAmount;
        const cols = get().columnsAmount;
        const mazeInstance = get().mazeInstance;
        const currGeneratorAlgo = get().mazeGenerationAlgorithm;

        set({ mazeSolution: [] });

        const mazeGenerator = getGeneratorByAlgoName(currGeneratorAlgo);

        const toRemove = [...mazeGenerator(rows, cols)].map((pair) => [
          pair[0].id,
          pair[1].id,
        ]);

        if (!mazeInstance) return;

        const edgeLength = mazeInstance.cellSize;

        const maze = createRectMaze(rows, cols, edgeLength);

        //@ts-ignore
        removeWallsBetweenCells(maze.cells, toRemove);

        fillCellsWithOpenNeighbors(maze.cells);

        set({
          mazeInstance: maze,
        });
      },

      takeStepInSolution(direction) {
        const startId = get().startId;
        const endId = get().endId;
        const cellHistory = get().cellHistory;

        // do not change the order of cellHistory.undo() and cellHistory.redo() with set function

        if (direction === "backward") {
          if (cellHistory.canUndo()) {
            set({
              currVisualMazeChange: cellHistory.historyCurrentStep.backward,
            });

            cellHistory.undo();
          }

          return true;
        }

        if (cellHistory.canRedo()) {
          cellHistory.redo();

          set({
            currVisualMazeChange: cellHistory.historyCurrentStep.forward,
          });

          return true;
        }

        let serialSolver = get().serialSolver;

        if (cellHistory.isEmpty()) {
          serialSolver = initSerialSolver(
            startId,
            endId,
            get().mazeSolverId,
            get().mazeInstance
          );

          set({ serialSolver });
        }

        const next = serialSolver?.next();

        if (next && next.done) return false;

        if (next && !next.done) {
          cellHistory.applyStep(next.value);

          set({
            currVisualMazeChange: next.value,
          });

          return true;
        }

        return false;
      },

      solveMaze() {
        const startId = get().startId;
        const endId = get().endId;
        const cellHistory = get().cellHistory;
        let { serialSolver } = get();

        if (serialSolver === null) {
          serialSolver = initSerialSolver(
            startId,
            endId,
            get().mazeSolverId,
            get().mazeInstance
          );
          set({ serialSolver });
        }
        cellHistory.applyMultipleSteps([...serialSolver!]);

        set({
          currVisualMazeChange: cellHistory.historyCurrentStep.forward,
        });
      },
    };
  })
);
