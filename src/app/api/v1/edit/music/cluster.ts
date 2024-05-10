import { sleep } from "@/lib/utils/sleep"
import { ClusterMachine } from "../../types"

export const nbClusterMachines = 4
// make sure the machines are running!!

// https://huggingface.co/spaces/jbilcke-hf/ai-tube-model-musicgen-1/settings
// https://huggingface.co/spaces/jbilcke-hf/ai-tube-model-musicgen-2/settings
// https://huggingface.co/spaces/jbilcke-hf/ai-tube-model-musicgen-3/settings
// https://huggingface.co/spaces/jbilcke-hf/ai-tube-model-musicgen-4/settings

// we maintain a global cluster state

export const clusterMachines: ClusterMachine[] = []
for (let i = 0; i < nbClusterMachines; i++) {
  clusterMachines.push({
    id: i,
    url: `https://jbilcke-hf-ai-tube-model-musicgen-${i + 1}.hf.space`,
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
    throw new Error(`failed to find a cluster machine within ${maxWaitTimeInMs/10} seconds`)
  }

  // change the global state
  clusterMachine.busy = true

  return clusterMachine
}

export const token = `${process.env.MICROSERVICE_API_SECRET_TOKEN || ""}`
