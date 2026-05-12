/** Remove the title sentence from the narrative body to avoid repetition. */
export function getBodyText(narrative: string, title?: string): string {
  const t = narrative.trim()
  if (!title || !t.startsWith(title)) return t
  // Strip the title and the trailing sentence-ending punctuation
  return t.slice(title.length).replace(/^[。！？\n]+\s*/, '').trimStart()
}
