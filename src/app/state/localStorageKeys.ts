import { Settings } from "@/types/general"

export const localStorageKeys: Record<keyof Settings, string> = {
  // important: prefix with AI_TUBE to avoid collisions when running the app on localhost
  huggingfaceApiKey: "AI_TUBE_CONF_AUTH_HF_API_TOKEN",
}
