import { NextResponse, NextRequest } from "next/server"

import { getVideo } from "@/app/server/actions/ai-tube-hf/getVideo"
import { parseMediaProjectionType } from "@/lib/utils/parseMediaProjectionType";

/**
 * @deprecated
 */
export async function GET(req: NextRequest) {
  
  const videoId = req.url.split("/").pop() || ""
  const video = await getVideo({ videoId, neverThrow: true })
  if (!video) {
    return new NextResponse("video not found", { status: 404 });
  }
  const isEquirectangular = parseMediaProjectionType(video) === "equirectangular"
  
  const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <title>${video.label} - AiTube</title>
    <meta name="description" content="${video.description}<">
    <script src="/aframe/aframe-master.js"></script>
    <script src="/aframe/play-on-click.js"></script>
    <script src="/aframe/hide-on-play.js"></script>
  </head>
  <body>
    <a-scene>
      <a-assets>
        <video
          id="video"
          loop
          crossorigin="anonymous"
          playsinline
          webkit-playsinline
          src="${video.assetUrlHd || video.assetUrl}">
        </video>
      </a-assets>
      ${
        isEquirectangular
        ? `
      <a-videosphere
        rotation="0 -90 0"
        src="#video"
        play-on-click>
      </a-videosphere>
      ` :
      `<a-video
        src="#video"
        width="${
        3 // 1024
      }" height="${
        1.6875 // 576
      }"
      play-on-click>
      </a-video>`
      }
      <a-camera>
        <a-entity
          position="0 0 -1.5"
          text="align: center;
                width: 6;
                wrapCount: 100;
                color: white;
                value: Click or tap to start video"
          hide-on-play="#video">
        </a-entity>
      </a-camera>
    </a-scene>
  </body>
</html>`

  return new NextResponse(html, {
     status: 200,
    headers: new Headers({ "content-type": "text/html" }),
  })
}
