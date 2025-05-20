import { kruskal } from "./kruskal";

describe(kruskal.name, () => {
  it("should generate walls that will be removed", () => {
    const m = 10;
    const n = 20;

    const sampleGenerator = function* () {};

    expect(kruskal.constructor).toEqual(sampleGenerator.constructor);

    const walls = [...kruskal(m, n)];

    expect(walls[0]).toHaveLength(2);
    expect(walls[0][0]).toMatchObject({ id: expect.stringMatching(/\d,\d/) });
  });
});
