import { promises as fs, existsSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';

import { v4 as uuidv4 } from 'uuid';
import ffmpeg from 'fluent-ffmpeg';

const validFormats = ['jpeg', 'png', 'webp'];

/**
 * Extract the first frame from a video
 * 
 * @param param0
 * @returns 
 */
export async function extractFirstFrame({
  inputVideo,
  outputFormat = 'jpeg'
}: {
  inputVideo?: string
  outputFormat?: "jpeg" | "png" | "webp"

}): Promise<string> {

  if (!inputVideo) {
    throw new Error(`inputVideo must be a file path or a base64 data-uri`);
  }

  if (!validFormats.includes(outputFormat)) {
    throw new Error(`Invalid output format. Choose one of: ${validFormats.join(', ')}`);
  }

  // Handle base64 input
  let videoFilePath = inputVideo;
  if (inputVideo.startsWith('data:')) {
    const matches = inputVideo.match(/^data:video\/(\w+);base64,(.*)$/);
    if (!matches) {
      throw new Error('Invalid base64 input provided.');
    }
    const extension = matches[1];
    const base64Content = matches[2];
    
    videoFilePath = path.join(os.tmpdir(), `${uuidv4()}_inputVideo.${extension}`);
    await fs.writeFile(videoFilePath, base64Content, 'base64');
  } else if (!existsSync(videoFilePath)) {
    throw new Error('Video file does not exist.');
  }

  // Create a temporary output file
  const outputImagePath = path.join(os.tmpdir(), `${uuidv4()}.${outputFormat}`);

  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(videoFilePath)
      .outputOptions([
        '-vframes', '1',  // Extract only one frame
        '-f', 'image2',   // Output format for the frame as image
        '-an'             // Disable audio
      ])
      .output(outputImagePath)
      .on('error', (err) => {
        reject(new Error(`FFmpeg error: ${err.message}`));
      })
      .on('end', async () => {
        try {
          const imageBuffer = await fs.readFile(outputImagePath);
          const imageBase64 = `data:image/${outputFormat};base64,${imageBuffer.toString('base64')}`;
          resolve(imageBase64);
        } catch (error) {
          reject(new Error(`Error reading the image file: ${error}`));
        } finally {
          // Clean up temporary files
          if (inputVideo.startsWith('data:')) {
            await fs.unlink(videoFilePath);
          }
          await fs.unlink(outputImagePath);
        }
      })
      .run();
  });
}