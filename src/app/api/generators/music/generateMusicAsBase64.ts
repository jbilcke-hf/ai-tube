import { sleep } from "@/lib/utils/sleep"
import { generateMusicWithMusicgen } from "./generateMusicWithMusicgen"

// apparently if we ask to generate like 4 minutes of audio, it crashes
const maxAudioDurationInSec = 120

// generate music
// this may generate multiple tracks (one after another)
// if the durationInSec parameter is larger than the max audio duration
export async function generateMusicAsBase64({
    prompt,
    durationInSec,
    hd = false,
  }: {
    prompt: string
    durationInSec: number

    // use diffusion (increases quality, but requires more RAM)
    hd?: boolean
  }): Promise<string[]> {
  
  const musicPrompt = prompt || ""
 
  if (durationInSec < 1 || !musicPrompt) { return [] }
  
  if (durationInSec > maxAudioDurationInSec) {
    const halfTheDuration = Math.round(durationInSec / 2)
  
    // no! we shouldn't generate them in parallel
    // or at least, no now, because we only have ONE music server!
    // const chunks = await Promise.all([
    //  generateMusic({ video, durationInSec: halfTheDuration })
    //])
    // return chunks.reduce((acc, tracks) => ([...acc, ...tracks]), [])

    // instead, let's play it safe and generate them one after another
    let chunks: string[] = []
    const partA = await generateMusicAsBase64({ prompt, hd, durationInSec: halfTheDuration })
    if (partA) { chunks = chunks.concat(partA) }

    const partB = await generateMusicAsBase64({ prompt, hd, durationInSec: halfTheDuration })
    if (partB) { chunks = chunks.concat(partB) }

    return [...partA, ...partB]
  }

  let musicTracks: string[] = []

  const musicParams = {
    prompt: musicPrompt,
    durationInSec,
    hd,
  }
  try {
    console.log(`  |- generating ${durationInSec} seconds of music..`)
    const musicTrack = await generateMusicWithMusicgen(musicParams)
    if (!musicTrack?.length) { throw new Error("audio is too short to be valid!")}
    musicTracks.push(musicTrack)
  } catch (err) {
    try {
      await sleep(4000)
      const musicTrack = await generateMusicWithMusicgen(musicParams)
      if (!musicTrack?.length) { throw new Error("audio is too short to be valid!")}
      musicTracks.push(musicTrack)
    } catch (err2) {
      console.error(`  |- failed to generate the music (yes, we retried after a delay)`)
    }
  }


  return musicTracks
}