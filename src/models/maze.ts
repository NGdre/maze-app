import { MAX_COLUMNS, MAX_ROWS, MIN_COLUMNS, MIN_ROWS } from "../constants";
import { mean, flow, first } from "@utils";

import {
  validateArrayInRange,
  validateEqualNumbers,
  validateIntGreaterThanOrEqual,
  validateIntLessThanOrEqual,
  validateNotNullObject,
} from "../validation/utils";

const FRACTION_DIGITS = 2;

// может не должно быть возможности изменять координаты после создания точки?
export class Point2d {
  x: number;
  y: number;
  private fractionDigits: number = FRACTION_DIGITS || 0;

  constructor(x: number, y: number) {
    const { fractionDigits } = this;
    this.x = +x.toFixed(fractionDigits);
    this.y = +y.toFixed(fractionDigits);
  }

  static isSamePoint(first: Point2d, second: Point2d) {
    return first.x === second.x && first.y === second.y;
  }
}

export class Wall {
  private _start: Point2d;
  private _end: Point2d;
  private _visible: boolean = true;

  constructor(start: Point2d, end: Point2d) {
    this._start = start;
    this._end = end;
  }

  static isSameWall(first: Wall, second: Wall) {
    return (
      (Point2d.isSamePoint(first.start, second.start) &&
        Point2d.isSamePoint(first.end, second.end)) ||
      (Point2d.isSamePoint(first.start, second.end) &&
        Point2d.isSamePoint(first.end, second.start))
    );
  }

  set visible(value: boolean) {
    this._visible = value;
  }

  get visible() {
    return this._visible;
  }

  get start() {
    return this._start;
  }

  get end() {
    return this._end;
  }

  // not tested, bad naming and param
  toString(opposite = false) {
    const firstPoint = `${this._start.x} ${this._start.y}`;
    const secondPoint = `${this._end.x} ${this._end.y}`;

    return opposite
      ? secondPoint + " " + firstPoint
      : firstPoint + " " + secondPoint;
  }

  toStringOpposite() {
    return this.toString(true);
  }
}

// clockwise relative to canvas coordinates
export function getCirclePoint(
  r: number,
  theta: number,
  isDegrees = true,
  clockwise = false
) {
  if (clockwise) theta = -theta;
  if (isDegrees) {
    theta = (theta * Math.PI) / 180;
  }
  const x = r * Math.cos(theta);
  const y = r * Math.sin(theta);

  return { x, y };
}

export abstract class PolygonCell {
  protected _id: string;
  protected _walls: Array<Wall> = [];
  protected _edgeLength: number = 1;
  abstract numberOfWalls: number;
  abstract generateWalls(x: number, y: number): void;

  neighbors: Array<string> = [];

  constructor(id: string, edgeLength: number) {
    this._id = id;

    this.edgeLength = edgeLength;
  }

  get id() {
    return this._id;
  }

  get walls() {
    // without cloning now
    return this._walls;
  }

  get edgeLength() {
    return this._edgeLength;
  }

  get center() {
    const xValues = [];
    const yValues = [];

    for (let i = 0; i < this.numberOfWalls; i++) {
      xValues.push(this._walls[i].start.x);
      yValues.push(this._walls[i].start.y);
    }

    return new Point2d(mean(xValues), mean(yValues));
  }

  //not tested
  getPoints() {
    const points = [];

    for (let i = 0; i < this.numberOfWalls; i++) {
      points.push(this.walls[i].start);
    }

    return points;
  }

  set edgeLength(value) {
    if (value <= 0)
      throw new Error(`edgeLength must be positive, but recieved ${value}`);
    this._edgeLength = value;
  }

  protected nextVertice(vertice: Point2d, angle: number) {
    const { x, y } = getCirclePoint(this._edgeLength, angle, true);

    return new Point2d(x + vertice.x, y + vertice.y);
  }

  protected _generateWalls(start: Point2d, angle: number) {
    let prev = start;
    let next;
    let currAngle = 0;

    // the walls must be empty when regenerating
    this._walls.length = 0;

    // the first point already exists, so i = 1
    for (let i = 1; i < this.numberOfWalls; i++) {
      next = this.nextVertice(prev, currAngle);
      currAngle += angle;
      this._walls.push(new Wall(prev, next));
      prev = next;
    }

    this._walls.push(new Wall(next as Point2d, start));
  }
}

export class SquareCell extends PolygonCell {
  numberOfWalls = 4;

  constructor(id: string, edgeLength: number) {
    super(id, edgeLength);
  }

  generateWalls(x: number, y: number) {
    const start = new Point2d(x, y);
    this._generateWalls(start, 90);
  }
}

export class HexagonCell extends PolygonCell {
  numberOfWalls = 6;

  constructor(id: string, edgeLength: number) {
    super(id, edgeLength);
  }

  generateWalls(x: number, y: number, clockwise: boolean = true) {
    const rotationAngle = 60;
    const start = new Point2d(x, y);
    this._generateWalls(start, clockwise ? rotationAngle : -rotationAngle);
  }
}

type cellsIdPair = [firstCellId: string, secondCellId: string];

type RectMazeCells = Array<SquareCell>;

type MazeCells = PolygonCell[];

type cellId = string;

export function generateRectMazeId(i: number, j: number): cellId {
  return i + "," + j;
}

export type RectMaze = {
  cells: RectMazeCells;
  rows: number;
  cols: number;
  cellSize: number;
};

const validationRules = {
  rows: {
    min: MIN_ROWS,
    max: MAX_ROWS,
  },

  cols: {
    min: MIN_ROWS,
    max: MAX_ROWS,
  },
};

export const createRectMaze = (
  rows: RectMaze["rows"],
  cols: RectMaze["cols"],
  cellSize: RectMaze["cellSize"]
): RectMaze => {
  validateIntGreaterThanOrEqual(rows, MIN_ROWS);
  validateIntGreaterThanOrEqual(cols, MIN_COLUMNS);
  validateIntLessThanOrEqual(rows, MAX_ROWS);
  validateIntLessThanOrEqual(cols, MAX_COLUMNS);

  const cells: RectMazeCells = [];

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const id = generateRectMazeId(i, j);
      const cell = new SquareCell(id, cellSize);

      const x = j * cellSize;
      const y = i * cellSize;

      cell.generateWalls(x, y);

      cells.push(cell);
    }
  }

  return {
    rows,
    cols,
    cellSize,
    cells,
  };
};

export type idToCellMap = Map<cellId, PolygonCell>;

export const createIdToCellMap = (cells: MazeCells): idToCellMap => {
  const map: idToCellMap = new Map();
  const len = cells.length;

  for (let i = 0; i < len; i++) {
    map.set(cells[i].id, cells[i]);
  }

  return map;
};

export function findCell(map: idToCellMap) {
  return function (cellId: cellId) {
    const found = map.get(cellId);

    return found !== undefined ? found : null;
  };
}

export const createCellFinder = flow(createIdToCellMap, findCell);

export function removeWallBetweenCells(
  firstCell: PolygonCell,
  secondCell: PolygonCell
) {
  const firstWalls = firstCell.walls;
  const secondWalls = secondCell.walls;

  const numberOfWalls = firstWalls.length;

  validateEqualNumbers(numberOfWalls, secondWalls.length);

  for (let i = 0; i < numberOfWalls; i++) {
    for (let j = 0; j < numberOfWalls; j++) {
      if (Wall.isSameWall(firstWalls[i], secondWalls[j])) {
        firstWalls[i].visible = false;
        secondWalls[j].visible = false;
        break;
      }
    }
  }
}

export function removeWallsBetweenCells(
  cells: MazeCells,
  pairs: Array<cellsIdPair>
) {
  const pairsLength = pairs.length;

  const findCell = createCellFinder(cells);

  for (let i = 0; i < pairsLength; i++) {
    const fid = pairs[i][0];
    const sid = pairs[i][1];
    const fcell = findCell(fid);
    const scell = findCell(sid);

    validateNotNullObject(fcell, {
      label: `invalid pairs to remove: cell with id ${fid} is not found`,
    });

    validateNotNullObject(scell, {
      label: `invalid pairs to remove: cell with id ${sid} is not found`,
    });

    removeWallBetweenCells(fcell, scell);
  }
}

type wallToCellId = Map<string, cellId[]>;

export const createWallToOpenNeighborsMap = (
  cells: MazeCells
): wallToCellId => {
  const cellsLength = cells.length;

  const wallToCellId: wallToCellId = new Map();

  if (!cells.length) return wallToCellId;

  const wallsAmount = cells[0].numberOfWalls;

  for (let i = 0; i < cellsLength; i++) {
    const currCell = cells[i];

    for (let j = 0; j < wallsAmount; j++) {
      if (currCell.walls[j].visible) continue;

      const wallKey = currCell.walls[j].toString();
      const oppositeWallKey = currCell.walls[j].toStringOpposite();

      if (wallToCellId.has(oppositeWallKey)) {
        wallToCellId.get(oppositeWallKey)!.push(currCell.id);
      } else {
        wallToCellId.set(wallKey, [currCell.id]);
      }
    }
  }

  return wallToCellId;
};

export function fillCellsWithOpenNeighbors<T extends MazeCells>(cells: T) {
  const cellsLength = cells.length;
  const map = createWallToOpenNeighborsMap(cells);

  // можно улучшить алгоритм
  for (let i = 0; i < cellsLength; i++) {
    const currCell = cells[i];

    currCell.neighbors.length = 0;

    currCell.walls.forEach((wall) => {
      if (wall.visible) return;

      const wallKey = wall.toString();
      const oppositeWallKey = wall.toStringOpposite();

      const ids = map.get(wallKey) || map.get(oppositeWallKey);

      // there's only can be one or two neihbors cells for each wall
      validateArrayInRange(ids, 1, 2);

      const neighborId = ids.find((id: string) => id !== currCell.id);

      if (neighborId) {
        currCell.neighbors.push(neighborId);
      }
    });
  }
}
