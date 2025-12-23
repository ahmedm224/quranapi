import { Router } from 'itty-router';
import { handleAudioRequest } from './handlers/audio';
import { handleRecitersRequest } from './handlers/reciters';
import { handleSurahsRequest } from './handlers/surahs';
import { handleSearch } from './handlers/search';
import { handleCredits } from './handlers/credits';
import { handleManifest, handlePageRequest, handleDownloadRequest } from './handlers/quranText';
import { handleAthanManifest, handleMuezzinsList, handleAthanList, handleAthanAudio, handleAthanDownload } from './handlers/athan';
import { handleLandingPage, handlePrivacyPage, handleAssetRequest } from './handlers/website';
import { corsMiddleware, addCorsHeaders } from './middleware/cors';
import { rateLimitMiddleware } from './middleware/rateLimit';
import { handleError } from './middleware/errorHandler';
import { successResponse, addRateLimitHeaders } from './utils/response';

export interface Env {
  QURAN_AUDIO_BUCKET: R2Bucket;
}

// Create router
const router = Router();

// Apply middleware to all routes
router.all('*', corsMiddleware);
router.all('*', rateLimitMiddleware);

// Static assets (logo, favicon)
router.get('/assets/:filename', (request: any, env: Env) => {
  const { filename } = request.params;
  return handleAssetRequest(request, env, filename);
});

// Privacy policy page
router.get('/privacy', () => handlePrivacyPage());

// Root endpoint - Landing page for alfurqan.online, API docs for others
router.get('/', (request: any) => {
  const url = new URL(request.url);
  const hostname = url.hostname;

  // Serve landing page for main website domain
  if (hostname === 'alfurqan.online' || hostname === 'www.alfurqan.online') {
    return handleLandingPage();
  }

  // Serve API documentation for API domains
  return successResponse({
    name: 'Quran Audio API',
    version: '1.0.0',
    description: 'Public API for streaming Quran audio recitations from 44 renowned reciters',
    website: 'https://alfurqan.online',
    documentation: 'https://github.com/ahmedm224/quranapi#readme',
    endpoints: {
      health: '/api/health',
      reciters: '/api/v1/reciters',
      surahs: '/api/v1/surahs',
      audio: '/api/v1/audio/:reciterId/surah/:surahNumber/ayah/:ayahInSurah',
      quranText: {
        manifest: '/api/v1/quran-text/manifest',
        page: '/api/v1/quran-text/page/:pageNumber',
        download: '/api/v1/quran-text/download'
      },
      athan: {
        manifest: '/api/v1/athan/manifest',
        muezzins: '/api/v1/athan/muezzins',
        list: '/api/v1/athan/list?muezzin=<id>&country=<country>&type=<regular|fajr|takbeer>',
        audio: '/api/v1/athan/:id',
        download: '/api/v1/athan/download'
      },
      search: '/api/v1/search?q=<query>&type=<surah|reciter>',
      credits: '/api/v1/credits'
    },
    examples: {
      listReciters: 'https://alfurqan.online/api/v1/reciters',
      listSurahs: 'https://alfurqan.online/api/v1/surahs',
      streamAudio: 'https://alfurqan.online/api/v1/audio/husary/surah/1/ayah/1',
      quranTextManifest: 'https://alfurqan.online/api/v1/quran-text/manifest',
      quranTextPage: 'https://alfurqan.online/api/v1/quran-text/page/1',
      searchSurah: 'https://alfurqan.online/api/v1/search?q=fatiha&type=surah',
      athanMuezzins: 'https://alfurqan.online/api/v1/athan/muezzins',
      athanList: 'https://alfurqan.online/api/v1/athan/list',
      athanAudio: 'https://alfurqan.online/api/v1/athan/206930',
      getCredits: 'https://alfurqan.online/api/v1/credits'
    },
    features: [
      '44 renowned Quran reciters (including Warsh variants)',
      '6,236 individual ayah audio files',
      '604 Quran text pages in SVG format',
      '32 athan recordings from famous muezzins worldwide',
      'High-quality MP3 streaming from Cloudflare R2',
      'Global CDN with low latency',
      'HTTP Range requests support (seekable audio)',
      'CORS enabled for web applications',
      'Free and public - no authentication required'
    ],
    dataSources: {
      metadata: 'Tanzil.net',
      audio: 'EveryAyah.com',
      quranText: 'github.com/batoulapps/quran-svg (King Fahd Quran Printing Complex)',
      athan: 'Assabile.com'
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

// Quran Text SVG endpoints
router.get('/api/v1/quran-text/manifest', handleManifest);
router.get('/api/v1/quran-text/page/:pageNumber', (request: any, env: Env) => {
  const { pageNumber } = request.params;
  return handlePageRequest(request, env, pageNumber);
});
router.get('/api/v1/quran-text/download', (request: any, env: Env) => {
  return handleDownloadRequest(request, env);
});

// Athan (Adhan) endpoints
router.get('/api/v1/athan/manifest', handleAthanManifest);
router.get('/api/v1/athan/muezzins', handleMuezzinsList);
router.get('/api/v1/athan/list', handleAthanList);
router.get('/api/v1/athan/download', (request: any, env: Env) => {
  return handleAthanDownload(request, env);
});
router.get('/api/v1/athan/:athanId', (request: any, env: Env) => {
  const { athanId } = request.params;
  return handleAthanAudio(request, env, athanId);
});

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
      let response = await router.fetch(request, env, ctx);

      // Add rate limit headers if available
      if ((request as any).rateLimitInfo) {
        response = addRateLimitHeaders(response, (request as any).rateLimitInfo);
      }

      // Add CORS headers to response if not already present
      if (!response.headers.has('Access-Control-Allow-Origin')) {
        return addCorsHeaders(response);
      }

      return response;
    } catch (error) {
      // Global error handler
      let errorResponse = handleError(error);

      // Add rate limit headers to error responses too
      if ((request as any).rateLimitInfo) {
        errorResponse = addRateLimitHeaders(errorResponse, (request as any).rateLimitInfo);
      }

      return addCorsHeaders(errorResponse);
    }
  }
};
