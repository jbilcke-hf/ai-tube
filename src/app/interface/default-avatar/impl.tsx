"use client"

import RSA from "react-string-avatar"

export type DefaultAvatarProps = {
  username?: string
  initials?: string
  bgColor?: string
  textColor?: string
  roundShape?: boolean
  cornerRadius?: number
  pictureFormat?: string
  pictureResolution?: number
  width?: number
  pixelated?: boolean
  wrapper?: boolean
  wrapperStyle?: Record<string, any>
}

export type DefaultAvatarComponent = (props: DefaultAvatarProps) => JSX.Element

const ReactStringAvatar = RSA as DefaultAvatarComponent


export default function DefaultAvatarImpl({
  username,
  initials: customInitials,
  ...props
}: DefaultAvatarProps): JSX.Element {

  const usernameInitials = `${username || ""}`
    .trim()
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/([a-z])([A-Z])/g, '$1 $2') // split the camel case
    .split(" ") // split words
    .map(u => u.trim()[0]) // take first char
    .slice(0, 2) // keep first 2 chars
    .join("")
    .toUpperCase()

  return (
    <ReactStringAvatar
      initials={customInitials || usernameInitials}
      {...props}
    />
  )
}