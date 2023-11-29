
import { Credentials } from "@/huggingface/hub/src"

export const adminApiKey = `${process.env.ADMIN_HUGGING_FACE_API_TOKEN || ""}`
export const adminUsername = `${process.env.ADMIN_HUGGING_FACE_USERNAME || ""}`

export const adminCredentials: Credentials = { accessToken: adminApiKey }

export const aiTubeRobotApi = `${process.env.AI_TUBE_ROBOT_API || ""}`
