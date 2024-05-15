import { sleep } from "@/lib/utils/sleep"
import { ClusterMachine } from "../../types"


// 8 allows us to support about 1 request per minute
// we are still gonna need to add a hugging face login wall,
// to limit further the amount of requests people do
export const nbClusterMachines = 8
// make sure the machines are running!!

// https://huggingface.co/spaces/jbilcke-hf/ai-tube-model-als-1/settings
// https://huggingface.co/spaces/jbilcke-hf/ai-tube-model-als-2/settings
// https://huggingface.co/spaces/jbilcke-hf/ai-tube-model-als-3/settings
// https://huggingface.co/spaces/jbilcke-hf/ai-tube-model-als-4/settings
// https://huggingface.co/spaces/jbilcke-hf/ai-tube-model-als-5/settings
// https://huggingface.co/spaces/jbilcke-hf/ai-tube-model-als-6/settings
// https://huggingface.co/spaces/jbilcke-hf/ai-tube-model-als-7/settings
// https://huggingface.co/spaces/jbilcke-hf/ai-tube-model-als-8/settings

// we maintain a global cluster state

export const clusterMachines: ClusterMachine[] = [

    // careful when trying this one (check number of Gradio parameters, fps etc):
    // url: `https://jbilcke-hf-ai-tube-model-als-experimental.hf.space`,

  // { id: 0, url: `https://jbilcke-hf-ai-tube-model-als-1.hf.space`, busy: false },
  // { id: 1, url: `https://jbilcke-hf-ai-tube-model-als-2.hf.space`, busy: false },
  // { id: 2, url: `https://jbilcke-hf-ai-tube-model-als-3.hf.space`, busy: false },
  // { id: 3, url: `https://jbilcke-hf-ai-tube-model-als-4.hf.space`, busy: false },
  // { id: 4, url: `https://jbilcke-hf-ai-tube-model-als-5.hf.space`, busy: false },
  // { id: 5, url: `https://jbilcke-hf-ai-tube-model-als-6.hf.space`, busy: false },
]

for (let i = 0; i < nbClusterMachines; i++) {
  clusterMachines.push({
    id: i,
    url: `https://jbilcke-hf-ai-tube-model-als-${i + 1}.hf.space`,
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
