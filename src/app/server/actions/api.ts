"use server"

import { Credentials, listDatasets, whoAmI } from "@/huggingface/hub/src"
import { ChannelInfo } from "@/types"

const adminApiKey = `${process.env.ADMIN_HUGGING_FACE_API_TOKEN || ""}`
const adminUsername = `${process.env.ADMIN_HUGGING_FACE_USERNAME || ""}`

const adminCredentials: Credentials = { accessToken: adminApiKey }

export async function getChannels({
  apiKey,
  owner,
}: { // the user wants to browse their own private or public channels
  apiKey: string
  owner: undefined
} | { // the user wants to browse someone's else public channels
  apiKey: undefined
  owner: string
} | { // the user wants to browse all public channels
  apiKey: undefined
  owner: undefined
} = { // by default we perform a gloval search using admin credentials
  apiKey: undefined,
  owner: undefined
}): Promise<ChannelInfo[]> {

  let credentials: Credentials = adminCredentials

  if (apiKey) {
    try {
      credentials = { accessToken: apiKey }
      const { name: username } = await whoAmI({ credentials })
      if (!username) {
        throw new Error(`couldn't get the username`)
      }
      // everything is in order,
      owner = username
    } catch (err) {
      console.error(err)
      return []
    }
  }

  let channels: ChannelInfo[] = []
  
  const prefix = "ai-tube-"

  let search = owner
    ? { owner } // search channels of a specific user
    : { search: prefix } // global search (note: might be costly?)

  console.log("search:", search)

  for await (const { id, name, likes, updatedAt } of listDatasets({
    search,
    credentials
  })) {

    const chunks = name.split("/")
    const [datasetUsername, datasetName] = chunks.length === 2
      ? chunks
      : [name, name]

    console.log(`found a candidate dataset "${datasetName}" owned by @${datasetUsername}`)

    if (!datasetName.startsWith(prefix)) {
      continue
    }

    const slug = datasetName.replaceAll(prefix, "")
    
    console.log(`the dataset is a valid channel: "${slug}"`)

    // TODO parse the README to get the proper label
    const label = slug.replaceAll("-", " ")


    // TODO parse the README to get this
    // we could also use the user's avatar by default
    const thumbnail = ""

    const prompt = "" // TODO parse the README to get this

    const channel: ChannelInfo = {
      id,
      slug,
      label, 
      thumbnail,
      prompt,
      likes,
      // updatedAt
    }

    channels.push(channel)
  }

  return channels
}
