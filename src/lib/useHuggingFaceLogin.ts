import { useEffect, useState } from "react"

import { oauthHandleRedirectIfPresent, oauthLoginUrl } from "@huggingface/hub"

export function useHuggingFaceLogin(onLogin?: (data: any) => void) {
  const [isLoggedIn, setLoggedIn] = useState(false)
  const [oauthResult, setOauthResult] = useState<any>({})

  useEffect(() => {
    const fn = async () => {
      const res = await oauthHandleRedirectIfPresent()
      if (res) {
        setOauthResult(res)
        setLoggedIn(true)
        onLogin?.(res)
      }
    }
    fn()
  }, [])

  const login = async () => {
    window.location.href = await oauthLoginUrl()
  }

  console.log(JSON.stringify(oauthResult, null, 2))

  return {
    isLoggedIn,
    login,
    oauthResult,
  }
}