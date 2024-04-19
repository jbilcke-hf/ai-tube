import { FilesetResolver, ImageClassifier, ImageClassifierResult } from "@mediapipe/tasks-vision"

export type InteractiveImageClassifier = (videoFrame: TexImageSource, x: number, y: number) => Promise<ImageClassifierResult>

const getInteractiveImageClassifier = async (): Promise<InteractiveImageClassifier> => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );

  const imageClassifier = await ImageClassifier.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-models/image_classifier/efficientnet_lite0/float32/1/efficientnet_lite0.tflite`
    },
    runningMode: "VIDEO",
  });

  const segmenter: InteractiveImageClassifier = (
    videoFrame: TexImageSource,
    x: number,
    y: number
  ): Promise<ImageClassifierResult> => {
    return new Promise((resolve, reject) => {
      imageClassifier.classify(
        videoFrame
        // TODO: there is a "region of interest field" we could use
      )
    })
  }

  return segmenter
}


const globalState: { classifier?: InteractiveImageClassifier } = {};

(async () => {
  globalState.classifier = globalState.classifier || (await getInteractiveImageClassifier())
})();

export async function classifyFrame(frame: TexImageSource, x: number, y: number): Promise<ImageClassifierResult> {
  console.log("classifyFrame: loading classifier..")
  globalState.classifier = globalState.classifier || (await getInteractiveImageClassifier())

  console.log("classifyFrame: segmenting..")
  return globalState.classifier(frame, x, y)
}

// to run:

// see doc:
// https://developers.google.com/mediapipe/solutions/vision/image_segmenter/web_js#video
// imageSegmenter.segmentForVideo(video, startTimeMs, callbackForVideo);
