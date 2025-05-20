export function reconstructPath<T extends string>(
  startId: T,
  endId: T,
  cameFrom: Map<T, T>
) {
  const path = [];

  let currId = endId;

  while (currId !== startId) {
    path.push(currId);

    const maybeCurrId = cameFrom.get(currId);

    if (maybeCurrId) currId = maybeCurrId;
    else throw new Error("bad data in cameFrom");
  }

  path.push(startId);

  return path.reverse();
}
