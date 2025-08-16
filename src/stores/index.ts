import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import CellHistory from "@models/CellHistory";
import {
  createMazeGenerationSlice,
  MazeGenerationSlice,
} from "./slices/mazeGenerationSlice";
import {
  createMazeSolutionSlice,
  MazeSolutionSlice,
} from "./slices/mazeSolutionSlice";

type State = {
  isMazeRendering: boolean;
  cellHistory: CellHistory;
};

type Action = {
  setIsMazeRendering: (newStatus: State["isMazeRendering"]) => void;
};

export type MainStore = State &
  Action &
  MazeGenerationSlice &
  MazeSolutionSlice;

export const createMazeStore = (initialState: Partial<State> = {}) =>
  create<MainStore>()(
    immer((set, get, api) => {
      const cellHistory = new CellHistory();

      return {
        cellHistory,
        isMazeRendering: false,
        ...initialState,

        ...createMazeGenerationSlice(set, get, api),
        ...createMazeSolutionSlice(set, get, api),

        setIsMazeRendering(newStatus) {
          set({ isMazeRendering: newStatus });
        },
      };
    })
  );

export const useMazeStore = createMazeStore();
