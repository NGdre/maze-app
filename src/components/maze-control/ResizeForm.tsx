import { useMazeStore } from "../../stores/maze-store";
import SelectNumber from "../lib/SelectNumber";
import { MIN_COLUMNS, MIN_ROWS, MAX_COLUMNS, MAX_ROWS } from "../../constants";

const ROWS_LABEL = "строки";
const COLUMN_LABEL = "столбцы";

const classNames = {
  resizeFormWrapper: "flex mt-5 space-x-6",
};

export function SelectRows() {
  const rowsAmount = useMazeStore((state) => state.rowsAmount);
  const updateRowsAmount = useMazeStore((state) => state.updateRowsAmount);

  return (
    <SelectNumber
      labelContent={ROWS_LABEL}
      value={rowsAmount}
      min={MIN_ROWS}
      max={MAX_ROWS}
      onSelect={updateRowsAmount}
    />
  );
}

export function SelectColumns() {
  const columnsAmount = useMazeStore((state) => state.columnsAmount);
  const updateColumnsAmount = useMazeStore(
    (state) => state.updateColumnsAmount
  );

  return (
    <SelectNumber
      labelContent={COLUMN_LABEL}
      value={columnsAmount}
      min={MIN_COLUMNS}
      max={MAX_COLUMNS}
      onSelect={updateColumnsAmount}
    />
  );
}

export default function ResizeForm() {
  return (
    <div className={classNames.resizeFormWrapper}>
      <SelectRows />
      <SelectColumns />
    </div>
  );
}
