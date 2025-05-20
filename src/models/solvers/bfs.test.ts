import fs from "fast-check";
import { recursiveBacktracking } from "../generators/recursive-backtracking";
import {
  createIdToCellMap,
  createRectMaze,
  fillCellsWithOpenNeighbors,
  generateRectMazeId,
  removeWallsBetweenCells,
} from "../maze";
import bfs from "./breadth-first-search";
import { isValidPath } from "./helpers";
import { reconstructPath } from "./reconstruct-path";

describe(bfs.name, () => {
  it("works with rect maze and recursive backtracking", () => {
    const m = 15,
      n = 25;

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

          const path = bfs(start, end, idToCellMap);

          expect(isValidPath(cells, start, end, path)).toBe(true);
        }
      )
    );
  });

  it(`${reconstructPath.name} works correctly`, () => {
    const cameFrom = new Map();
    const start = generateRectMazeId(1, 1);
    const end = generateRectMazeId(3, 0);

    cameFrom.set(generateRectMazeId(2, 1), start);
    cameFrom.set(generateRectMazeId(2, 0), generateRectMazeId(2, 1));
    cameFrom.set(end, generateRectMazeId(2, 0));

    expect(reconstructPath(start, end, cameFrom)).toEqual([
      start,
      generateRectMazeId(2, 1),
      generateRectMazeId(2, 0),
      end,
    ]);
  });
});
