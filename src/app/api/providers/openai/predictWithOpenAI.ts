"use server"

import { OpenAI } from "openai"
import { ChatCompletionMessageParam } from "openai/resources"

import { LLMPredictionFunctionParams } from "../types"

export async function predict({
  systemPrompt,
  userPrompt,
  nbMaxNewTokens,
}: LLMPredictionFunctionParams): Promise<string> {
  const openaiApiKey = `${process.env.AUTH_OPENAI_API_KEY || ""}`
  const openaiApiModel = "gpt-4-turbo"
  const openaiApiBaseUrl = "https://api.openai.com/v1"
  if (!openaiApiKey) { throw new Error(`missing OpenAI API key`) }

  const openai = new OpenAI({
    apiKey: openaiApiKey,
    baseURL: openaiApiBaseUrl,
  })

  const messages: ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ]

  try {
    const res = await openai.chat.completions.create({
      messages: messages,
      stream: false,
      model: openaiApiModel,
      temperature: 0.8,
      max_tokens: nbMaxNewTokens,

      // TODO: use the nbPanels to define a max token limit
    })

    return res.choices[0].message.content || ""
  } catch (err) {
    console.error(`error during generation: ${err}`)
    return ""
  }
}