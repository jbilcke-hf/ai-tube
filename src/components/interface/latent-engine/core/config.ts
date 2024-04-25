export const aitubeUrl = `${process.env.NEXT_PUBLIC_DOMAIN || "" }`
export const aitubeApiUrl = aitubeUrl + (aitubeUrl.endsWith("/") ? "" : "/") + "api/"