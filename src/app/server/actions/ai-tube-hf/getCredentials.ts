
// safe way to get the credentials

import { Credentials, WhoAmIUser, whoAmI } from "@/huggingface/hub/src"

import { adminCredentials, adminUsername } from "../config"

export async function getCredentials(apiKey?: string): Promise<{
  username: string
  avatarUrl: string
  credentials: Credentials
}> {
  let username = adminUsername
  let credentials: Credentials = adminCredentials
  let avatarUrl = ""

  if (apiKey) {
    try {
      credentials = { accessToken: apiKey }
      const user = await whoAmI({ credentials }) as unknown as WhoAmIUser
      if (!user.name) {
        throw new Error(`couldn't get the username`)
      }
      username = user.name
      avatarUrl = user.avatarUrl || ""
    } catch (err) {
      console.error(err)
      // important: we throw an error if an apiKey was explicitely given but is empty
      throw new Error(`the provided Hugging Face API key is invalid or has expired`)
    }
  }

  return {
    username,
    avatarUrl,
    credentials
  }
}