import { type createIdToCellMap } from "../maze";
import { reconstructPath } from "./reconstruct-path";

export default function bfs(
  startId: string,
  endId: string,
  idToCellMap: ReturnType<typeof createIdToCellMap>
) {
  const queue = [startId];

  const visited = new Set();
  visited.add(startId);

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

    for (const neighborId of currCell.neighbors) {
      if (!visited.has(neighborId)) {
        visited.add(neighborId);

        queue.push(neighborId);

        cameFrom.set(neighborId, currId);
      }
    }
  }

  return reconstructPath(startId, endId, cameFrom);
}
