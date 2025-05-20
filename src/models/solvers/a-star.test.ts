import fs from "fast-check";
import { recursiveBacktracking } from "../generators/recursive-backtracking";
import {
  createIdToCellMap,
  createRectMaze,
  fillCellsWithOpenNeighbors,
  generateRectMazeId,
  removeWallsBetweenCells,
} from "../maze";
import { isValidPath } from "./helpers";
import aStar from "./a-star";

describe("aStar", () => {
  it("works with rect maze and recursive backtracking", () => {
    const m = 25,
      n = 15;

    const edgeLength = 20;

    const maze = createRectMaze(m, n, edgeLength);
    const cells = maze.cells;

    const toRemove = [...recursiveBacktracking(m, n)].map((pair) => [
      pair[0].id,
      pair[1].id,
    ]);

    // @ts-ignore
    removeWallsBetweenCells(cells, toRemove);
    fillCellsWithOpenNeighbors(cells);
    const idToCellMap = createIdToCellMap(cells);

    fs.assert(
      fs.property(
        fs.nat(m - 1),
        fs.nat(n - 1),
        fs.nat(m - 1),
        fs.nat(n - 1),
        (s1, s2, e1, e2) => {
          const start = generateRectMazeId(s1, s2);
          const end = generateRectMazeId(e1, e2);

          const path = aStar(start, end, idToCellMap);

          if (path) expect(isValidPath(cells, start, end, path)).toBe(true);
        }
      )
    );
  });
});
