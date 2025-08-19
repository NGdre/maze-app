// export interface bfsVisualSchema {
//   colors: Record<string, Record<string, string>>;
// }

type CellConfig = {
  colors: {
    background: string;
    line?: string;
  };
};

export type bfsVisualSchema = Record<string, CellConfig>;

export const bfsVisualSchema: bfsVisualSchema = {
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

// export const bfsVisualSchema: bfsVisualSchema = {
//   colors: {
//     enqueued: {
//       background: "#023047",
//     },
//     visited: {
//       background: "#b0c4b1",
//     },
//     foundPath: {
//       line: "#ffb703",
//       background: "grey",
//     },
//   },
// } as const;
