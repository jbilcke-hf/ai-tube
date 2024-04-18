
export async function downloadPlainText(url: string): Promise<string> {
  // Fetch the plain text file
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to download the plain/text file: ${response.statusText}`)
  }

  const plainText = await response.text()

  return plainText
}