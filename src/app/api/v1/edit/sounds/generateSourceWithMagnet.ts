import { addBase64Header } from "@/lib/data/addBase64Header"
import { SoundGenerationParams } from "./types"
import { getClusterMachine } from "./cluster"

const microserviceApiKey = `${process.env.MICROSERVICE_API_SECRET_TOKEN || ""}`

/**
 * Note: this generates a base64 mp3 file
 */
export async function generateSoundWithMagnet({
  prompt,
  durationInSec,
  hd,
  debug = false,
  neverThrow = false,
}: SoundGenerationParams): Promise<string> {

  if (!prompt?.length) {
    throw new Error(`prompt is too short!`)
  }

  const machine = await getClusterMachine()

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
          // TODO
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
      throw new Error(`the returned sound was empty`)
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