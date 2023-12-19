"use server"

import { WhoAmIUser, whoAmI } from "@/huggingface/hub/src"
import {  UserInfo } from "@/types"
import { adminApiKey } from "./config"
import { redis } from "./redis"

export async function getCurrentUser(apiKey: string): Promise<UserInfo> {
  if (!apiKey) {
    throw new Error(`the apiKey is required`)
  }

  const credentials = { accessToken: apiKey }
  
  const huggingFaceUser = await whoAmI({ credentials }) as unknown as WhoAmIUser

  const id = huggingFaceUser.id

  const user: UserInfo = {
    id,
    type: apiKey === adminApiKey ? "admin" : "normal",
    userName: huggingFaceUser.name,
    fullName: huggingFaceUser.fullname,
    thumbnail: huggingFaceUser.avatarUrl,
    channels: [],
    hfApiToken: apiKey,
  }
  
  await redis.set(`users:${id}`, user)
  
  return user
}

export async function getUser(id: string): Promise<UserInfo | undefined> {
  const maybeUser = await redis.get<UserInfo>(id)

  if (maybeUser?.id) {
    const publicFacingUser: UserInfo = {
      ...maybeUser,
      hfApiToken: undefined, // <-- important!
    }
    delete publicFacingUser.hfApiToken
    return publicFacingUser
  }

  return undefined
}

export async function getUsers(ids: string[]): Promise<Record<string, UserInfo>> {
  try {
    const maybeUsers = await redis.mget<UserInfo[]>(ids.map(userId => `users:${userId}`))

    const usersById: Record<string, UserInfo> = {}

    maybeUsers.forEach((user, index) => {
      if (user?.id) {
        const publicFacingUser: UserInfo = {
          ...user,
          hfApiToken: undefined, // <-- important!
        }
        delete publicFacingUser.hfApiToken
        usersById[user.id] = publicFacingUser
      }
    })

    return usersById
  } catch (err) {
    return {}
  }
}