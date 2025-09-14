type CellConfig = {
  colors: {
    background: string;
    line?: string;
  };
  text?: Record<string, string>;
};

export type VisualSchema = Record<string, CellConfig>;

const baseVisualSchema: VisualSchema = {
  enqueued: {
    colors: {
      background: "#023047",
    },
  },
  visited: {
    colors: {
      background: "#b0c4b1",
    },
  },
  foundPath: {
    colors: {
      line: "#ffb703",
      background: "grey",
    },
  },
} as const;

export const bfsVisualSchema: VisualSchema = {
  ...baseVisualSchema,
} as const;

export const aStarVisualSchema: VisualSchema = {
  ...baseVisualSchema,
} as const;
