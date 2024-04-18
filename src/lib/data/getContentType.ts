export function getContentType(dataUri: string): string {
  const beforeBase64 = dataUri.split(";base64,").shift() || ""
  const afterData = beforeBase64.split("data:").pop() || ""
  return afterData
}