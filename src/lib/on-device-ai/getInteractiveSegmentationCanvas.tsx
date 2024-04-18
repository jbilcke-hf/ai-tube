import { useRef } from "react"
import { segmentFrame } from "./segmentFrameOnClick"
import { ImageSource, InteractiveSegmenterResult } from "@mediapipe/tasks-vision"


export function InteractiveSegmentationCanvas({
  src,
  onClick,
}: {
  src?: ImageSource
  onClick?: (results: InteractiveSegmenterResult ) => void
}) {
  const segmentationClickRef = useRef<HTMLDivElement>(null)
  return (
    <div 
      ref={segmentationClickRef}
      onClick={(event) => {
        if (!segmentationClickRef.current || !src || !onClick) { return }
        
        const box = segmentationClickRef.current.getBoundingClientRect()

        const px = event.clientX
        const py = event.clientY

        const x = px / box.width
        const y = py / box.height

        const fn = async () => {
          const results: InteractiveSegmenterResult = await segmentFrame(src, x, y);
          onClick(results)
        }
        fn()

    }}>
    </div>
  )
}