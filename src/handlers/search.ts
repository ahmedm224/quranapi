import { getSurahsByName } from '../utils/ayahMapping';
import { searchReciters } from '../utils/validation';
import { successResponse, badRequestResponse } from '../utils/response';

/**
 * Handle search requests
 * Supports:
 * - GET /api/v1/search?q=query&type=surah
 * - GET /api/v1/search?q=query&type=reciter
 */
export async function handleSearch(request: any): Promise<Response> {
  const url = new URL(request.url);
  const query = url.searchParams.get('q');
  const type = url.searchParams.get('type');

  if (!query) {
    return badRequestResponse('Missing required parameter: q (search query)');
  }

  if (!type) {
    return badRequestResponse('Missing required parameter: type (surah or reciter)');
  }

  const searchType = type.toLowerCase();

  if (searchType === 'surah') {
    // Search surahs by name/transliteration/translation
    const results = getSurahsByName(query);

    return successResponse({
      query,
      type: 'surah',
      count: results.length,
      results
    });
  } else if (searchType === 'reciter') {
    // Search reciters by name/id
    const results = searchReciters(query);

    return successResponse({
      query,
      type: 'reciter',
      count: results.length,
      results
    });
  } else {
    return badRequestResponse('Invalid type parameter. Must be "surah" or "reciter"');
  }
}
