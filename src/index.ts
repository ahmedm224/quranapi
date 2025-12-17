import { Router, IRequest } from 'itty-router';
import { handleAudioRequest } from './handlers/audio';
import { handleRecitersRequest } from './handlers/reciters';
import { handleSurahsRequest } from './handlers/surahs';
import { handleSearch } from './handlers/search';
import { handleCredits } from './handlers/credits';
import { corsMiddleware, addCorsHeaders } from './middleware/cors';
import { rateLimitMiddleware } from './middleware/rateLimit';
import { handleError } from './middleware/errorHandler';
import { successResponse } from './utils/response';

export interface Env {
  QURAN_AUDIO_BUCKET: R2Bucket;
}

// Create router
const router = Router();

// Apply middleware to all routes
router.all('*', corsMiddleware);
router.all('*', rateLimitMiddleware);

// Health check endpoint
router.get('/api/health', () => {
  return successResponse({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    service: 'Quran Audio API'
  });
});

// Reciters endpoints
router.get('/api/v1/reciters', handleRecitersRequest);
router.get('/api/v1/reciters/:reciterId', handleRecitersRequest);

// Surahs endpoints
router.get('/api/v1/surahs', handleSurahsRequest);
router.get('/api/v1/surahs/:surahNumber', handleSurahsRequest);

// Audio streaming endpoints
router.get('/api/v1/audio/:reciterId/:ayahNumber', (request: IRequest, env: Env) =>
  handleAudioRequest(request, env)
);
router.get('/api/v1/audio/:reciterId/surah/:surahNumber', (request: IRequest, env: Env) =>
  handleAudioRequest(request, env)
);
router.get('/api/v1/audio/:reciterId/surah/:surahNumber/ayah/:ayahInSurah', (request: IRequest, env: Env) =>
  handleAudioRequest(request, env)
);

// Search endpoint
router.get('/api/v1/search', handleSearch);

// Credits/Attribution endpoint
router.get('/api/v1/credits', handleCredits);

// 404 handler for unmatched routes
router.all('*', () => {
  return new Response(
    JSON.stringify({
      error: {
        message: 'Not Found',
        code: 'NOT_FOUND'
      }
    }),
    {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    }
  );
});

// Main fetch handler
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      // Handle request through router
      const response = await router.handle(request, env, ctx);

      // Add CORS headers to response if not already present
      if (!response.headers.has('Access-Control-Allow-Origin')) {
        return addCorsHeaders(response);
      }

      return response;
    } catch (error) {
      // Global error handler
      const errorResponse = handleError(error);
      return addCorsHeaders(errorResponse);
    }
  }
};
