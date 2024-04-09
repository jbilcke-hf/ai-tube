import { ComponentProps } from "react"

import { MediaList } from "../media-list"

export function TrackList(props: Omit<ComponentProps<typeof MediaList>, "type">) {
  
  return (
    <MediaList
      {...props}
      type="track"
    />
  )
}