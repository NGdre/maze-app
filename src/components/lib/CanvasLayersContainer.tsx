import { ReactNode, useRef, useState, useEffect, createContext } from "react";

const CanvasContainerStyles = {
  width: "80vw",
  height: "60vh",
  border: "1px solid #ccc",
  margin: "20px auto",
  overflow: "hidden",
};

export type CanvasContextType = {
  containerWidth: number;
  containerHeight: number;
  targetAspect: number;
};

const canvasContextDefault = {
  containerWidth: 0,
  containerHeight: 0,
  targetAspect: 16 / 9,
};

export const CanvasContext =
  createContext<CanvasContextType>(canvasContextDefault);

export const CanvasLayersContainer = ({
  targetAspect,
  children,
}: {
  targetAspect?: number;
  children: ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [containerSize, setContainerSize] =
    useState<CanvasContextType>(canvasContextDefault);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateSize = () => {
      setContainerSize({
        containerWidth: container.offsetWidth,
        containerHeight: container.offsetHeight,
        targetAspect: targetAspect || containerSize.targetAspect,
      });
    };

    const ro = new ResizeObserver(updateSize);
    ro.observe(container);
    updateSize();
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        ...CanvasContainerStyles,
      }}
    >
      <CanvasContext.Provider value={containerSize}>
        {children}
      </CanvasContext.Provider>
    </div>
  );
};
