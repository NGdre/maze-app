import { BoxConfig } from "@models/text-in-box-renderer";
import { AStarText } from "@solvers/a-star";

type CellConfig = {
  colors: {
    background: string;
    line?: string;
  };
  text?: Record<string, string>;
};

export type VisualSchema = Record<string, CellConfig>;

const baseVisualSchema: VisualSchema = {
  enqueued: {
    colors: {
      background: "#023047",
    },
  },
  visited: {
    colors: {
      background: "#b0c4b1",
    },
  },
  foundPath: {
    colors: {
      line: "#ffb703",
      background: "grey",
    },
  },
} as const;

export const bfsVisualSchema: VisualSchema = {
  ...baseVisualSchema,
} as const;

export const aStarVisualSchema: VisualSchema = {
  ...baseVisualSchema,
} as const;

export const buildTextInCellConfig = (
  initialBoxConfig: Pick<BoxConfig, "x" | "y" | "size">,
  text: AStarText
) => {
  // These constants were obtained experimentally.
  const p = 15;
  const fs1 = 3;
  const fs2 = 2;

  const mainPadding = initialBoxConfig.size / p;
  const fontForNumbers = "Barlow Condensed";
  const fontWeight = "200";
  const hColor = "#2e8b57";
  const gColor = "#2e8b57";
  const fColor = "#191970";

  const box: BoxConfig = { ...initialBoxConfig, texts: [] };

  const textBaseStyle = {
    fontSize: box.size / fs1,
    fontFamily: fontForNumbers,
    fontWeight,
    padding: mainPadding,
  };

  box.texts = [
    {
      ...textBaseStyle,
      content: text["g-value"],
      position: "top-left",
      color: gColor,
    },
    {
      ...textBaseStyle,
      content: text["h-value"],
      position: "top-right",
      color: hColor,
    },
    {
      ...textBaseStyle,
      content: text["f-value"],
      fontSize: box.size / fs2,
      position: "bottom",
      color: fColor,
      padding: mainPadding,
    },
  ];

  return box;
};
