// compute a "collection key" that we can use in our useEffects and such
export function getCollectionKey(input?: any): string {
  const collection: any[] = Array.isArray(input) ? input : [`${input || ""}`]
  return (collection || []).map((v: any) => (v as any)?.id || JSON.stringify(v)).filter(x => x).join("--")
}