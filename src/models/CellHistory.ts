type TextContent = Record<string, number> | null;
type PartialTextContent = Record<string, number | null> | null;

interface TrackableCellChangeBackward {
  id: string;
  color: string | null;
  text?: TextContent;
}

interface TrackableCellChangeForward {
  id: string;
  color?: string | null;
  text?: PartialTextContent;
}

export type TrackableCellChange =
  | TrackableCellChangeForward
  | TrackableCellChangeBackward;

interface HistoryStep {
  forward: TrackableCellChangeForward[];
  backward: TrackableCellChangeBackward[];
}

export default class CellHistory {
  private currentState: Map<string, TrackableCellChangeBackward>;
  private _history: HistoryStep[];
  private currIndex: number;

  constructor() {
    this.currentState = new Map();
    this._history = [];
    this.currIndex = -1;
  }

  get historyIndex() {
    return this.currIndex;
  }

  get historyCurrentStep() {
    return this._history[this.historyIndex]; // как сделать иммутабельным?
  }

  canUndo() {
    return this.currIndex >= 0;
  }

  canRedo() {
    return this.currIndex < this._history.length - 1;
  }

  isEmpty() {
    return this._history.length === 0;
  }

  private applyCellChange(change: TrackableCellChangeForward): void {
    const { id, color, text } = change;
    let currentCell = this.currentState.get(id);

    if (color === null) {
      this.currentState.delete(id);
      return;
    }

    if (color !== undefined && color !== null) {
      if (!currentCell) {
        currentCell = { id, color, text: undefined };
        this.currentState.set(id, currentCell);
      } else {
        currentCell = { ...currentCell, color };
        this.currentState.set(id, currentCell);
      }
    }

    if (currentCell) {
      let newText = currentCell.text ? { ...currentCell.text } : undefined;

      if (text !== undefined) {
        if (text === null) {
          newText = undefined;
        } else {
          if (!newText) newText = {};

          for (const [key, value] of Object.entries(text)) {
            if (value === null) {
              if (newText && newText.hasOwnProperty(key)) {
                delete newText[key];
              }
            } else {
              newText[key] = value;
            }
          }

          if (newText && Object.keys(newText).length === 0) {
            newText = undefined;
          }
        }
      }

      if (newText !== currentCell.text) {
        this.currentState.set(id, { ...currentCell, text: newText });
      }
    }
  }

  applyStep(steps: TrackableCellChangeForward[]): void {
    if (!steps) return;
    // преобразуем в Map, чтобы учитывать только последние изменения,
    // если есть несколько изменений для одной клетки
    const changesMap = new Map<string, TrackableCellChangeForward>();

    steps.forEach((step) => {
      const existing = changesMap.get(step.id) || { id: step.id };

      if (step.color !== undefined) {
        existing.color = step.color;
      }

      if (step.text !== undefined) {
        if (!existing.text) existing.text = {};
        existing.text = { ...existing.text, ...step.text };
      }

      changesMap.set(step.id, existing);
    });

    const backwardStep: TrackableCellChangeBackward[] = [];
    const forwardStep: TrackableCellChangeForward[] = [];

    changesMap.forEach((change, id) => {
      const currentCell = this.currentState.get(id);
      backwardStep.push(currentCell ? { ...currentCell } : { id, color: null });

      forwardStep.push(change);

      this.applyCellChange(change);
    });

    // нужно чтобы начать новую ветку изменений после нескольких undo
    this._history = this._history.slice(0, this.currIndex + 1);
    this.currIndex++;
    this._history[this.currIndex] = {
      forward: forwardStep,
      backward: backwardStep,
    };
  }

  applyMultipleSteps(arrayOfsteps: TrackableCellChangeForward[][]): void {
    const flattened = arrayOfsteps.flat();

    this.applyStep(flattened);
  }

  undo(): void {
    if (this.currIndex < 0) return;

    const step = this._history[this.currIndex].backward;

    for (const cell of step) {
      if (cell.color === null) {
        this.currentState.delete(cell.id);
      } else {
        this.currentState.set(cell.id, { ...cell });
      }
    }

    this.currIndex--;
  }

  redo(): void {
    if (this.currIndex >= this._history.length - 1) return;

    this.currIndex++;
    const step = this._history[this.currIndex].forward;

    for (const change of step) {
      this.applyCellChange(change);
    }
  }

  getState(): Map<string, TrackableCellChangeBackward> {
    return new Map(this.currentState); //оборачиваем в Map для защиты от возможных внешних изменений
  }

  clear() {
    this._history = [];
    this.currIndex = -1;
    this.currentState.clear();
  }
}
