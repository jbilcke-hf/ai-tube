import { addBase64Header } from "@/lib/data/addBase64Header"
import { tryApiCalls } from "../../utils/tryApiCall"

const gradioSpaceApiUrl = `https://jbilcke-hf-ai-tube-model-parler-tts-mini.hf.space`
const huggingFaceSpace = "jbilcke-hf/ai-tube-model-parler-tts-mini"
const microserviceApiKey = `${process.env.MICROSERVICE_API_SECRET_TOKEN || ""}`

/**
 * Note: this generates a MP3 file
 * 
 * @param param0 
 * @returns 
 */
export async function generateSpeechWithParlerTTS({
  text,
  audioId,
  debug = false,
  neverThrow = false,
}: {
  text: string
  audioId: string
  debug?: boolean
  neverThrow?: boolean
}): Promise<string> {

  const actualFunction = async () => {

    const res = await fetch(gradioSpaceApiUrl + (gradioSpaceApiUrl.endsWith("/") ? "" : "/") + "api/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        fn_index: 0, // <- important!
        data: [
          microserviceApiKey,
          text,
          audioId,
        ],
      }),
      cache: "no-store",
      // we can also use this (see https://vercel.com/blog/vercel-cache-api-nextjs-cache)
      // next: { revalidate: 1 }
    })

    if (res.status !== 200) {
      throw new Error('Failed to fetch data')
    }

 
    const { data } = await res.json()

    // console.log("data:", data)
    // Recommendation: handle errors
    if (res.status !== 200 || !Array.isArray(data)) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error(`Failed to fetch data (status: ${res.status})`)
    }
    // console.log("data:", data.slice(0, 50))
  
    if (!data[0]) {
      throw new Error(`the returned audio was empty`)
    }
  
    return addBase64Header(data[0] as string, "mp3")
  }

  try {
    if (!text?.length) {
      throw new Error(`text is too short!`)
    }

    const result = await tryApiCalls({
      func: actualFunction,
      huggingFaceSpace,
      debug,
      failureMessage: "failed to generate the audio"
    })

    return result
  } catch (err) {
    if (neverThrow) {
      console.error(`generateVoiceWithParlerTTS():`, err)
      return ""
    } else {
      throw err
    }
  }
}