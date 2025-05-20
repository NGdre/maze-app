import fc from "fast-check";

import { recursiveBacktracking } from "./recursive-backtracking";

describe(recursiveBacktracking.name, () => {
  it("is generator", () => {
    const sampleGenerator = function* () {};

    expect(recursiveBacktracking.constructor).toEqual(
      sampleGenerator.constructor
    );
  });

  it("should generate cell pairs for walls that will be removed", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2, max: 15 }),
        fc.integer({ min: 2, max: 15 }),
        (m, n) => {
          const pairs = [...recursiveBacktracking(m, n)];

          const firstPairToRemove = pairs[0];

          expect(firstPairToRemove).toHaveLength(2);
          expect(firstPairToRemove[0]).toMatchObject({
            id: expect.stringMatching(/\d,\d/),
          });
        }
      )
    );
  });
});
