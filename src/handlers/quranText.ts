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
const FONTS_VERSION = '1.0.0';

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
 * Get a single text page (JSON with ayahs)
 * This serves local Quran text data from R2 instead of external API
 */
export async function handleTextPageRequest(
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

  // Fetch from R2 - individual page JSON
  const r2Key = `assets/quran-text/pages/${page}.json`;
  const object = await env.QURAN_AUDIO_BUCKET.get(r2Key);

  if (!object) {
    return new Response(
      JSON.stringify({
        error: {
          message: `Page ${page} text not found. Please run the download-quran-text script.`,
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

  // Return JSON with proper headers
  return new Response(object.body, {
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': object.size.toString(),
      'Cache-Control': 'public, max-age=31536000, immutable', // 1 year (text doesn't change)
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

/**
 * ============================================
 * QCF FONTS API - Quran Complex Fonts
 * ============================================
 * Serves QCF page fonts for Mushaf rendering
 * - V4: Tajweed fonts with COLRv1 color layers
 * - V2: Plain fonts with customizable text color
 */

/**
 * Get manifest/metadata for QCF fonts
 */
export function handleFontsManifest(): Response {
  return new Response(
    JSON.stringify({
      name: 'Quran Complex Fonts (QCF)',
      version: FONTS_VERSION,
      totalPages: TOTAL_PAGES,
      fonts: {
        v4: {
          name: 'QCF V4 - Tajweed',
          description: 'COLRv1 fonts with embedded Tajweed color layers. Colors cannot be overridden.',
          format: 'ttf',
          source: 'https://verses.quran.foundation/fonts/quran/hafs/v4/ttf/',
          glyphCodes: 'qpcV2',
          totalSize: '~120MB',
          endpoint: '/api/v1/quran-fonts/v4/:pageNumber'
        },
        v2: {
          name: 'QCF V2 - Plain',
          description: 'Plain black fonts that accept text color customization via CSS/styling.',
          format: 'ttf',
          source: 'https://github.com/nuqayah/qpc-fonts/tree/master/mushaf-v2',
          glyphCodes: 'qpcV2',
          totalSize: '~80MB',
          endpoint: '/api/v1/quran-fonts/v2/:pageNumber'
        }
      },
      layout: {
        name: 'Mushaf Layout',
        description: 'Pre-computed line/word layout with qpcV1 and qpcV2 glyph codes for each page',
        format: 'json',
        source: 'https://github.com/zonetecde/mushaf-layout',
        endpoint: '/api/v1/quran-fonts/layout/:pageNumber'
      },
      endpoints: {
        manifest: '/api/v1/quran-fonts/manifest',
        v4Font: '/api/v1/quran-fonts/v4/:pageNumber',
        v2Font: '/api/v1/quran-fonts/v2/:pageNumber',
        layout: '/api/v1/quran-fonts/layout/:pageNumber'
      },
      pageRange: {
        first: 1,
        last: TOTAL_PAGES
      },
      usage: {
        wordSpacing: 'Words in layout JSON must be joined with SPACE character, not empty string',
        basmala: 'Basmala lines have incorrect qpcV2 codes - use Arabic Unicode fallback: بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ',
        glyphCodes: 'Both V4 and V2 fonts use qpcV2 glyph codes (not qpcV1)',
        colorOverride: 'V4 Tajweed colors are embedded and cannot be overridden. Use V2 for custom colors.'
      }
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=86400',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}

/**
 * Get a single V4 Tajweed font file (TTF)
 */
export async function handleV4FontRequest(
  request: Request,
  env: Env,
  pageNumber: string
): Promise<Response> {
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

  // Fetch from R2 - V4 Tajweed fonts
  const r2Key = `assets/quran-fonts/v4/p${page}.ttf`;
  const object = await env.QURAN_AUDIO_BUCKET.get(r2Key);

  if (!object) {
    return new Response(
      JSON.stringify({
        error: {
          message: `Font for page ${page} not found`,
          code: 'FONT_NOT_FOUND'
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

  return new Response(object.body, {
    headers: {
      'Content-Type': 'font/ttf',
      'Content-Length': object.size.toString(),
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Access-Control-Allow-Origin': '*',
      'X-Page-Number': page.toString(),
      'X-Font-Version': 'v4-tajweed',
    },
  });
}

/**
 * Get a single V2 Plain font file (TTF)
 */
export async function handleV2FontRequest(
  request: Request,
  env: Env,
  pageNumber: string
): Promise<Response> {
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

  // Fetch from R2 - V2 Plain fonts
  const r2Key = `assets/quran-fonts/v2/p${page}.ttf`;
  const object = await env.QURAN_AUDIO_BUCKET.get(r2Key);

  if (!object) {
    return new Response(
      JSON.stringify({
        error: {
          message: `Font for page ${page} not found`,
          code: 'FONT_NOT_FOUND'
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

  return new Response(object.body, {
    headers: {
      'Content-Type': 'font/ttf',
      'Content-Length': object.size.toString(),
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Access-Control-Allow-Origin': '*',
      'X-Page-Number': page.toString(),
      'X-Font-Version': 'v2-plain',
    },
  });
}

/**
 * Get mushaf layout JSON for a page
 */
export async function handleLayoutRequest(
  request: Request,
  env: Env,
  pageNumber: string
): Promise<Response> {
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

  // Fetch from R2 - Layout JSON files (page-001.json format)
  const paddedPage = page.toString().padStart(3, '0');
  const r2Key = `assets/quran-fonts/layouts/page-${paddedPage}.json`;
  const object = await env.QURAN_AUDIO_BUCKET.get(r2Key);

  if (!object) {
    return new Response(
      JSON.stringify({
        error: {
          message: `Layout for page ${page} not found`,
          code: 'LAYOUT_NOT_FOUND'
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

  return new Response(object.body, {
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': object.size.toString(),
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Access-Control-Allow-Origin': '*',
      'X-Page-Number': page.toString(),
    },
  });
}
