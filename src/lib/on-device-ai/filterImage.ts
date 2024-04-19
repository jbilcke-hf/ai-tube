/**
 * Applies a mask to an image using canvas blending modes to avoid explicit pixel iteration.
 * 
 * @param image The source image as an HTMLImageElement.
 * @param maskCanvas The canvas element containing a mask.
 * @returns A new Promise resolving to a headless canvas element containing the masked image.
 */
export async function filterImage(
  image?: HTMLImageElement,
  maskCanvas?: HTMLCanvasElement
): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {

    // Create a new canvas to construct the final image
    const resultCanvas = document.createElement("canvas");

    if (!image) {
      // reject(`missing image (must be a HTMLImageElement)`)
      resolve(resultCanvas)
      return
    }

    resultCanvas.width = image.width;
    resultCanvas.height = image.height;

    if (!maskCanvas) {
      // reject(`missing image (must be a HTMLImageElement)`)
      resolve(resultCanvas)
      return
    }

    const ctx = resultCanvas.getContext("2d");
    if (!ctx) {
        reject(new Error("Failed to get 2D context"));
        return;
    }

    // Draw the original image
    ctx.drawImage(image, 0, 0, image.width, image.height);

    // Set blending mode to 'destination-in' to keep only the content that overlaps the mask
    ctx.globalCompositeOperation = "destination-in";
    ctx.drawImage(maskCanvas, 0, 0, image.width, image.height);

    // Reset composite operation to default
    ctx.globalCompositeOperation = "source-over";

    // Draw white rectangle where the mask is opaque
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, image.width, image.height);

    resolve(resultCanvas);
  });
}