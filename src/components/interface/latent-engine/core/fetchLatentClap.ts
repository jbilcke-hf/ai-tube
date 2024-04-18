import { parseClap } from "@/lib/clap/parseClap"
import { ClapProject } from "@/lib/clap/types"

export async function fetchLatentClap(prompt: string): Promise<ClapProject> {

  const requestUri = `/api/resolvers/clap?p=${encodeURIComponent(prompt)}`

  console.log(`fetchLatentClap: calling ${requestUri}`)

  const res = await fetch(requestUri)

  const blob = await res.blob()

  const clap = await parseClap(blob)

  console.log(`fetchLatentClap: received = `, clap)

  return clap
}