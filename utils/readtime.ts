const wpm = 225;
export function readingTime(text: string) {
  const words = text.trim().split(/\s+/).length;
  const time = Math.ceil(words / wpm);
  return time;
}
