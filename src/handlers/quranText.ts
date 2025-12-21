/**
 * Quran Text SVG Handler
 * Serves SVG pages of Quran text from R2 storage
 *
 * Data source: https://github.com/batoulapps/quran-svg
 * License: MIT
 */

export interface Env {
  QURAN_AUDIO_BUCKET: R2Bucket;
}

// Total pages in the Quran (Madani Mushaf)
const TOTAL_PAGES = 604;
const VERSION = '1.0.0';

/**
 * Get manifest/metadata for Quran text SVG files
 * Used by apps to check version and available pages
 */
export function handleManifest(): Response {
  return new Response(
    JSON.stringify({
      name: 'Quran Text SVG',
      version: VERSION,
      totalPages: TOTAL_PAGES,
      format: 'svg',
      source: {
        name: 'quran-svg',
        url: 'https://github.com/batoulapps/quran-svg',
        license: 'MIT',
        originalSource: 'King Fahd Quran Printing Complex'
      },
      endpoints: {
        page: '/api/v1/quran-text/page/:pageNumber',
        download: '/api/v1/quran-text/download'
      },
      pageRange: {
        first: 1,
        last: TOTAL_PAGES
      }
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=86400', // 24 hours
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}

/**
 * Get a single SVG page
 */
export async function handlePageRequest(
  request: Request,
  env: Env,
  pageNumber: string
): Promise<Response> {
  // Validate page number
  const page = parseInt(pageNumber, 10);

  if (isNaN(page) || page < 1 || page > TOTAL_PAGES) {
    return new Response(
      JSON.stringify({
        error: {
          message: `Invalid page number. Must be between 1 and ${TOTAL_PAGES}`,
          code: 'INVALID_PAGE_NUMBER'
        }
      }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }

  // Fetch from R2
  const r2Key = `quran-text/pages/${page}.svg`;
  const object = await env.QURAN_AUDIO_BUCKET.get(r2Key);

  if (!object) {
    return new Response(
      JSON.stringify({
        error: {
          message: `Page ${page} not found`,
          code: 'PAGE_NOT_FOUND'
        }
      }),
      {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }

  // Return SVG with proper headers
  return new Response(object.body, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Content-Length': object.size.toString(),
      'Cache-Control': 'public, max-age=31536000, immutable', // 1 year (pages don't change)
      'Access-Control-Allow-Origin': '*',
      'X-Page-Number': page.toString(),
      'X-Total-Pages': TOTAL_PAGES.toString(),
    },
  });
}

/**
 * Download complete Quran text bundle (ZIP)
 */
export async function handleDownloadRequest(
  request: Request,
  env: Env
): Promise<Response> {
  // Fetch the pre-packaged ZIP from R2
  const r2Key = 'quran-text/quran-pages.zip';
  const object = await env.QURAN_AUDIO_BUCKET.get(r2Key);

  if (!object) {
    return new Response(
      JSON.stringify({
        error: {
          message: 'Download bundle not available. Please download pages individually.',
          code: 'BUNDLE_NOT_FOUND',
          alternative: '/api/v1/quran-text/page/:pageNumber'
        }
      }),
      {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }

  // Return ZIP with proper headers for download
  return new Response(object.body, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Length': object.size.toString(),
      'Content-Disposition': 'attachment; filename="quran-pages.zip"',
      'Cache-Control': 'public, max-age=86400', // 24 hours
      'Access-Control-Allow-Origin': '*',
    },
  });
}
