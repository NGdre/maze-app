/*
    SteppedAlgoExecution - for algorithms that support serial execution by giving partial results,
    JumpToFinal - for algorithm that support jumping to final result of algorithm
*/
export type AlgoFeatureName = "SteppedAlgoExecution" | "JumpToFinal";

export type MazeGenerationAlgoName = "Kruskal" | "RecursiveBacktracking";

export type MazePathFindingAlgoName = "breadth first search" | "A*";

export type AlgoName = MazeGenerationAlgoName | MazePathFindingAlgoName;

export type AlgoConfig =
  | {
      multipleFunctions: true;
      features: AlgoFeatureName[];
      id: number;
      algoName: AlgoName;
      functions: Partial<Record<AlgoFeatureName, Function>>;
    }
  | {
      multipleFunctions: false;
      features: AlgoFeatureName[];
      id: number;
      algoName: AlgoName;
      function: Function;
    };
