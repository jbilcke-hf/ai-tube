 "use client"

import { useCurrentUser } from "@/app/state/userCurrentUser"
import { Button } from "@/components/ui/button"

export function HuggingFaceLogin() {

  const { user, login } = useCurrentUser()

  // feature is not finished yet
  if (!user?.userName || user?.userName !== "jbilcke-hf") { return }

  return (
    <div><Button onClick={login}>Sign in with Hugging Face</Button></div>
  )
}