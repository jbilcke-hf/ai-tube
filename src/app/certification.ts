// for the moment only Hugging Face employees can be certified,
// but it might be given to a select few high-profile partners
// normal users don't need to be certified to enjoy the platform
export const certifiedUsers = new Set([
  "jbilcke-hf",
  "merve",
  "xenova"
])

export function isCertifiedUser(username: string): boolean {
  return certifiedUsers.has(username.trim().toLowerCase())
}