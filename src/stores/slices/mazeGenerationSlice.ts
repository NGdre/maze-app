import { StateCreator } from "zustand";
import {
  createRectMaze,
  fillCellsWithOpenNeighbors,
  generateRectMazeId,
  RectMaze,
  removeWallsBetweenCells,
} from "@models/maze";
import { MainStore } from "@stores/index";
import { generatorNames, getGeneratorByAlgoName } from "@generators/index";
import { DEFAULT_COLUMNS_AMOUNT, DEFAULT_ROWS_AMOUNT } from "@constants";

type State = {
  mazeInstance: RectMaze | null;
  mazeGenerationAlgorithm: string;
  rowsAmount: RectMaze["rows"];
  columnsAmount: RectMaze["cols"];
};

type Action = {
  updateRowsAmount: (newRowsAmount: State["rowsAmount"]) => void;
  updateColumnsAmount: (newColumnsAmount: State["columnsAmount"]) => void;

  updateMazeGenerationAlgorithm: (
    newAlgorithm: State["mazeGenerationAlgorithm"]
  ) => void;

  initMaze: (edgeLength: number) => void;
  generateMaze: () => void;
};

export type MazeGenerationSlice = State & Action;

export const createMazeGenerationSlice: StateCreator<
  MainStore,
  [["zustand/immer", never]],
  [["zustand/immer", never]],
  MazeGenerationSlice
> = (set, get) => ({
  rowsAmount: DEFAULT_ROWS_AMOUNT,
  columnsAmount: DEFAULT_COLUMNS_AMOUNT,
  mazeGenerationAlgorithm: generatorNames[0],
  mazeInstance: null,

  updateRowsAmount: (newRowsAmount) => set({ rowsAmount: newRowsAmount }),

  updateColumnsAmount: (newColumnsAmount) =>
    set({ columnsAmount: newColumnsAmount }),

  updateMazeGenerationAlgorithm: (newAlgorithm) =>
    set({ mazeGenerationAlgorithm: newAlgorithm }),

  initMaze(edgeLength) {
    const rows = get().rowsAmount;
    const cols = get().columnsAmount;

    set({
      endId: generateRectMazeId(rows - 1, cols - 1),
    });

    const maze = createRectMaze(rows, cols, edgeLength);

    set({ mazeInstance: maze });
  },

  generateMaze() {
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
});
