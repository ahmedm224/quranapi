import { getGlobalAyahNumber, getAyahReference } from '../utils/ayahMapping';
import { validateReciter, parseIntParam } from '../utils/validation';
import { errorResponse, notFoundResponse, badRequestResponse } from '../utils/response';

export interface Env {
  QURAN_AUDIO_BUCKET: R2Bucket;
}

/**
 * Handle audio streaming requests
 * Supports three URL patterns:
 * - /api/v1/audio/:reciterId/:ayahNumber
 * - /api/v1/audio/:reciterId/surah/:surahNumber
 * - /api/v1/audio/:reciterId/surah/:surahNumber/ayah/:ayahInSurah
 */
export async function handleAudioRequest(request: any, env: Env): Promise<Response> {
  try {
    const { reciterId, ayahNumber, surahNumber, ayahInSurah } = request.params;

    // Validate reciter
    const reciter = validateReciter(reciterId);
    if (!reciter) {
      return notFoundResponse('Reciter');
    }

    // Determine which pattern is being used and calculate global ayah number
    let globalAyah: number;

    if (ayahNumber) {
      // Pattern 1: /api/v1/audio/:reciterId/:ayahNumber
      globalAyah = parseIntParam(ayahNumber, 'ayahNumber');

      if (globalAyah < 1 || globalAyah > 6236) {
        return badRequestResponse('Ayah number must be between 1 and 6236');
      }
    } else if (surahNumber && ayahInSurah) {
      // Pattern 3: /api/v1/audio/:reciterId/surah/:surahNumber/ayah/:ayahInSurah
      const surah = parseIntParam(surahNumber, 'surahNumber');
      const ayah = parseIntParam(ayahInSurah, 'ayahInSurah');

      try {
        globalAyah = getGlobalAyahNumber(surah, ayah);
      } catch (error: any) {
        return badRequestResponse(error.message);
      }
    } else if (surahNumber) {
      // Pattern 2: /api/v1/audio/:reciterId/surah/:surahNumber
      // This would require streaming multiple files - not implemented yet
      return badRequestResponse('Streaming full surahs is not yet supported. Please specify an ayah number.');
    } else {
      return badRequestResponse('Invalid audio request parameters');
    }

    // Get the ayah reference (surah and ayah within surah)
    const ayahRef = getAyahReference(globalAyah);

    // Construct R2 key: reciter.r2Path/SSSAAA.mp3
    // Format: SSS = Surah (3 digits), AAA = Ayah (3 digits)
    const surahPadded = String(ayahRef.surah).padStart(3, '0');
    const ayahPadded = String(ayahRef.ayah).padStart(3, '0');
    const fileName = `${surahPadded}${ayahPadded}.mp3`;
    const r2Key = `${reciter.r2Path}/${fileName}`;

    // Fetch from R2
    const object = await env.QURAN_AUDIO_BUCKET.get(r2Key);

    if (!object) {
      return notFoundResponse(`Audio file (${r2Key})`);
    }

    // Prepare response headers
    const headers = new Headers();
    headers.set('Content-Type', 'audio/mpeg');
    headers.set('Content-Length', object.size.toString());
    headers.set('Cache-Control', 'public, max-age=31536000, immutable'); // 1 year
    headers.set('Accept-Ranges', 'bytes');

    // Add CORS headers
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');

    // Handle range requests for audio seeking
    const rangeHeader = request.headers.get('Range');
    if (rangeHeader) {
      return handleRangeRequest(object, rangeHeader, headers);
    }

    // Return full audio file
    return new Response(object.body, { headers });

  } catch (error: any) {
    console.error('Audio handler error:', error);
    return errorResponse(error.message || 'Internal server error', 500);
  }
}

/**
 * Handle HTTP Range requests for audio seeking
 * @param object - R2 object
 * @param rangeHeader - Range header value
 * @param baseHeaders - Base headers to include
 * @returns Response with partial content (206)
 */
async function handleRangeRequest(
  object: R2ObjectBody,
  rangeHeader: string,
  baseHeaders: Headers
): Promise<Response> {
  try {
    // Parse range header (e.g., "bytes=0-1023")
    const rangeMatch = rangeHeader.match(/bytes=(\d+)-(\d*)/);
    if (!rangeMatch) {
      return new Response('Invalid Range header', { status: 416 });
    }

    const start = parseInt(rangeMatch[1]);
    const end = rangeMatch[2] ? parseInt(rangeMatch[2]) : object.size - 1;

    // Validate range
    if (start >= object.size || end >= object.size || start > end) {
      return new Response('Range Not Satisfiable', { status: 416 });
    }

    // Fetch the range from R2
    const rangeObject = await object.range({ offset: start, length: end - start + 1 });

    if (!rangeObject) {
      return new Response('Range request failed', { status: 500 });
    }

    // Set range-specific headers
    const headers = new Headers(baseHeaders);
    headers.set('Content-Range', `bytes ${start}-${end}/${object.size}`);
    headers.set('Content-Length', (end - start + 1).toString());

    return new Response(rangeObject, {
      status: 206,
      headers
    });

  } catch (error) {
    console.error('Range request error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
