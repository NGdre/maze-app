import { render } from "@testing-library/react";
import { MazeCanvasLayer } from "./MazeCanvasLayer";
import { useMazeStore } from "@stores/maze-store";
import { CanvasLayer } from "@components/lib/CanvasLayer";
import { drawWalls } from "@models/maze-canvas-rendering";
import { WALLS_WIDTH } from "@constants";

jest.mock("@stores/maze-store");
jest.mock("@components/lib/CanvasLayers");
jest.mock("@models/maze-canvas-rendering");

describe("MazeCanvasLayer", () => {
  const mockSetIsMazeRendering = jest.fn();

  const mockInitMaze = jest.fn();

  let mockStore: {
    columnsAmount: number;
    mazeInstance: { cells: any } | null;
    setIsMazeRendering: jest.Mock;
    initMaze: jest.Mock;
  };

  beforeEach(() => {
    mockStore = {
      columnsAmount: 10,
      mazeInstance: { cells: [[{}]] },
      setIsMazeRendering: mockSetIsMazeRendering,
      initMaze: mockInitMaze,
    };

    (useMazeStore as unknown as jest.Mock).mockImplementation(
      (selector: (state: typeof mockStore) => any) => selector(mockStore)
    );

    (CanvasLayer as jest.Mock).mockImplementation(() => null);

    (drawWalls as jest.Mock).mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("renderMaze callback", () => {
    const getRenderCallback = () => {
      render(<MazeCanvasLayer />);
      return (CanvasLayer as jest.Mock).mock.calls[0][0].onRender;
    };

    it("does nothing when width is 0", () => {
      const onRender = getRenderCallback();

      const mockCtx = {
        reset: jest.fn(),
      } as unknown as CanvasRenderingContext2D;

      onRender(mockCtx, 0);

      expect(mockCtx.reset).not.toHaveBeenCalled();
      expect(mockInitMaze).not.toHaveBeenCalled();
      expect(drawWalls).not.toHaveBeenCalled();
    });

    it("initializes maze when cells are undefined", () => {
      mockStore.mazeInstance = null;

      const onRender = getRenderCallback();

      const mockCtx = {
        reset: jest.fn(),
      } as unknown as CanvasRenderingContext2D;

      onRender(mockCtx, 100);

      expect(mockInitMaze).toHaveBeenCalledWith(mockStore.columnsAmount); // 100 width / 10 columns
      expect(mockCtx.reset).not.toHaveBeenCalled();
      expect(drawWalls).not.toHaveBeenCalled();
      expect(mockSetIsMazeRendering).not.toHaveBeenCalled();
    });

    it("draws walls and updates state when cells exist", () => {
      const mockCells = [[{ walls: [true, false, true, false] }]];

      mockStore.mazeInstance = { cells: mockCells };

      const onRender = getRenderCallback();

      const mockCtx = {
        reset: jest.fn(),
      } as unknown as CanvasRenderingContext2D;

      onRender(mockCtx, 100);

      expect(mockCtx.reset).toHaveBeenCalled();
      expect(drawWalls).toHaveBeenCalledWith(mockCtx, mockCells, {
        lineWidth: WALLS_WIDTH,
      });
      expect(mockSetIsMazeRendering).toHaveBeenCalledWith(false);
      expect(mockInitMaze).not.toHaveBeenCalled();
    });
  });
});
