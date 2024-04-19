import {
  FilesetResolver,
  ObjectDetector,
  ObjectDetectorResult
} from "@mediapipe/tasks-vision"

export type VideoObjectDetector = (videoFrame: TexImageSource, timestamp: number) => Promise<ObjectDetectorResult>

const getObjectDetector = async (): Promise<VideoObjectDetector> => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );

  const objectDetector = await ObjectDetector.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-tasks/object_detector/efficientdet_lite0_uint8.tflite`
    },
    scoreThreshold: 0.5,
    runningMode: "VIDEO"
  });

  const detector: VideoObjectDetector = async (videoFrame: TexImageSource, timestamp: number): Promise<ObjectDetectorResult> => {
    const result = objectDetector.detectForVideo(videoFrame, timestamp)
    return result
  }

  return detector
}


const globalState: { detector?: VideoObjectDetector } = {};

(async () => {
  globalState.detector = globalState.detector || (await getObjectDetector())
})();

export async function identifyFrame(frame: TexImageSource, timestamp: number): Promise<ObjectDetectorResult> {
  console.log("identifyFrame: loading segmenter..")
  globalState.detector = globalState.detector || (await getObjectDetector())

  console.log("identifyFrame: segmenting..")
  return globalState.detector(frame, timestamp)
}

// to run:

// see doc:
// https://developers.google.com/mediapipe/solutions/vision/image_segmenter/web_js#video
// imageSegmenter.segmentForVideo(video, startTimeMs, callbackForVideo);


