export function* reconstructPathSerial<T extends string>(
  startId: T,
  endId: T,
  cameFrom: Map<T, T>
) {
  let currId = endId;

  while (currId !== startId) {
    yield currId;

    const maybeCurrId = cameFrom.get(currId);

    if (maybeCurrId) currId = maybeCurrId;
    else throw new Error("bad data in cameFrom");
  }

  yield startId;
}

export function reconstructPath<T extends string>(
  startId: T,
  endId: T,
  cameFrom: Map<T, T>
) {
  return [...reconstructPathSerial(startId, endId, cameFrom)].reverse();
}
