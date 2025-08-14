import { useMazeStore } from "./maze-store";

export const useMazeCells = () =>
  useMazeStore((state) => state.mazeInstance?.cells);

export const useCurrVisualMazeChange = () =>
  useMazeStore((state) => state.currVisualMazeChange);

export const useCellHistory = () => useMazeStore((state) => state.cellHistory);

export const useStartId = () => useMazeStore((state) => state.startId);

export const useEndId = () => useMazeStore((state) => state.endId);

export const useColumnsAmount = () =>
  useMazeStore((state) => state.columnsAmount);

export const useRowsAmount = () => useMazeStore((state) => state.rowsAmount);

export const useIsMazeRendering = () =>
  useMazeStore((state) => state.isMazeRendering);

export const useSetIsMazeRendering = () =>
  useMazeStore((state) => state.setIsMazeRendering);

export const useTakeStepInSolution = () =>
  useMazeStore((state) => state.takeStepInSolution);
