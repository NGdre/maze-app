export {
  sample,
  cloneDeep,
  clamp,
  random,
  mean,
  first,
  throttle,
  noop,
} from "lodash";
export { flow } from "lodash/fp";

export function loopPairs<T>(pairs: Array<T>, cb: (prev: T, curr: T) => void) {
  let prev = pairs[0];
  const len = pairs.length;

  for (let i = 1; i < len; i++) {
    const curr = pairs[i];

    cb(prev, curr);

    prev = curr;
  }
}
