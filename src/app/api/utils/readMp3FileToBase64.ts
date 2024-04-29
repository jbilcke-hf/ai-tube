import { readFile } from "node:fs/promises"

export async function readMp3FileToBase64(filePath: string): Promise<string> {
  try {
    // Read the file's content as a Buffer
    const fileBuffer = await readFile(filePath);

    // Convert the buffer to a base64 string
    const base64 = fileBuffer.toString('base64');

    return `data:audio/mp3;base64,${base64}`;
  } catch (error) {
    // Handle errors (e.g., file not found, no permissions, etc.)
    console.error(error);
    throw error;
  }
}
