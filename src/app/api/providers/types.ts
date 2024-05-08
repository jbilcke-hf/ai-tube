
// LLMEngine = the actual engine to use (eg. hugging face)
export type LLMVendor =
  | "HUGGINGFACE"
  | "OPENAI"
  | "GROQ"
  | "ANTHROPIC"

export type LLMVendorConfig = {
  vendor: LLMVendor
  apiKey: string
  modelId: string
}

export type LLMPredictionFunctionParams = {
  systemPrompt: string
  userPrompt: string
  nbMaxNewTokens: number
  turbo?: boolean
  prefix?: string
  // llmVendorConfig: LLMVendorConfig
}
