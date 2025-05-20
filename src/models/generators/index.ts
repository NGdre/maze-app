import { kruskal } from "./kruskal.ts";
import { recursiveBacktracking } from "./recursive-backtracking.ts";
import "./types";

export { kruskal } from "./kruskal.ts";
export { recursiveBacktracking } from "./recursive-backtracking.ts";

export const generatorsInfo = [
  {
    function: kruskal,
    algoName: "kruskal",
    id: 0,
  },
  {
    function: recursiveBacktracking,
    algoName: "recursive backtracking",
    id: 1,
  },
];

export const generatorNames = generatorsInfo.map((gi) => gi.algoName);

export const getGeneratorByAlgoName = (algoName: string) => {
  const foundGI = generatorsInfo.find((gi) => gi.algoName === algoName);

  if (!foundGI) throw new Error("there's no algorithm with name " + algoName);

  return foundGI.function;
};
