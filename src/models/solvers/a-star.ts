import { reconstructPath } from "./reconstruct-path";
import { type createIdToCellMap } from "../maze";

class AStarNode {
  id: string;
  x: number;
  y: number;
  g: number;
  h: number;

  constructor(id: string, x: number, y: number, g: number = 0, h: number = 0) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.g = g;
    this.h = h;
  }

  get f(): number {
    return this.g + this.h;
  }

  static createKey(x: number, y: number) {
    return `${x},${y}`;
  }
}

export type heuristic = (
  firstPoint: { x: number; y: number },
  secondPoint: { x: number; y: number }
) => number;

export const manhattanDistance: heuristic = (firstPoint, secondPoint) => {
  return (
    Math.abs(firstPoint.x - secondPoint.x) +
    Math.abs(firstPoint.y - secondPoint.y)
  );
};

/*
  - нужно определится с возврщаемыми значениями
  - функция знает слишком много об интерфейсе узлов. Если он поменяется, то функция сломается
  - нужно сделать более прозрачную логику
*/
function aStar(
  startId: string,
  endId: string,
  idToCellMap: ReturnType<typeof createIdToCellMap>,
  heuristic: heuristic = manhattanDistance
) {
  const open: AStarNode[] = [];
  const closed = new Set<string>();
  const cameFrom = new Map<string, string>();

  const startCell = idToCellMap.get(startId);
  const endCell = idToCellMap.get(endId);

  if (!startCell || !endCell) return null;

  const startX = startCell.center.x;
  const startY = startCell.center.y;

  const endX = endCell.center.x;
  const endY = endCell.center.y;

  const startNode = new AStarNode(
    startId,
    startX,
    startY,
    0,
    heuristic({ x: startX, y: startY }, { x: endX, y: endY })
  );

  open.push(startNode);

  while (open.length > 0) {
    open.sort((a, b) => a.f - b.f || a.h - b.h);

    const currentAStarNode = open.shift()!;

    if (currentAStarNode.x === endX && currentAStarNode.y === endY) {
      return reconstructPath(startId, endId, cameFrom);
    }

    const currMazeCell = idToCellMap.get(currentAStarNode.id);

    if (!currMazeCell) return null;

    closed.add(AStarNode.createKey(currentAStarNode.x, currentAStarNode.y)); // почему такой порядок?

    for (const neighborId of currMazeCell.neighbors) {
      const neighborMazeCell = idToCellMap.get(neighborId);

      if (!neighborMazeCell) return null;

      const neighborX = neighborMazeCell.center.x;
      const neighborY = neighborMazeCell.center.y;

      const neighborKey = AStarNode.createKey(neighborX, neighborY);

      if (closed.has(neighborKey)) continue;

      const tentativeG = currentAStarNode.g + 1; // почему +1?

      const neighbor = open.find((n) => n.x === neighborX && n.y === neighborY);

      if (neighbor) {
        if (tentativeG < neighbor.g) {
          neighbor.g = tentativeG;

          cameFrom.set(neighborId, currentAStarNode.id);
        }
      } else {
        const h = heuristic(
          { x: neighborX, y: neighborY },
          { x: endX, y: endY }
        );

        open.push(
          new AStarNode(neighborId, neighborX, neighborY, tentativeG, h)
        );

        if (!cameFrom.has(neighborId))
          cameFrom.set(neighborId, currentAStarNode.id);
      }
    }
  }

  return null;
}

export default aStar;
