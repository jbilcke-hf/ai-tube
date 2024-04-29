/**
 * break a base64 string into sub-components
 */
export function extractBase64(base64: string = ""): {

  // file format eg. video/mp4 text/html audio/wave
  mimetype: string;

  // file extension eg. .mp4 .html .wav
  extension: string;
  
  data: string;
  buffer: Buffer;
  blob: Blob;
} {
  // Regular expression to extract the MIME type and the base64 data
  const matches = base64.match(/^data:([A-Za-z-+0-9/]+);base64,(.+)$/)

  if (!matches || matches.length !== 3) {
    throw new Error("Invalid base64 string")
  }
   
  const mimetype = matches[1] || ""
  const data = matches[2] || ""
  const buffer = Buffer.from(data, "base64")
  const blob = new Blob([buffer])

  // this should be enough for most media formats (jpeg, png, webp, mp4)
  const extension = mimetype.split("/").pop() || ""

  return {
    mimetype,
    extension,
    data,
    buffer,
    blob,
  }
}