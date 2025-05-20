import { render } from "@testing-library/react";
import { MazePathCanvasLayer } from "./MazePathCanvasLayer";
import { CanvasLayer } from "@components/lib/CanvasLayer";
import { PATH_WIDTH, colors } from "@constants";
import { drawPath } from "@models/maze-canvas-rendering";
import { useMazeStore } from "@stores/maze-store";

jest.mock("@components/lib/CanvasLayers");
jest.mock("@models/maze-canvas-rendering");
jest.mock("@stores/maze-store");

describe("MazePathCanvasLayer", () => {
  let mockStore: {
    mazeSolution: any[];
    setIsMazeRendering: jest.Mock;
  };

  const mockSetIsMazeRendering = jest.fn();

  beforeEach(() => {
    mockStore = {
      mazeSolution: [],
      setIsMazeRendering: mockSetIsMazeRendering,
    };

    (useMazeStore as unknown as jest.Mock).mockImplementation(
      (selector: (state: typeof mockStore) => any) => selector(mockStore)
    );

    (CanvasLayer as jest.Mock).mockImplementation(() => null);
    (drawPath as jest.Mock).mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("when onRender is called", () => {
    it("does nothing if path is empty", () => {
      render(<MazePathCanvasLayer />);

      const { onRender } = (CanvasLayer as jest.Mock).mock.calls[0][0];

      const mockCtx = {
        reset: jest.fn(),
      } as unknown as CanvasRenderingContext2D;

      onRender(mockCtx, 100);

      expect(mockCtx.reset).not.toHaveBeenCalled();
      expect(drawPath).not.toHaveBeenCalled();
      expect(mockSetIsMazeRendering).not.toHaveBeenCalled();
    });

    it("does nothing if width is 0", () => {
      mockStore.mazeSolution = [{ x: 0, y: 0 }];

      render(<MazePathCanvasLayer />);

      const { onRender } = (CanvasLayer as jest.Mock).mock.calls[0][0];

      const mockCtx = {
        reset: jest.fn(),
      } as unknown as CanvasRenderingContext2D;

      onRender(mockCtx, 0);

      expect(mockCtx.reset).not.toHaveBeenCalled();
      expect(drawPath).not.toHaveBeenCalled();
      expect(mockSetIsMazeRendering).not.toHaveBeenCalled();
    });

    it("draws path and updates store when path is present and width > 0", () => {
      const mockPath = [
        { x: 0, y: 0 },
        { x: 1, y: 1 },
      ];

      mockStore.mazeSolution = mockPath;

      render(<MazePathCanvasLayer />);

      const { onRender } = (CanvasLayer as jest.Mock).mock.calls[0][0];

      const mockCtx = {
        reset: jest.fn(),
      } as unknown as CanvasRenderingContext2D;

      onRender(mockCtx, 100);

      expect(mockCtx.reset).toHaveBeenCalled();
      expect(drawPath).toHaveBeenCalledWith(mockCtx, mockPath, {
        lineWidth: PATH_WIDTH,
        pathColor: colors.PATH_COLOR,
      });
      expect(mockSetIsMazeRendering).toHaveBeenCalledWith(false);
    });
  });
});
