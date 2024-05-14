import { sleep } from "@/lib/utils/sleep"
import { ClusterMachine } from "../../types"

export const nbClusterMachines = 1
// make sure the machines are running!!

// https://huggingface.co/spaces/jbilcke-hf/ai-tube-model-magnet-1/settings
// https://huggingface.co/spaces/jbilcke-hf/ai-tube-model-magnet-2/settings
// https://huggingface.co/spaces/jbilcke-hf/ai-tube-model-magnet-3/settings
// https://huggingface.co/spaces/jbilcke-hf/ai-tube-model-magnet-4/settings

// we maintain a global cluster state

export const clusterMachines: ClusterMachine[] = []
for (let i = 0; i < nbClusterMachines; i++) {
  clusterMachines.push({
    id: i,
    url: `https://jbilcke-hf-ai-tube-model-magnet-${i + 1}.hf.space`,
    busy: false
  })
}

export async function getClusterMachine(maxWaitTimeInMs: number = 10000): Promise<ClusterMachine> {
  let clusterMachine: ClusterMachine | undefined = undefined
  let timeSpentWaitingInMs = 0
  const intervalInMs = 500
  
  while (true) {
    clusterMachine = clusterMachines.find(m => !m.busy)
    if (clusterMachine) { break }
    if (timeSpentWaitingInMs > maxWaitTimeInMs) { break }
    await sleep(intervalInMs)
  }

  if (!clusterMachine) {
    throw new Error(`failed to find a cluster machine within ${maxWaitTimeInMs/1000} seconds`)
  }

  // change the global state
  clusterMachine.busy = true

  return clusterMachine
}

export const token = `${process.env.MICROSERVICE_API_SECRET_TOKEN || ""}`
