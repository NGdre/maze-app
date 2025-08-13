export const DEFAULT_ROWS_AMOUNT = 20;
export const DEFAULT_COLUMNS_AMOUNT = 29;

export const MIN_ROWS = 5;
export const MAX_ROWS = 100;
export const MIN_COLUMNS = 5;
export const MAX_COLUMNS = 100;

export const PROJECT_NAME = "maze app";

export const colors = {
  WALL_COLOR: "#5f0f40",
  EMPTY_CELL: "white",
  START_CELL: "green",
  END_CELL: "pink",
  HOVERED_CELL: "purple",
  PATH_COLOR: "red",
} as const;

export const PATH_WIDTH = 2;
export const WALLS_WIDTH = 0.5;

export const localStorageKeys = {
  MAZE_MATRIX: "maze-matrix",
} as const;

export const PATH_ANIMATION_DELAY = 0;
export const CELL_SELECTION_THROTTLE_DELAY = 0;

export const CELL_ID_DELIMITER = ",";

export const workTypes = {
  mazeGeneration: "mazeGeneration",
  renderOnly: "renderOnly",
  idle: "idle",
} as const;
