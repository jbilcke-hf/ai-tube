
import { v4 as uuidv4 } from "uuid"

export function formatPromptFileName(id?: string): { id: string; fileName: string } {

  const videoId = typeof id === "string" ? id : uuidv4()
  
  const fileName = `prompt_${videoId}.md`

  return {
    id: videoId,
    fileName
  }
}