export interface bfsVisualSchema {
  colors: Record<string, Record<string, string>>;
}

export const bfsVisualSchema: bfsVisualSchema = {
  colors: {
    enqueued: {
      background: "#023047",
    },
    visited: {
      background: "#b0c4b1",
    },
    foundPath: {
      line: "#ffb703",
      background: "grey",
    },
  },
} as const;
