import CellHistory, { CellPatch } from "./CellHistory";

describe("CellHistory", () => {
  let history: CellHistory;

  beforeEach(() => {
    history = new CellHistory();
  });

  // Helper function to get cell safely
  const getCell = (id: string) => {
    return history.getState().get(id);
  };

  describe("Initialization", () => {
    it("should initialize with empty state", () => {
      expect(history.getState().size).toBe(0);
      expect(history.historyIndex).toBe(-1);
      expect(history.isEmpty()).toBe(true);
      expect(history.canUndo()).toBe(false);
      expect(history.canRedo()).toBe(false);
    });
  });

  describe("applyStep", () => {
    it("should add new cell", () => {
      const patch: CellPatch = { id: "1", name: "Cell 1" };
      history.applyStep([patch]);

      expect(getCell("1")).toEqual({ id: "1", name: "Cell 1" });
      expect(history.historyIndex).toBe(0);
      expect(history.canUndo()).toBe(true);
    });

    it("should update existing cell", () => {
      history.applyStep([{ id: "1", name: "Cell 1" }]);
      history.applyStep([{ id: "1", name: "Updated Cell 1", value: 10 }]);

      const cell = getCell("1");
      expect(cell).toEqual({
        id: "1",
        name: "Updated Cell 1",
        value: 10,
      });
    });

    it("should delete property with undefined", () => {
      history.applyStep([{ id: "1", name: "Cell 1", value: 10 }]);
      history.applyStep([{ id: "1", value: undefined }]);

      const cell = getCell("1");
      expect(cell).toEqual({ id: "1", name: "Cell 1" });
    });

    it("should merge nested objects", () => {
      history.applyStep([{ id: "1", data: { a: 1 } }]);
      history.applyStep([{ id: "1", data: { b: 2 } }]);

      const cell = getCell("1");
      expect(cell).toEqual({
        id: "1",
        data: { a: 1, b: 2 },
      });
    });

    it("should completely delete cell with $deleted", () => {
      history.applyStep([{ id: "1", name: "Cell 1" }]);
      history.applyStep([{ id: "1", $deleted: true }]);

      expect(history.getState().has("1")).toBe(false);
    });

    it("should handle multiple cells in one step", () => {
      history.applyStep([
        { id: "1", name: "Cell 1" },
        { id: "2", name: "Cell 2" },
      ]);

      const state = history.getState();
      expect(state.size).toBe(2);
      expect(getCell("1")?.name).toBe("Cell 1");
      expect(getCell("2")?.name).toBe("Cell 2");
    });

    it("should override previous changes in same step", () => {
      history.applyStep([
        { id: "1", name: "First" },
        { id: "1", name: "Second" },
      ]);

      expect(getCell("1")?.name).toBe("Second");
    });
  });

  describe("applyMultipleSteps", () => {
    it("should flatten and apply multiple steps", () => {
      history.applyMultipleSteps([
        [{ id: "1", name: "Cell 1" }],
        [{ id: "2", name: "Cell 2" }],
      ]);

      expect(history.getState().size).toBe(2);
      expect(history.historyIndex).toBe(0);
    });
  });

  describe("undo/redo", () => {
    it("should undo single step", () => {
      history.applyStep([{ id: "1", name: "Cell 1" }]);
      history.undo();

      expect(history.getState().size).toBe(0);
      expect(history.historyIndex).toBe(-1);
      expect(history.canUndo()).toBe(false);
      expect(history.canRedo()).toBe(true);
    });

    it("should redo undone step", () => {
      history.applyStep([{ id: "1", name: "Cell 1" }]);
      history.undo();
      history.redo();

      expect(getCell("1")).toEqual({ id: "1", name: "Cell 1" });
      expect(history.historyIndex).toBe(0);
    });

    it("should handle complex undo/redo", () => {
      history.applyStep([{ id: "1", name: "Cell 1" }]);
      history.applyStep([{ id: "1", value: 10 }]);

      history.undo();
      expect(getCell("1")).toEqual({ id: "1", name: "Cell 1" });

      history.undo();
      expect(history.getState().size).toBe(0);

      history.redo();
      expect(getCell("1")).toEqual({ id: "1", name: "Cell 1" });

      history.redo();
      expect(getCell("1")).toEqual({
        id: "1",
        name: "Cell 1",
        value: 10,
      });
    });

    it("check backward patch for complex state", () => {
      history.applyStep([
        {
          color: "#b0c4b1",
          id: "0,0",
          isPathFound: false,
        },
      ]);

      history.applyStep([
        {
          color: "grey",
          id: "0,0",
          isPathFound: true,
          lineColor: "#ffb703",
          prevCellId: "0,1",
        },
      ]);

      expect(history.historyCurrentStep.backward).toEqual([
        {
          id: "0,0",
          color: "#b0c4b1",
          isPathFound: false,
        },
      ]);
    });

    it("should clear redo stack on new action", () => {
      history.applyStep([{ id: "1", name: "Cell 1" }]);
      history.undo();
      history.applyStep([{ id: "2", name: "Cell 2" }]);

      expect(history.canRedo()).toBe(false);
      expect(history.historyIndex).toBe(0);
      expect(history.getState().size).toBe(1);
    });
  });

  describe("edge cases", () => {
    it("should ignore undo/redo when impossible", () => {
      history.undo();
      history.redo();
      expect(history.getState().size).toBe(0);
    });

    it("should handle deleting non-existent cell", () => {
      history.applyStep([{ id: "1", $deleted: true }]);
      expect(history.getState().size).toBe(0);
    });

    it("should generate correct backward patch for new cell", () => {
      history.applyStep([{ id: "1", name: "Cell 1" }]);
      const step = history.historyCurrentStep;

      expect(step?.backward[0]).toEqual({
        id: "1",
        $deleted: true,
      });
      expect(step?.forward[0]).toEqual({
        id: "1",
        name: "Cell 1",
      });
    });

    it("should return immutable state", () => {
      history.applyStep([{ id: "1", name: "Cell 1" }]);
      const state = history.getState();

      // Try to modify the state
      const cell = state.get("1");
      if (cell) {
        // Create modified clone without affecting original
        const modifiedCell = { ...cell, name: "Modified" };
        state.set("1", modifiedCell);
      }

      // Internal state should remain unchanged
      expect(history.getState().get("1")?.name).toBe("Cell 1");
    });
  });

  describe("clear", () => {
    it("should reset all state", () => {
      history.applyStep([{ id: "1", name: "Cell 1" }]);
      history.clear();

      expect(history.getState().size).toBe(0);
      expect(history.historyIndex).toBe(-1);
      expect(history.isEmpty()).toBe(true);
    });
  });
});
