import { FilesetResolver, ImageSegmenter, ImageSegmenterResult, ImageSource } from "@mediapipe/tasks-vision"

export type VideoSegmenter = (videoFrame: ImageSource, timestamp: number) => Promise<ImageSegmenterResult>

const getSegmenter = async (): Promise<VideoSegmenter> => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );

  const imageSegmenter = await ImageSegmenter.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        // this is a very lightweight model (< 2.7 Mb!) so it is not perfect,
        // it can only detect a few types of objects
        
        "https://storage.googleapis.com/mediapipe-assets/deeplabv3.tflite?generation=1661875711618421",
    },
    outputCategoryMask: true,
    outputConfidenceMasks: false,

    // since we only generate images for now,
    // there is little consistency between each of them
    // so there is no need to use "VIDEO"
    runningMode: "VIDEO"
  });

  const segmenter: VideoSegmenter = (videoFrame: ImageSource, timestamp: number): Promise<ImageSegmenterResult> => {
    return new Promise((resolve, reject) => {
      imageSegmenter.segmentForVideo(videoFrame, timestamp, (results) => {
        resolve(results)
      })
    })
  }

  return segmenter
}


const globalState: { segmenter?: VideoSegmenter } = {};

(async () => {
  globalState.segmenter = globalState.segmenter || (await getSegmenter())
})();

export async function segmentFrame(frame: ImageSource, timestamp: number): Promise<ImageSegmenterResult> {
  console.log("segmentFrame: loading segmenter..")
  globalState.segmenter = globalState.segmenter || (await getSegmenter())

  console.log("segmentFrame: segmenting..")
  return globalState.segmenter(frame, timestamp)
}

// to run:

// see doc:
// https://developers.google.com/mediapipe/solutions/vision/image_segmenter/web_js#video
// imageSegmenter.segmentForVideo(video, startTimeMs, callbackForVideo);
