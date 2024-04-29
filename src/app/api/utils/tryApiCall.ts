import { makeSureSpaceIsRunning } from "./makeSureSpaceIsRunning"
import { sleep } from "./sleep"
import { timeout } from "./timeout"

const sec = 1000
const min = 60 *sec

export async function tryApiCalls<T>({
  func,
  huggingFaceSpace,
  debug = false,
  failureMessage = "failed to call the endpoint",
  autostart = true,

  // wait up to 10 min
  timeoutInSec = 10 * 60,

  delays = [
    5 *sec,
    15 *sec,
    40 *sec, // total 1 min wait time

    //at this stage, if it is so slow it means we are probably waking up a model
    // which is a slow operation (takes ~5 min)

    2 *min, //     ~ 3 min ~
    1 *min, //     ~ 4 min ~
    1 *min, //     ~ 5 min ~
  ]
}: {
  func: () => Promise<T>

  // optional: the name of the hugging face space
  // this will be used to "wake up" the space if necessary
  huggingFaceSpace?: string

  debug?: boolean
  failureMessage?: string
  autostart?: boolean
  timeoutInSec?: number
  delays?: number[]
}) {

  for (let i = 0; i < delays.length; i++) {
    try {
      if (autostart) {
        await makeSureSpaceIsRunning({ space: huggingFaceSpace })
      }

      // due to an error with the Gradio client, sometimes calling the api.predict
      // will never throw an error
      const result = await timeout(
        func(), // grab the promise
        timeoutInSec * 1000,
        new Error(`call to ${huggingFaceSpace || "the API"} failed after ${timeoutInSec} seconds`)
      )
      return result
    } catch (err) {
      if (debug) { console.error(err) }
      process.stdout.write(".")

      if (i > 0) {
        await sleep(delays[i])
      }
    }
  }

  throw new Error(`${failureMessage} after ${delays.length} attempts`)
}
