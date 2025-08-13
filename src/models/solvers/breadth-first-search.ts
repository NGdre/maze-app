import { mapGenerator } from "@utils";
import { createIdToCellMap } from "../maze";
import { reconstructPathSerial } from "./reconstruct-path";
import { bfsVisualSchema } from "src/configs/visual";

type id = string;

export type BFSSolutionStep =
  | {
      isPathFound: false;
      enqueued: id[];
      visited: id;
    }
  | {
      isPathFound: true;
      foundPath: id;
    };

type bfsCell = {
  id: id;
  color: string;
  isPathFound: boolean;
};

export function applyBfsVisual(solutionStep: BFSSolutionStep) {
  const changedCells: bfsCell[] = [];

  if (solutionStep.isPathFound) {
    changedCells.push({
      id: solutionStep.foundPath,
      color: bfsVisualSchema.colors.foundPath.background,
      isPathFound: true,
    });
  } else {
    if (solutionStep.enqueued)
      for (const id of solutionStep.enqueued) {
        changedCells.push({
          id,
          color: bfsVisualSchema.colors.enqueued.background,
          isPathFound: false,
        });
      }

    if (solutionStep.visited)
      changedCells.push({
        id: solutionStep.visited,
        color: bfsVisualSchema.colors.visited.background,
        isPathFound: false,
      });
  }

  return changedCells;
}

export function* bfsSerial(
  startId: id,
  endId: id,
  idToCellMap: ReturnType<typeof createIdToCellMap>
) {
  const queue = [startId];

  const visited = new Set();

  const cameFrom = new Map<string, string>();

  while (queue.length > 0) {
    const currId = queue.shift();

    if (currId === endId) {
      break;
    }

    // it needs so typescript could shut up
    if (!currId) continue;

    const currCell = idToCellMap.get(currId);

    if (!currCell) throw new Error("the cell is not found in bfs loop");
    if (currCell.neighbors.length === 0)
      throw new Error("any cell in perfect maze must have an open neighbor");

    visited.add(currId);

    const partialSolution: BFSSolutionStep = {
      isPathFound: false,
      enqueued: [],
      visited: currId,
    };

    for (const neighborId of currCell.neighbors) {
      if (!visited.has(neighborId)) {
        partialSolution.enqueued!.push(neighborId);

        queue.push(neighborId);

        cameFrom.set(neighborId, currId);
      }
    }

    yield partialSolution;
  }

  for (const cellId of reconstructPathSerial(startId, endId, cameFrom)) {
    const partialSolution: BFSSolutionStep = {
      isPathFound: true,
      foundPath: cellId,
    };

    yield partialSolution;
  }
}

export function bfsSerialVisual(
  startId: string,
  endId: string,
  idToCellMap: ReturnType<typeof createIdToCellMap>
) {
  return mapGenerator(bfsSerial(startId, endId, idToCellMap), applyBfsVisual);
}

export function bfsVisual(
  startId: string,
  endId: string,
  idToCellMap: ReturnType<typeof createIdToCellMap>
) {
  const res = [];

  for (const solution of bfsSerial(startId, endId, idToCellMap)) {
    res.push(applyBfsVisual(solution));
  }

  return res;
}
