import ow from "ow";
import { sample } from "../../utils";
import { MAX_COLUMNS, MAX_ROWS } from "@constants";

const generateCellId = (i: number, j: number) => `${i},${j}`;

function getNeighbors(i: number, j: number, m: number, n: number) {
  const neighbors = [];

  if (i >= m || i < 0 || j < 0 || j >= n) return [];

  if (j + 1 < n) neighbors.push(generateCellId(i, j + 1));

  if (i + 1 < m) neighbors.push(generateCellId(i + 1, j));

  if (i - 1 >= 0) neighbors.push(generateCellId(i - 1, j));

  if (j - 1 >= 0) neighbors.push(generateCellId(i, j - 1));

  return neighbors;
}

const validate = (max: number) => ow.create(ow.number.integer.inRange(2, max));

export function* recursiveBacktracking(m: number, n: number) {
  validate(MAX_ROWS)(m);
  validate(MAX_COLUMNS)(n);

  const cellsMatrix = new Array(m);

  for (let i = 0; i < m; i++) {
    cellsMatrix[i] = new Array(n);

    for (let j = 0; j < n; j++) {
      cellsMatrix[i][j] = { visited: false, id: generateCellId(i, j) };
    }
  }

  const cells = [sample(sample(cellsMatrix))];

  while (cells.length > 0) {
    const currentCell = cells.at(-1);

    const [ic, jc] = currentCell.id.split(",");

    const unvisitedCells = getNeighbors(+ic, +jc, m, n)
      .map((neighborId: string) => {
        const [i, j] = neighborId.split(",");
        // i, j are strings
        return cellsMatrix[+i][+j];
      })
      .filter((neighbor: { visited: boolean }) => !neighbor.visited);

    const nextCell = sample(unvisitedCells);

    if (nextCell !== undefined) yield [currentCell, nextCell];

    currentCell.visited = true;

    if (nextCell) cells.push(nextCell);
    else cells.pop();
  }
}
