import { MPMask } from "@mediapipe/tasks-vision";

interface DrawSegmentationOptions {
  mask?: MPMask;
  canvas?: HTMLCanvasElement;
  backgroundImage?: HTMLVideoElement | HTMLImageElement;
  fillStyle?: string;
}

/**
 * Draw segmentation result with enhancements.
 */
export function drawSegmentation(options: DrawSegmentationOptions): HTMLCanvasElement {
  const {
    mask,
    canvas,
    backgroundImage,
    fillStyle = "rgba(255, 255, 255, 1.0)"
  } = options;

  if (!canvas) {
    throw new Error("drawSegmentation failed: cannot access the canvas");
  }

  const width = mask?.width || 0;
  const height = mask?.height || 0;

  canvas.width = width || canvas.width;
  canvas.height = height || canvas.height;

  console.log("drawSegmentation: drawing..")

  const ctx = canvas.getContext("2d")
  if (!ctx) {
    throw new Error("drawSegmentation failed: cannot access the 2D context")
  }

  ctx.fillStyle = "#00000000"; // Maintain transparent background if no image provided
  ctx.fillRect(0, 0, width, height);

  // Draw the background image if provided, otherwise default to transparent background.
  if (backgroundImage) {
    ctx.drawImage(backgroundImage, 0, 0, width, height);
  }

  if (mask) {
  
    ctx.fillStyle = fillStyle;
    const maskData = mask.getAsFloat32Array();

    maskData.forEach((category: number, index: number) => {
      if (Math.round(category * 255.0) === 0) {
        const x = index % width;
        const y = Math.floor(index / width);
        ctx.fillRect(x, y, 1, 1);
      }
    });
  }

  return canvas;
}