import { useEffect, useTransition } from "react"

import { UserInfo } from "@/types/general"

import { useStore } from "./useStore"
import { useLocalStorage } from "usehooks-ts"
import { localStorageKeys } from "./localStorageKeys"
import { defaultSettings } from "./defaultSettings"
import { getCurrentUser } from "../server/actions/users"

export function useCurrentUser(): UserInfo | undefined {
  const [_pending, startTransition] = useTransition()

  const currentUser = useStore(s => s.currentUser)
  const setCurrentUser = useStore(s => s.setCurrentUser)

  const [huggingfaceApiKey] = useLocalStorage<string>(
    localStorageKeys.huggingfaceApiKey,
    defaultSettings.huggingfaceApiKey
  )
  useEffect(() => {
    startTransition(async () => {

      // no key
      if (!huggingfaceApiKey) {
        setCurrentUser(undefined)
        return
      }

      // already logged-in
      if (currentUser?.id) {
        return
      }
      try {

        const user = await getCurrentUser(huggingfaceApiKey)

        setCurrentUser(user)
      } catch (err) {
        console.error("failed to log in:", err)
        setCurrentUser(undefined)
      }
    })
  
  }, [huggingfaceApiKey, currentUser?.id])

  return currentUser
}