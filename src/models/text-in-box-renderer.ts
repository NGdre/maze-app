type Position =
  | "top-left"
  | "top"
  | "top-right"
  | "left"
  | "center"
  | "right"
  | "bottom-left"
  | "bottom"
  | "bottom-right";

interface TextElement {
  content: string;
  fontSize: number;
  fontFamily?: string;
  position: Position;
  padding?:
    | number
    | { top?: number; right?: number; bottom?: number; left?: number };
  color?: string;
  offsetX?: number;
  offsetY?: number;
  fontWeight?: string;
  fontStyle?: string;
}

export interface BoxConfig {
  x: number;
  y: number;
  size: number;
  texts: TextElement[];
}

interface TextMetrics {
  width: number;
  ascent: number;
  descent: number;
  height: number;
}

interface NormalizedPadding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export class TextInBoxRenderer {
  private boxes: BoxConfig[] = [];
  private textMetricsCache: Map<string, TextMetrics> = new Map();
  private ctx: CanvasRenderingContext2D;

  constructor(context: CanvasRenderingContext2D) {
    this.ctx = context;
  }

  addBox(square: BoxConfig): void {
    this.boxes.push(square);
  }

  addBoxes(squares: BoxConfig[]): void {
    this.boxes.push(...squares);
  }

  clearBoxes(): void {
    this.boxes = [];
    this.textMetricsCache.clear();
  }

  render(): void {
    this.drawBoxes();
  }

  private getTextMetrics(text: TextElement): TextMetrics {
    const fontKey = this.getFontKey(text);
    const cacheKey = `${text.content}|${fontKey}`;

    if (this.textMetricsCache.has(cacheKey)) {
      return this.textMetricsCache.get(cacheKey)!;
    }

    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) return { width: 0, ascent: 0, descent: 0, height: 0 };

    // Устанавливаем точный шрифт
    tempCtx.font = this.getFontString(text);
    const metrics = tempCtx.measureText(text.content);

    // Получаем точные метрики
    const ascent =
      metrics.actualBoundingBoxAscent ||
      metrics.fontBoundingBoxAscent ||
      text.fontSize * 0.8; // Fallback

    const descent =
      metrics.actualBoundingBoxDescent ||
      metrics.fontBoundingBoxDescent ||
      text.fontSize * 0.2; // Fallback

    const width = metrics.width;
    const height = ascent + descent;

    const result: TextMetrics = { width, ascent, descent, height };
    this.textMetricsCache.set(cacheKey, result);
    return result;
  }

  private getFontString(text: TextElement): string {
    return `${text.fontStyle || "normal"} ${text.fontWeight || "normal"} ${
      text.fontSize
    }px ${text.fontFamily || "sans-serif"}`;
  }

  private getFontKey(text: TextElement): string {
    return `${text.fontStyle || "normal"}|${text.fontWeight || "normal"}|${
      text.fontSize
    }|${text.fontFamily || "sans-serif"}`;
  }

  private normalizePadding(
    padding?:
      | number
      | { top?: number; right?: number; bottom?: number; left?: number }
  ): NormalizedPadding {
    if (typeof padding === "number") {
      return {
        top: padding,
        right: padding,
        bottom: padding,
        left: padding,
      };
    }

    return {
      top: padding?.top || 0,
      right: padding?.right || 0,
      bottom: padding?.bottom || 0,
      left: padding?.left || 0,
    };
  }

  // private drawBoxes(): void {
  //   this.boxes.forEach((box) => {
  //     if (box.size <= 0) return;

  //     this.ctx.save();

  //     // Включаем субпиксельное сглаживание для лучшей чёткости
  //     this.ctx.imageSmoothingEnabled = true;
  //     (this.ctx as any).webkitImageSmoothingEnabled = true;
  //     (this.ctx as any).mozImageSmoothingEnabled = true;

  //     // Устанавливаем высокое качество сглаживания
  //     this.ctx.textRendering = "geometricPrecision";
  //     this.ctx.imageSmoothingQuality = "high";

  //     box.texts.forEach((text) => {
  //       if (text.fontSize <= 0) return;

  //       // Округляем координаты до целых пикселей для чёткости
  //       const roundedX = Math.round(box.x);
  //       const roundedY = Math.round(box.y);
  //       const roundedSize = Math.round(box.size);

  //       this.ctx.font = this.getFontString(text);
  //       this.ctx.fillStyle = text.color || "#000";
  //       this.ctx.textBaseline = "alphabetic";

  //       const metrics = this.getTextMetrics(text);
  //       const padding = this.normalizePadding(text.padding);

  //       // Рассчитываем позицию X с округлением
  //       let x = roundedX;
  //       if (text.position.includes("left")) {
  //         x += Math.round(padding.left);
  //       } else if (text.position.includes("right")) {
  //         x +=
  //           roundedSize - Math.round(metrics.width) - Math.round(padding.right);
  //       } else {
  //         x += Math.round((roundedSize - metrics.width) / 2);
  //       }

  //       // Рассчитываем позицию Y с округлением
  //       let y = roundedY;
  //       if (text.position.includes("top")) {
  //         y += Math.round(padding.top + metrics.ascent);
  //       } else if (text.position.includes("bottom")) {
  //         y +=
  //           roundedSize -
  //           Math.round(padding.bottom) -
  //           Math.round(metrics.descent);
  //       } else {
  //         y += Math.round((roundedSize + metrics.ascent - metrics.descent) / 2);
  //       }

  //       // Применяем смещения с округлением
  //       if (text.offsetX) x += Math.round(text.offsetX);
  //       if (text.offsetY) y += Math.round(text.offsetY);

  //       // Окончательное округление координат
  //       x = Math.round(x);
  //       y = Math.round(y);

  //       // Рисуем текст
  //       this.ctx.fillText(text.content, x, y);
  //     });

  //     this.ctx.restore();
  //   });
  // }

  private drawBoxes(): void {
    this.boxes.forEach((box) => {
      if (box.size <= 0) return;

      this.ctx.save();

      box.texts.forEach((text) => {
        if (text.fontSize <= 0) return;

        this.ctx.font = this.getFontString(text);
        this.ctx.fillStyle = text.color || "#000";
        this.ctx.textBaseline = "alphabetic";

        const metrics = this.getTextMetrics(text);
        const padding = this.normalizePadding(text.padding);

        // Рассчитываем позицию X
        let x = box.x;
        if (text.position.includes("left")) {
          x += padding.left;
        } else if (text.position.includes("right")) {
          x += box.size - metrics.width - padding.right;
        } else {
          // center
          x += (box.size - metrics.width) / 2;
        }

        // Рассчитываем позицию Y
        let y = box.y;
        if (text.position.includes("top")) {
          y += padding.top + metrics.ascent;
        } else if (text.position.includes("bottom")) {
          y += box.size - padding.bottom - metrics.descent;
        } else {
          // center
          y += (box.size + metrics.ascent - metrics.descent) / 2;
        }

        // Применяем смещения
        if (text.offsetX) x += text.offsetX;
        if (text.offsetY) y += text.offsetY;

        // Рисуем текст
        this.ctx.fillText(text.content, x, y);
      });

      this.ctx.restore();
    });
  }
}
