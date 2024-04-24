import { useEffect, useRef, useState } from "react"
import { v4 as uuidv4 } from "uuid"

import { cn } from "@/lib/utils/cn"

import { LayerElement } from "./types"

export function VideoBuffer({
  bufferSize = 4,
  className = "",
  width = 512,
  height = 256,
}: {
  bufferSize?: number
  className?: string
  width?: number
  height?: number
}) {
  const state = useRef<{
    isInitialized: boolean
  }>({
    isInitialized: false,
  })

  const [layers, setLayers] = useState<LayerElement[]>([])
  
  // this initialize the VideoBuffer and keeps the layers in sync with the bufferSize
  useEffect(() => {
    if (layers?.length !== bufferSize) {
      const newLayers: LayerElement[] = []
      for (let i = 0; i < bufferSize; i++) {
        newLayers.push({
          id: uuidv4(),
          element: <></>
        })
      }
      setLayers(newLayers)
    }
  }, [bufferSize, layers?.length])

  return (
    <div
      className={cn(className)}
      style={{
        width,
        height
      }}>
    {layers.map(({ id, element }) => (
      <div
        key={id}
        id={id}
        style={{ width, height }}
        // className={`video-buffer-layer video-buffer-layer-${id}`}
      >{element}</div>))}
    </div>
  )
}