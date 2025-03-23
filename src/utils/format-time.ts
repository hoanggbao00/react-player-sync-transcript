/**
 * Format seconds to HH:MM:SS
 * @param seconds - The number of seconds to format
 * @returns The formatted time HH:MM:SS or MM:SS if less than 1 hour
 */
export const formatSecondsToHHMMSS = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  // padStart to ensure 2 digits. eg 1 -> 01
  const minutes = (Math.floor((seconds % 3600) / 60)).toString().padStart(2, "0");
  const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, "0");

  if (hours > 0) {
    return `${hours}:${minutes}:${remainingSeconds}`;
  }

  return `${minutes}:${remainingSeconds}`;
};
