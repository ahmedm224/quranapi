import { getAllReciters, validateReciter } from '../utils/validation';
import { successResponse, notFoundResponse } from '../utils/response';

/**
 * Handle reciter-related requests
 * Supports:
 * - GET /api/v1/reciters - List all reciters
 * - GET /api/v1/reciters/:reciterId - Get specific reciter
 */
export async function handleRecitersRequest(request: any): Promise<Response> {
  const { reciterId } = request.params;

  // If reciterId is provided, return specific reciter
  if (reciterId) {
    const reciter = validateReciter(reciterId);

    if (!reciter) {
      return notFoundResponse('Reciter');
    }

    return successResponse({ reciter }, {
      'Cache-Control': 'public, max-age=31536000, immutable'
    });
  }

  // Return all reciters
  const reciters = getAllReciters();

  return successResponse({
    count: reciters.length,
    reciters
  }, {
    'Cache-Control': 'public, max-age=31536000, immutable'
  });
}
