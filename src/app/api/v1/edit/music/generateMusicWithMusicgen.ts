import { addBase64Header } from "@/lib/data/addBase64Header"
import { MusicGenerationParams } from "./types"
import { getClusterMachine } from "./cluster"

const microserviceApiKey = `${process.env.MICROSERVICE_API_SECRET_TOKEN || ""}`

/**
 * Note: this generates a base64 mp3 file
 */
export async function generateMusicWithMusicgen({
  prompt,
  durationInSec,
  hd,
  debug = false,
  neverThrow = false,
}: MusicGenerationParams): Promise<string> {

  if (!prompt?.length) {
    throw new Error(`prompt is too short!`)
  }

  const machine = await getClusterMachine()

  // should we add things in here?
  const finalPrompt = `${prompt}`

  try {
    const res = await fetch(machine.url + (machine.url.endsWith("/") ? "" : "/") + "api/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        fn_index: 1, // <- important!
        data: [
          microserviceApiKey, // string  in 'Secret Token' Textbox component		
          "facebook/musicgen-stereo-large", // string  in 'Model' Radio component		
          "", // string  in 'Model Path (custom models)' Textbox component	
          
          // can be one of Default or MultiBand_Diffusion
          // since speed isn't an issue for AI Tube,
          // we can afford to use the MultiBand Decoder
          hd ? "MultiBand_Diffusion" : "Default",

          finalPrompt, // string  in 'Input Text' Textbox component
          null, 	// blob in 'File' Audio component		
          durationInSec, // number (numeric value between 1 and 300) in 'Duration' Slider component		
          250, // number  in 'Top-k' Number component		
          0, // number  in 'Top-p' Number component		
          1, // number  in 'Temperature' Number component		
          3, // number  in 'Classifier Free Guidance' Number component
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
      throw new Error(`the returned music was empty`)
    }

    // console.log("data:", data[0].slice(0, 60))
    return addBase64Header(data[0] as string, "mp3")
  } catch (err) {
    throw err
  } finally {
    // important: we need to free up the machine!
    machine.busy = false
  }
}