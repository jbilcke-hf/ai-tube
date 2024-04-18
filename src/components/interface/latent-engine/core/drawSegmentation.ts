import { MPMask } from "@mediapipe/tasks-vision"

/**
 * Draw segmentation result
 */
export function drawSegmentation(mask?: MPMask, canvas?: HTMLCanvasElement) {

  if (!mask) { throw new Error("drawSegmentation failed: empty mask") }

  if (!canvas) { throw new Error("drawSegmentation failed: cannot access the canvas") }

  const width = mask.width;
  const height = mask.height;
  const maskData = mask.getAsFloat32Array();

  canvas.width = width;
  canvas.height = height;

  console.log("drawSegmentation: drawing..")

  const ctx = canvas.getContext("2d")

  if (!ctx) { throw new Error("drawSegmentation failed: cannot access the 2D context") }

  ctx.fillStyle = "#00000000";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "rgba(18, 181, 203, 0.7)";

  maskData.forEach((category: number, index: number, array: Float32Array) => {
    if (Math.round(category * 255.0) === 0) {
      const x = (index + 1) % width;
      const y = (index + 1 - x) / width;
      ctx.fillRect(x, y, 1, 1);
    }
  })
}