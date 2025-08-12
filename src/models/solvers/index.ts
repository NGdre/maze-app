import { AlgoConfig, AlgoFeatureName } from "src/configs/types";
import aStar from "./a-star";
import { bfsVisual, bfsSerialVisual } from "./breadth-first-search";

export const solversInfo: AlgoConfig[] = [
  {
    function: aStar,
    algoName: "A*",
    id: 0,
    features: [],
    multipleFunctions: false,
  },
  {
    functions: {
      SteppedAlgoExecution: bfsSerialVisual,
      JumpToFinal: bfsVisual,
    },
    algoName: "breadth first search",
    id: 1,
    features: ["JumpToFinal", "SteppedAlgoExecution"],
    multipleFunctions: true,
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

export const getFunctionById = (id: number, feature?: AlgoFeatureName) => {
  const foundSI = solversInfo.find((si) => si.id === id);

  if (!foundSI) throw new Error(notFoundSolverMessage(id));

  if (foundSI.multipleFunctions && feature) return foundSI.functions[feature];

  if ("function" in foundSI) return foundSI.function;
};
