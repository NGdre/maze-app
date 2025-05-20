import ow, { BasePredicate } from "ow";

function runWithOrWithoutLabel(
  value: unknown,
  label: string | undefined,
  predicate: BasePredicate<unknown>
) {
  if (label) ow(value, label, predicate);

  ow(value, predicate);
}

export const validatePositiveInt = ow.create(ow.number.integer.greaterThan(0));

export const validateNonNegativeInt = ow.create(
  ow.number.integer.greaterThanOrEqual(0)
);

export function validateIntGreaterThan(value: number, threshold: number) {
  ow(value, ow.number.integer.greaterThan(threshold));
}

export function validateIntLessThan(value: number, threshold: number) {
  ow(value, ow.number.integer.lessThan(threshold));
}

export function validateIntGreaterThanOrEqual(
  value: number,
  threshold: number
) {
  ow(value, ow.number.integer.greaterThanOrEqual(threshold));
}

export function validateIntLessThanOrEqual(value: number, threshold: number) {
  ow(value, ow.number.integer.lessThanOrEqual(threshold));
}

export function validateArrayInRange<T>(
  value: unknown,
  min: number,
  max: number,
  opts: {
    label?: string;
  } = {}
): asserts value is Array<T> {
  const { label } = opts;
  const predicate = ow.array.minLength(min).maxLength(max);

  runWithOrWithoutLabel(value, label, predicate);
}

export function validateNotNullObject<T>(
  value: T,
  opts: {
    label?: string;
  } = {}
): asserts value is Exclude<T, null> {
  const { label } = opts;
  const predicate = ow.object.is((val) => val !== null);

  runWithOrWithoutLabel(value, label, predicate);
}

export function validateEqualNumbers(
  firstNumber: number,
  secondNumber: number,
  opts: {
    label?: string;
  } = {}
): asserts firstNumber is number {
  const { label } = opts;
  const predicate = ow.number.equal(secondNumber);

  runWithOrWithoutLabel(firstNumber, label, predicate);
}
