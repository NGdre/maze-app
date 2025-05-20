import aStar from "./a-star";
import bfs from "./breadth-first-search";

export const solversInfo = [
  {
    function: aStar,
    algoName: "A*",
    id: 0,
  },
  {
    function: bfs,
    algoName: "breadth first search",
    id: 1,
  },
];

export const mazeSolversNames = solversInfo.map((si) => si.algoName);

export const getSolverIdByAlgoName = (algoName: string) => {
  const foundSI = solversInfo.find((si) => si.algoName === algoName);

  if (!foundSI) throw new Error("there's no algorithm with name " + algoName);

  return foundSI.id;
};

const notFoundSolverMessage = (id: number) =>
  "there's no algorithm with id " + id;

export const getFunctionById = (id: number) => {
  const foundSI = solversInfo.find((si) => si.id === id);

  if (!foundSI) throw new Error(notFoundSolverMessage(id));

  return foundSI.function;
};
