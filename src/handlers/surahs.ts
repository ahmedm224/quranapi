import { IRequest } from 'itty-router';
import { getAllSurahs, getSurahByNumber } from '../utils/ayahMapping';
import { parseIntParam } from '../utils/validation';
import { successResponse, notFoundResponse, badRequestResponse } from '../utils/response';

/**
 * Handle surah-related requests
 * Supports:
 * - GET /api/v1/surahs - List all surahs
 * - GET /api/v1/surahs/:surahNumber - Get specific surah
 */
export async function handleSurahsRequest(request: IRequest): Promise<Response> {
  const { surahNumber } = request.params;

  // If surahNumber is provided, return specific surah
  if (surahNumber) {
    try {
      const number = parseIntParam(surahNumber, 'surahNumber');
      const surah = getSurahByNumber(number);

      if (!surah) {
        return notFoundResponse('Surah');
      }

      return successResponse({ surah });
    } catch (error: any) {
      return badRequestResponse(error.message);
    }
  }

  // Return all surahs
  const surahs = getAllSurahs();

  return successResponse({
    count: surahs.length,
    surahs
  });
}
