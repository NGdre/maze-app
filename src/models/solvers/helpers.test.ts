import { isValidPath } from "./helpers";

describe(isValidPath.name, () => {
  const mazeCells = [
    { id: "0,0", neighbors: ["1,0"] },
    { id: "1,0", neighbors: ["0,0", "2,0", "1,1"] },
    { id: "1,1", neighbors: ["1,0", "1,2", "2,1"] },
    { id: "2,1", neighbors: ["1,1"] },
    { id: "2,2", neighbors: ["1,2"] },
  ];

  const start = "0,0";
  const end = "2,1";

  it("path starts and ends correctly", () => {
    const invalidStart = "2,0";
    const invalidEnd = "1,2";

    const path = ["1,0", "1,1"];

    expect(isValidPath(mazeCells, start, end, [start, ...path, end])).toBe(
      true
    );
    expect(
      isValidPath(mazeCells, start, end, [invalidStart, ...path, end])
    ).toBe(false);
    expect(
      isValidPath(mazeCells, start, end, [start, ...path, invalidEnd])
    ).toBe(false);
  });

  it("all cells are adjacent to next cells", () => {
    const path = [start, "1,1", end];

    expect(isValidPath(mazeCells, start, end, path)).toBe(false);
  });

  it("no revisit cells in perfect maze", () => {
    const path = [start, "1,0", "2,0", "1,0", "1,1", end];

    expect(isValidPath(mazeCells, start, end, path)).toBe(false);
  });
});
