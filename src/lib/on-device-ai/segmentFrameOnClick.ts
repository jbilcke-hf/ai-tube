import { FilesetResolver, InteractiveSegmenter, InteractiveSegmenterResult, ImageSource } from "@mediapipe/tasks-vision"

export type InteractiveVideoSegmenter = (videoFrame: ImageSource, x: number, y: number) => Promise<InteractiveSegmenterResult>

const getInteractiveSegmenter = async (): Promise<InteractiveVideoSegmenter> => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );

  const interactiveSegmenter = await InteractiveSegmenter.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-tasks/interactive_segmenter/ptm_512_hdt_ptm_woid.tflite"
    },
    outputCategoryMask: true, 
    outputConfidenceMasks: false,
  });

  const segmenter: InteractiveVideoSegmenter = (
    videoFrame: ImageSource,
    x: number,
    y: number
  ): Promise<InteractiveSegmenterResult> => {
    return new Promise((resolve, reject) => {
      interactiveSegmenter.segment(
        videoFrame,
        {
          keypoint: { x, y }
        },
        (results) => {
        resolve(results)
      })
    })
  }

  return segmenter
}


const globalState: { segmenter?: InteractiveVideoSegmenter } = {};

(async () => {
  globalState.segmenter = globalState.segmenter || (await getInteractiveSegmenter())
})();

export async function segmentFrame(frame: ImageSource, x: number, y: number): Promise<InteractiveSegmenterResult> {
  console.log("segmentFrame: loading segmenter..")
  globalState.segmenter = globalState.segmenter || (await getInteractiveSegmenter())

  console.log("segmentFrame: segmenting..")
  return globalState.segmenter(frame, x, y)
}

// to run:

// see doc:
// https://developers.google.com/mediapipe/solutions/vision/image_segmenter/web_js#video
// imageSegmenter.segmentForVideo(video, startTimeMs, callbackForVideo);
