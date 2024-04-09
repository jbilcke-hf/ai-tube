export function formatLargeNumber(num: number): string {
  if (num < 1000) {
    return num.toString(); // Display as-is for numbers under 1000
  } else if (num < 1000000) {
    // Format for thousands
    return (num / 1000).toFixed(num < 10000 ? 1 : 0) + "K";
  } else if (num < 1000000000) {
    // Format for millions
    return (num / 1000000).toFixed(num < 10000000 ? 1 : 0) + "M";
  } else {
    // Format for billions
    return (num / 1000000000).toFixed(num < 10000000000 ? 1 : 0) + "B";
  }
}