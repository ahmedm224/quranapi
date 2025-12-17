import surahs from '../data/surahs.json';

export interface SurahMetadata {
  number: number;
  name: string;
  transliteration: string;
  translation: string;
  ayahCount: number;
  startAyah: number;
  endAyah: number;
  revelationType: string;
}

export interface AyahReference {
  surah: number;
  ayah: number;
}

/**
 * Convert surah number and ayah within surah to global ayah number (1-6236)
 * @param surahNumber - The surah number (1-114)
 * @param ayahInSurah - The ayah number within the surah (1-based)
 * @returns Global ayah number (1-6236)
 * @throws Error if invalid surah or ayah number
 */
export function getGlobalAyahNumber(surahNumber: number, ayahInSurah: number): number {
  const surah = getSurahByNumber(surahNumber);

  if (!surah) {
    throw new Error(`Invalid surah number: ${surahNumber}. Must be between 1 and 114.`);
  }

  if (ayahInSurah < 1 || ayahInSurah > surah.ayahCount) {
    throw new Error(
      `Invalid ayah number: ${ayahInSurah} for surah ${surahNumber}. Must be between 1 and ${surah.ayahCount}.`
    );
  }

  return surah.startAyah + ayahInSurah - 1;
}

/**
 * Convert global ayah number to surah:ayah reference
 * @param globalAyahNumber - Global ayah number (1-6236)
 * @returns Object with surah and ayah numbers
 * @throws Error if invalid global ayah number
 */
export function getAyahReference(globalAyahNumber: number): AyahReference {
  if (globalAyahNumber < 1 || globalAyahNumber > 6236) {
    throw new Error(`Invalid global ayah number: ${globalAyahNumber}. Must be between 1 and 6236.`);
  }

  // Binary search for efficiency
  let left = 0;
  let right = surahs.surahs.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const surah = surahs.surahs[mid];

    if (globalAyahNumber >= surah.startAyah && globalAyahNumber <= surah.endAyah) {
      return {
        surah: surah.number,
        ayah: globalAyahNumber - surah.startAyah + 1
      };
    } else if (globalAyahNumber < surah.startAyah) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  throw new Error(`Could not find ayah reference for global ayah ${globalAyahNumber}`);
}

/**
 * Get surah metadata by surah number
 * @param surahNumber - The surah number (1-114)
 * @returns Surah metadata or null if not found
 */
export function getSurahByNumber(surahNumber: number): SurahMetadata | null {
  if (surahNumber < 1 || surahNumber > 114) {
    return null;
  }

  return surahs.surahs[surahNumber - 1] as SurahMetadata;
}

/**
 * Get surah metadata by name (case-insensitive, supports partial matches)
 * @param name - Surah name in Arabic, English, or transliteration
 * @returns Array of matching surahs
 */
export function getSurahsByName(name: string): SurahMetadata[] {
  const searchTerm = name.toLowerCase().trim();

  return surahs.surahs.filter((surah: any) => {
    return (
      surah.name.toLowerCase().includes(searchTerm) ||
      surah.transliteration.toLowerCase().includes(searchTerm) ||
      surah.translation.toLowerCase().includes(searchTerm)
    );
  }) as SurahMetadata[];
}

/**
 * Get all surahs
 * @returns Array of all surah metadata
 */
export function getAllSurahs(): SurahMetadata[] {
  return surahs.surahs as SurahMetadata[];
}

/**
 * Validate that a global ayah number is within valid range
 * @param globalAyahNumber - The global ayah number to validate
 * @returns true if valid, false otherwise
 */
export function isValidGlobalAyahNumber(globalAyahNumber: number): boolean {
  return globalAyahNumber >= 1 && globalAyahNumber <= 6236;
}

/**
 * Validate that a surah:ayah combination is valid
 * @param surahNumber - The surah number
 * @param ayahInSurah - The ayah number within the surah
 * @returns true if valid, false otherwise
 */
export function isValidSurahAyah(surahNumber: number, ayahInSurah: number): boolean {
  const surah = getSurahByNumber(surahNumber);
  if (!surah) return false;

  return ayahInSurah >= 1 && ayahInSurah <= surah.ayahCount;
}
