import path from "node:path"

// see the .env file fore more informations
export const storagePath = `${process.env.STORAGE_PATH || './sandbox'}`

export const partiesDirFilePath = path.join(storagePath, "parties")
