export function useCharacterLimit({
  value,
  nbCharsLimits,
  warnBelow,
}: {
  value: string,
  nbCharsLimits: number,
  warnBelow: number
}) {
  const nbCharsUsed = value.length

  const nbCharsRemaining = Math.max(0, nbCharsLimits - nbCharsUsed)

  const colorClass = 
  nbCharsUsed > nbCharsLimits
      ? "text-red-500" :
      nbCharsRemaining < 4
      ? "text-orange-600" :
      nbCharsRemaining < 8
     ? "text-yellow-600"
     : "text-green-600"

  const shouldWarn = nbCharsRemaining < warnBelow

  return {
    nbCharsUsed,
    nbCharsRemaining,
    nbCharsLimits,
    colorClass,
    shouldWarn,
  }
}