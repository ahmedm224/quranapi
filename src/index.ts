import { Router } from 'itty-router';
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

// Root endpoint - API documentation
router.get('/', () => {
  return successResponse({
    name: 'Quran Audio API',
    version: '1.0.0',
    description: 'Public API for streaming Quran audio recitations from 44 renowned reciters',
    documentation: 'https://github.com/ahmedm224/quranapi#readme',
    endpoints: {
      health: '/api/health',
      reciters: '/api/v1/reciters',
      surahs: '/api/v1/surahs',
      audio: '/api/v1/audio/:reciterId/surah/:surahNumber/ayah/:ayahInSurah',
      search: '/api/v1/search?q=<query>&type=<surah|reciter>',
      credits: '/api/v1/credits'
    },
    examples: {
      listReciters: 'https://quranapi.cloudlinqed.com/api/v1/reciters',
      listSurahs: 'https://quranapi.cloudlinqed.com/api/v1/surahs',
      streamAudio: 'https://quranapi.cloudlinqed.com/api/v1/audio/husary/surah/1/ayah/1',
      searchSurah: 'https://quranapi.cloudlinqed.com/api/v1/search?q=fatiha&type=surah',
      getCredits: 'https://quranapi.cloudlinqed.com/api/v1/credits'
    },
    features: [
      '44 renowned Quran reciters (including Warsh variants)',
      '6,236 individual ayah audio files',
      'High-quality MP3 streaming from Cloudflare R2',
      'Global CDN with low latency',
      'HTTP Range requests support (seekable audio)',
      'CORS enabled for web applications',
      'Free and public - no authentication required'
    ],
    dataSources: {
      metadata: 'Tanzil.net',
      audio: 'EveryAyah.com'
    },
    contact: {
      github: 'https://github.com/ahmedm224/quranapi',
      issues: 'https://github.com/ahmedm224/quranapi/issues'
    }
  });
});

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
router.get('/api/v1/audio/:reciterId/:ayahNumber', handleAudioRequest);
router.get('/api/v1/audio/:reciterId/surah/:surahNumber', handleAudioRequest);
router.get('/api/v1/audio/:reciterId/surah/:surahNumber/ayah/:ayahInSurah', handleAudioRequest);

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
      // Handle request through router - itty-router v5 expects just request and env
      const response = await router.fetch(request, env, ctx);

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
