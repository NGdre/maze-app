import { render } from "@testing-library/react";
import { CellMarksCanvasLayer } from "./CellMarksCanvasLayer";
import { useMazeStore } from "@stores/maze-store";
import { CanvasLayer } from "@components/lib/CanvasLayer";
import { createCellFinder } from "@models/maze";
import { fillPolygonWithCircle } from "@models/maze-canvas-rendering";
import { colors } from "@constants";

jest.mock("@stores/maze-store");
jest.mock("@components/lib/CanvasLayers");
jest.mock("@models/maze");
jest.mock("@models/maze-canvas-rendering");

describe("CellMarksCanvasLayer", () => {
  const mockFillPolygon = fillPolygonWithCircle as jest.Mock;
  const mockCreateCellFinder = createCellFinder as jest.Mock;

  let mockStore: {
    mazeInstance: { cells: any[] } | null;
    startId: string | null;
    endId: string | null;
  };

  beforeEach(() => {
    mockStore = {
      mazeInstance: { cells: [{}] },
      startId: "start-1",
      endId: "end-1",
    };

    (useMazeStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector(mockStore)
    );

    (CanvasLayer as jest.Mock).mockImplementation(() => null);

    mockCreateCellFinder.mockImplementation(
      () => (id: string) =>
        id === "start-1"
          ? { x: 0, y: 0 }
          : id === "end-1"
          ? { x: 1, y: 1 }
          : undefined
    );
  });

  afterEach(() => jest.clearAllMocks());

  describe("renderMaze callback", () => {
    const getRenderCallback = () => {
      render(<CellMarksCanvasLayer />);
      return (CanvasLayer as jest.Mock).mock.calls[0][0].onRender;
    };

    it("does nothing when missing required data", () => {
      const onRender = getRenderCallback();

      const mockCtx = {
        reset: jest.fn(),
      } as unknown as CanvasRenderingContext2D;

      // Test missing context
      onRender(null, 100);
      expect(mockCtx.reset).not.toHaveBeenCalled();

      // Test zero width
      onRender(mockCtx, 0);
      expect(mockCtx.reset).not.toHaveBeenCalled();

      // Test missing cells
      // mockStore.mazeInstance = null;
      // onRender(mockCtx, 100);
      // expect(mockCtx.reset).not.toHaveBeenCalled();

      // Test missing startId
      // mockStore.mazeInstance = { cells: [{}] };
      // mockStore.startId = null;
      // onRender(mockCtx, 100);
      // expect(mockCtx.reset).not.toHaveBeenCalled();

      // Test missing endId
      // mockStore.startId = "start-1";
      // mockStore.endId = null;
      // onRender(mockCtx, 100);
      // expect(mockCtx.reset).not.toHaveBeenCalled();
    });

    it("draws start/end cells when all data exists", () => {
      const onRender = getRenderCallback();

      const mockCtx = {
        reset: jest.fn(),
      } as unknown as CanvasRenderingContext2D;

      onRender(mockCtx, 100);

      expect(mockCtx.reset).toHaveBeenCalled();

      expect(mockCreateCellFinder).toHaveBeenCalledWith(
        mockStore.mazeInstance?.cells
      );

      expect(mockFillPolygon).toHaveBeenCalledTimes(2);

      expect(mockFillPolygon).toHaveBeenCalledWith(
        mockCtx,
        { x: 0, y: 0 },
        colors.START_CELL
      );

      expect(mockFillPolygon).toHaveBeenCalledWith(
        mockCtx,
        { x: 1, y: 1 },
        colors.END_CELL
      );
    });

    it("handles missing cells from cell finder", () => {
      mockCreateCellFinder.mockImplementation(() => () => undefined);

      const onRender = getRenderCallback();

      const mockCtx = {
        reset: jest.fn(),
      } as unknown as CanvasRenderingContext2D;

      onRender(mockCtx, 100);

      expect(mockCtx.reset).toHaveBeenCalled();

      expect(mockFillPolygon).not.toHaveBeenCalled();
    });
  });
});
