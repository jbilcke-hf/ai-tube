
import React from "react"
import { ImageSegmenterResult } from "@mediapipe/tasks-vision"

import { segmentFrame } from "./segmentFrame"

export async function getSegmentationCanvas({
  frame,
  timestamp,
  width,
  height
}: {
  frame: TexImageSource;
  timestamp: number;
  width: number;
  height: number;
}): Promise<JSX.Element> {
   const results: ImageSegmenterResult = await segmentFrame(frame, timestamp);
  
   const canvas: HTMLCanvasElement | OffscreenCanvas | undefined = results.categoryMask?.canvas;
  
   // If there is a canvas, style it and return
   if (canvas) {
      const style = {
        width: `${width}px`,
        height: `${height}px`,
      };

      // console.log("canvas:", canvas)
      const CanvasComponent = () => (
        <canvas
          ref={(node) => {
            if (node) {
              node.width = width;
              node.height = height;
              const context = node.getContext('2d');
              if (context) {
                context.drawImage(canvas, 0, 0, width, height);
              }
            }
          }}
          style={style}
        />
      );
      return <CanvasComponent />;
   } else {
      // Return a blank canvas if no canvas is found in results
      return (
        <canvas
          width={width}
          height={height}
          style={{
            width: `${width}px`,
            height: `${height}px`,
            backgroundColor: 'transparent',
          }}
        />
      );
   }
}