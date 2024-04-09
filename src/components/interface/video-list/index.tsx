import { ComponentProps } from "react"

import { MediaList } from "../media-list"

export function VideoList(props: Omit<ComponentProps<typeof MediaList>, "type">) {
  
  return (
    <MediaList
      {...props}
      type="video"
    />
  )
}