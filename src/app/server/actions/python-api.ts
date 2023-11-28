"use server"

import { python } from "pythonia"

const apiKey = `${process.env.ADMIN_HUGGING_FACE_API_TOKEN || ""}`

export async function listDatasetCommunityPosts(): Promise<any[]> {

  const { HfApi } = await python("huggingface_hub")

  const hf = await HfApi({
    endpoint: "https://huggingface.co",
    token: apiKey
  })
  // TODO

  return [] as any[]
}

