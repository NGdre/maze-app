interface Cell {
  id: string;
  neighbors: string[];
}

export function isValidPath(
  mazeCells: Array<Cell>,
  startId: string,
  endId: string,
  path: string[]
) {
  if (path.length === 0) {
    return startId === endId;
  }

  if (path[0] !== startId || path[path.length - 1] !== endId) {
    return false;
  }

  const cellMap = new Map();

  for (const cell of mazeCells) {
    cellMap.set(cell.id, cell);
  }

  const visited = new Set();

  for (let i = 0; i < path.length; i++) {
    const currentId = path[i];
    const currentCell = cellMap.get(currentId);

    // Check if cell exists in the maze
    if (!currentCell) {
      return false;
    }

    // Check for duplicate visits
    if (visited.has(currentId)) {
      return false;
    }

    visited.add(currentId);

    if (i > 0) {
      const prevId = path[i - 1];
      const prevCell = cellMap.get(prevId);

      // Ensure current cell is a neighbor of the previous cell
      if (!prevCell.neighbors.includes(currentId)) {
        return false;
      }
    }
  }

  return true;
}
