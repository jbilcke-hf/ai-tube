"use client"

import Avatar, { ReactAvatarProps } from "react-avatar"

export default function DefaultAvatarImpl(props: ReactAvatarProps): JSX.Element {
  return (
    <Avatar
      {...props}
    />
  )
}