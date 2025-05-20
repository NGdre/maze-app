import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { DEFAULT_COLUMNS_AMOUNT, DEFAULT_ROWS_AMOUNT } from "@constants";
import {
  createCellFinder,
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

export const cellSelectionModes = {
  none: "none",
  start: "start",
  end: "end",
};

export type cellSelectionModes = keyof typeof cellSelectionModes;

type State = {
  rowsAmount: RectMaze["rows"];
  columnsAmount: RectMaze["cols"];
  isMazeRendering: boolean;
  mazeGenerationAlgorithm: generatorNames;
  mazeInstance: RectMaze | null;
  mazeSolution: Array<PolygonCell>;
  startId: string;
  endId: string;
  cellSelection: cellSelectionModes;
  mazeSolverId: number;
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
};

export const useMazeStore = create<State & Action>()(
  immer((set, get) => ({
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

    updateRowsAmount: (newRowsAmount) => set({ rowsAmount: newRowsAmount }),

    updateColumnsAmount: (newColumnsAmount) =>
      set({ columnsAmount: newColumnsAmount }),

    updateMazeGenerationAlgorithm: (newAlgorithm) =>
      set({ mazeGenerationAlgorithm: newAlgorithm }),

    setMazeSolverId: (mazeSolverId) => {
      console.log(mazeSolverId);
      set({ mazeSolverId });
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

    solveMaze() {
      const startId = get().startId;
      const endId = get().endId;

      set((draft) => {
        const maze = draft.mazeInstance;

        if (!maze) return;

        const cells = maze.cells;

        const mazeSolver = getFunctionById(0);

        //@ts-ignore
        const findCell = createCellFinder(cells);
        //@ts-ignore
        const map = createIdToCellMap(cells);

        const path = mazeSolver(startId, endId, map) || [];

        const mazeSolution = path.map((cellId) => {
          return findCell(cellId);
        });

        //@ts-ignore
        draft.mazeSolution = mazeSolution;
      });
    },
  }))
);
