import React from "react"
import { IoMdPause, IoMdPlay } from "react-icons/io"

import { IconSwitch } from "../../../icon-switch"

export function PlayPauseButton({
  className = "",
  isToggledOn,
  onClick
}: {
  className?: string
  isToggledOn?: boolean
  onClick?: () => void
}) {
  return (
    <IconSwitch
      isToggledOn={isToggledOn}
      onIcon={IoMdPause}
      offIcon={IoMdPlay}
      onClick={onClick}
      size="md"
      disabled={false}
      isAlt={false}
      thickOnHover={false}
      className={className}
    />
  )
}