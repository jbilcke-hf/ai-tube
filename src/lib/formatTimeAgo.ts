import { formatDistance } from 'date-fns'

export function formatTimeAgo(time: string) {
  return formatDistance(new Date(time), new Date(), { addSuffix: true })
}