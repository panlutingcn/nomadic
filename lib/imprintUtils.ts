/** Extract the first complete sentence as the imprint title. */
export function extractTitle(narrative: string, city: string): string {
  const t = narrative.trim()
  const m = t.match(/^(.+?)[。！？!?\n]/)
  if (m) return m[1].trim()
  return t.slice(0, 40).trim() || `${city} 的印迹`
}

/**
 * Resolve the display title for an imprint.
 * - User imprints: narrative starts with storedTitle (possibly truncated) →
 *   return the full first sentence.
 * - Sample/independent imprints: title and narrative are unrelated →
 *   return storedTitle as-is.
 */
export function getDisplayTitle(
  narrative: string,
  storedTitle: string | undefined,
  city?: string,
): string {
  const t = narrative.trim()
  const fallback = storedTitle || (city ? `${city} 的印迹` : '印迹')
  if (!t) return fallback
  if (storedTitle && t.startsWith(storedTitle)) {
    const m = t.match(/^(.+?)[。！？!?\n]/)
    if (m) return m[1].trim()
    return storedTitle
  }
  return fallback
}

/** Remove the title sentence from narrative body to avoid repetition. */
export function getBodyText(narrative: string, title?: string): string {
  const t = narrative.trim()
  if (!title || !t.startsWith(title)) return t
  // Strip the full first sentence even if stored title was truncated mid-sentence
  const m = t.match(/^(.+?)[。！？!?\n]/)
  if (m && m[1].startsWith(title)) {
    return t.slice(m[1].length).replace(/^[。！？!?\n\s]+/, '').trimStart()
  }
  return t.slice(title.length).replace(/^[。！？\n]+\s*/, '').trimStart()
}
