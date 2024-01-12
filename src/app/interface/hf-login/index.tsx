 "use client"

import { useCurrentUser } from "@/app/state/userCurrentUser"
import { Button } from "@/components/ui/button"
import { useHuggingFaceLogin } from "@/lib/useHuggingFaceLogin"

export function HuggingFaceLogin() {

  const user = useCurrentUser()
  const hf = useHuggingFaceLogin()

  // feature is not finished yet
  if (user?.userName !== "jbilcke-hf") { return }

  console.log("user:", user)
  console.log("hf.isLoggedIn:", hf.isLoggedIn)
  console.log("hf.oauthResult:", hf.oauthResult)

  return (
    <div><Button onClick={hf.login}>test</Button></div>
  )
}