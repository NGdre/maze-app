export type CellData = {
  id: string;
  neighbors: Array<string>;
  visited: boolean;
};

export type edge = [{ id: string }, { id: string } | undefined];

export type generatorNames = "dfs" | "kruskal";
