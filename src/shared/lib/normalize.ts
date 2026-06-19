/**
 * Normalizes a string for accent-insensitive and case-insensitive comparison.
 * Use BEFORE comparing search terms against data.
 */
export function normalizeForSearch(s: string): string {
  return s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}
