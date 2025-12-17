import reciters from '../data/reciters.json';
import { isValidGlobalAyahNumber, isValidSurahAyah } from './ayahMapping';

export interface ReciterMetadata {
  id: string;
  name: string;
  arabicName: string;
  r2Path: string;
}

/**
 * Validate and get reciter by ID
 * @param reciterId - The reciter ID to validate
 * @returns Reciter metadata if found, null otherwise
 */
export function validateReciter(reciterId: string): ReciterMetadata | null {
  const reciter = reciters.reciters.find((r: any) => r.id === reciterId);
  return reciter ? (reciter as ReciterMetadata) : null;
}

/**
 * Validate ayah number
 * @param ayahNumber - The ayah number to validate
 * @returns Error message if invalid, null if valid
 */
export function validateAyahNumber(ayahNumber: number): string | null {
  if (!Number.isInteger(ayahNumber)) {
    return 'Ayah number must be an integer';
  }

  if (!isValidGlobalAyahNumber(ayahNumber)) {
    return 'Ayah number must be between 1 and 6236';
  }

  return null;
}

/**
 * Validate surah number
 * @param surahNumber - The surah number to validate
 * @returns Error message if invalid, null if valid
 */
export function validateSurahNumber(surahNumber: number): string | null {
  if (!Number.isInteger(surahNumber)) {
    return 'Surah number must be an integer';
  }

  if (surahNumber < 1 || surahNumber > 114) {
    return 'Surah number must be between 1 and 114';
  }

  return null;
}

/**
 * Validate surah and ayah combination
 * @param surahNumber - The surah number
 * @param ayahInSurah - The ayah number within the surah
 * @returns Error message if invalid, null if valid
 */
export function validateSurahAyah(surahNumber: number, ayahInSurah: number): string | null {
  const surahError = validateSurahNumber(surahNumber);
  if (surahError) return surahError;

  if (!Number.isInteger(ayahInSurah)) {
    return 'Ayah number must be an integer';
  }

  if (!isValidSurahAyah(surahNumber, ayahInSurah)) {
    return `Invalid ayah number for surah ${surahNumber}`;
  }

  return null;
}

/**
 * Parse and validate integer parameter
 * @param value - The value to parse
 * @param paramName - The parameter name (for error messages)
 * @returns Parsed integer or throws error
 */
export function parseIntParam(value: string | undefined, paramName: string): number {
  if (!value) {
    throw new Error(`Missing required parameter: ${paramName}`);
  }

  const parsed = parseInt(value, 10);

  if (isNaN(parsed)) {
    throw new Error(`Invalid ${paramName}: must be a number`);
  }

  return parsed;
}

/**
 * Get all reciters
 * @returns Array of all reciter metadata
 */
export function getAllReciters(): ReciterMetadata[] {
  return reciters.reciters as ReciterMetadata[];
}

/**
 * Search reciters by name (partial match, case-insensitive)
 * @param query - Search query
 * @returns Array of matching reciters
 */
export function searchReciters(query: string): ReciterMetadata[] {
  const searchTerm = query.toLowerCase().trim();

  return reciters.reciters.filter((r: any) => {
    return (
      r.id.toLowerCase().includes(searchTerm) ||
      r.name.toLowerCase().includes(searchTerm) ||
      r.arabicName.includes(query.trim())
    );
  }) as ReciterMetadata[];
}
