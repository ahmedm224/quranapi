/**
 * Tafseer Handler
 * Serves Quran Tafseer (exegesis) and word meanings from R2 storage
 */

export interface Env {
  QURAN_AUDIO_BUCKET: R2Bucket;
}

const VERSION = '1.0.0';

// Available tafseers with their metadata
const TAFSEERS = {
  'word-by-word-english': {
    id: 'word-by-word-english',
    filename: 'word_by_word_english.json',
    zipFilename: 'word_by_word_english.zip',
    name_en: 'Word by Word Translation',
    name_ar: null,
    language: 'english',
    type: 'word-meanings',
    author: 'Quran.com',
    description: 'Arabic to English word-by-word meanings with transliteration'
  },
  'mufradat': {
    id: 'mufradat',
    filename: 'quran_mufradat.json',
    zipFilename: 'quran_mufradat.zip',
    name_en: 'Quran Mufradat',
    name_ar: 'مفردات القرآن',
    language: 'arabic',
    type: 'word-meanings',
    author: 'Al-Raghib al-Isfahani',
    description: 'Arabic to Arabic word meanings and vocabulary'
  },
  'ibn-kathir-english': {
    id: 'ibn-kathir-english',
    filename: 'tafseer_ibn_kathir_english.json',
    zipFilename: 'tafseer_ibn_kathir_english.zip',
    name_en: 'Tafsir Ibn Kathir',
    name_ar: 'تفسير ابن كثير',
    language: 'english',
    type: 'tafseer',
    author: 'Ibn Kathir',
    description: 'English translation of Tafsir Ibn Kathir'
  },
  'maarif-ul-quran': {
    id: 'maarif-ul-quran',
    filename: 'tafseer_maarif_ul_quran_english.json',
    zipFilename: 'tafseer_maarif_ul_quran_english.zip',
    name_en: "Ma'ariful Quran",
    name_ar: 'معارف القرآن',
    language: 'english',
    type: 'tafseer',
    author: 'Mufti Muhammad Shafi',
    description: "English translation of Ma'ariful Quran"
  },
  'al-saddi': {
    id: 'al-saddi',
    filename: 'tafseer_tafseer-al-saddi.json',
    zipFilename: 'tafseer_tafseer-al-saddi.zip',
    name_en: 'Tafsir Al-Saddi',
    name_ar: 'تفسير السعدي',
    language: 'arabic',
    type: 'tafseer',
    author: 'Abdur Rahman Al-Saddi',
    description: 'Arabic tafseer by Shaykh Al-Saddi'
  },
  'al-tabari': {
    id: 'al-tabari',
    filename: 'tafseer_tafsir-al-tabari.json',
    zipFilename: 'tafseer_tafsir-al-tabari.zip',
    name_en: 'Tafsir Al-Tabari',
    name_ar: 'تفسير الطبري',
    language: 'arabic',
    type: 'tafseer',
    author: 'Ibn Jarir Al-Tabari',
    description: 'Arabic tafseer by Imam Al-Tabari'
  },
  'ibn-kathir': {
    id: 'ibn-kathir',
    filename: 'tafseer_tafsir-ibn-kathir.json',
    zipFilename: 'tafseer_tafsir-ibn-kathir.zip',
    name_en: 'Tafsir Ibn Kathir',
    name_ar: 'تفسير ابن كثير',
    language: 'arabic',
    type: 'tafseer',
    author: 'Ibn Kathir',
    description: 'Arabic tafseer by Ibn Kathir'
  },
  'muyassar': {
    id: 'muyassar',
    filename: 'tafseer_tafsir-muyassar.json',
    zipFilename: 'tafseer_tafsir-muyassar.zip',
    name_en: 'Al-Tafsir Al-Muyassar',
    name_ar: 'التفسير الميسر',
    language: 'arabic',
    type: 'tafseer',
    author: 'King Fahd Complex',
    description: 'Simplified Arabic tafseer'
  }
};

/**
 * Get manifest/list of all available tafseers
 */
export function handleTafseerManifest(): Response {
  const tafseers = Object.values(TAFSEERS).map(t => ({
    id: t.id,
    name_en: t.name_en,
    name_ar: t.name_ar,
    language: t.language,
    type: t.type,
    author: t.author,
    description: t.description
  }));

  return new Response(
    JSON.stringify({
      name: 'Quran Tafseer API',
      version: VERSION,
      total: tafseers.length,
      types: {
        tafseer: tafseers.filter(t => t.type === 'tafseer').length,
        'word-meanings': tafseers.filter(t => t.type === 'word-meanings').length
      },
      languages: {
        arabic: tafseers.filter(t => t.language === 'arabic').length,
        english: tafseers.filter(t => t.language === 'english').length
      },
      tafseers,
      endpoints: {
        manifest: '/api/v1/tafseer/manifest',
        list: '/api/v1/tafseer/list',
        tafseer: '/api/v1/tafseer/:tafseerId',
        surah: '/api/v1/tafseer/:tafseerId/surah/:surahNumber',
        ayah: '/api/v1/tafseer/:tafseerId/surah/:surahNumber/ayah/:ayahNumber',
        downloads: '/api/v1/tafseer/downloads',
        download: '/api/v1/tafseer/download/:tafseerId'
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
 * Get list of tafseers (simpler format)
 */
export function handleTafseerList(): Response {
  const tafseers = Object.values(TAFSEERS).map(t => ({
    id: t.id,
    name_en: t.name_en,
    name_ar: t.name_ar,
    language: t.language,
    type: t.type
  }));

  return new Response(
    JSON.stringify({
      count: tafseers.length,
      tafseers
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
 * Get full tafseer file (metadata only or full download)
 */
export async function handleTafseerInfo(
  request: Request,
  env: Env,
  tafseerId: string
): Promise<Response> {
  const tafseer = TAFSEERS[tafseerId as keyof typeof TAFSEERS];

  if (!tafseer) {
    return new Response(
      JSON.stringify({
        error: {
          message: `Tafseer '${tafseerId}' not found`,
          code: 'TAFSEER_NOT_FOUND',
          available: Object.keys(TAFSEERS)
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

  // Return tafseer info with endpoint hints
  return new Response(
    JSON.stringify({
      ...tafseer,
      endpoints: {
        surah: `/api/v1/tafseer/${tafseerId}/surah/:surahNumber`,
        ayah: `/api/v1/tafseer/${tafseerId}/surah/:surahNumber/ayah/:ayahNumber`
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
 * Get tafseer for a specific surah
 */
export async function handleTafseerSurah(
  request: Request,
  env: Env,
  tafseerId: string,
  surahNumber: string
): Promise<Response> {
  const tafseer = TAFSEERS[tafseerId as keyof typeof TAFSEERS];

  if (!tafseer) {
    return new Response(
      JSON.stringify({
        error: {
          message: `Tafseer '${tafseerId}' not found`,
          code: 'TAFSEER_NOT_FOUND',
          available: Object.keys(TAFSEERS)
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

  const surah = parseInt(surahNumber, 10);
  if (isNaN(surah) || surah < 1 || surah > 114) {
    return new Response(
      JSON.stringify({
        error: {
          message: 'Invalid surah number. Must be between 1 and 114',
          code: 'INVALID_SURAH_NUMBER'
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
  const r2Key = `assets/Tafseer/${tafseer.filename}`;
  const object = await env.QURAN_AUDIO_BUCKET.get(r2Key);

  if (!object) {
    return new Response(
      JSON.stringify({
        error: {
          message: 'Tafseer data not found',
          code: 'DATA_NOT_FOUND'
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

  try {
    const data = await object.json() as any;
    const surahData = data.surahs?.find((s: any) => s.surah_id === surah);

    if (!surahData) {
      return new Response(
        JSON.stringify({
          error: {
            message: `Surah ${surah} not found in this tafseer`,
            code: 'SURAH_NOT_FOUND'
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

    return new Response(
      JSON.stringify({
        tafseer: {
          id: tafseer.id,
          name_en: tafseer.name_en,
          name_ar: tafseer.name_ar,
          language: tafseer.language
        },
        surah: {
          number: surahData.surah_id,
          name: surahData.surah_name,
          ayahs: surahData.ayahs
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
  } catch (e) {
    return new Response(
      JSON.stringify({
        error: {
          message: 'Failed to parse tafseer data',
          code: 'PARSE_ERROR'
        }
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}

/**
 * Get tafseer for a specific ayah
 */
export async function handleTafseerAyah(
  request: Request,
  env: Env,
  tafseerId: string,
  surahNumber: string,
  ayahNumber: string
): Promise<Response> {
  const tafseer = TAFSEERS[tafseerId as keyof typeof TAFSEERS];

  if (!tafseer) {
    return new Response(
      JSON.stringify({
        error: {
          message: `Tafseer '${tafseerId}' not found`,
          code: 'TAFSEER_NOT_FOUND',
          available: Object.keys(TAFSEERS)
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

  const surah = parseInt(surahNumber, 10);
  const ayah = parseInt(ayahNumber, 10);

  if (isNaN(surah) || surah < 1 || surah > 114) {
    return new Response(
      JSON.stringify({
        error: {
          message: 'Invalid surah number. Must be between 1 and 114',
          code: 'INVALID_SURAH_NUMBER'
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

  if (isNaN(ayah) || ayah < 1) {
    return new Response(
      JSON.stringify({
        error: {
          message: 'Invalid ayah number',
          code: 'INVALID_AYAH_NUMBER'
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
  const r2Key = `assets/Tafseer/${tafseer.filename}`;
  const object = await env.QURAN_AUDIO_BUCKET.get(r2Key);

  if (!object) {
    return new Response(
      JSON.stringify({
        error: {
          message: 'Tafseer data not found',
          code: 'DATA_NOT_FOUND'
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

  try {
    const data = await object.json() as any;
    const surahData = data.surahs?.find((s: any) => s.surah_id === surah);

    if (!surahData) {
      return new Response(
        JSON.stringify({
          error: {
            message: `Surah ${surah} not found in this tafseer`,
            code: 'SURAH_NOT_FOUND'
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

    const ayahData = surahData.ayahs?.find((a: any) => a.ayah === ayah);

    if (!ayahData) {
      return new Response(
        JSON.stringify({
          error: {
            message: `Ayah ${ayah} not found in surah ${surah}`,
            code: 'AYAH_NOT_FOUND'
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

    return new Response(
      JSON.stringify({
        tafseer: {
          id: tafseer.id,
          name_en: tafseer.name_en,
          name_ar: tafseer.name_ar,
          language: tafseer.language
        },
        surah: {
          number: surahData.surah_id,
          name: surahData.surah_name
        },
        ayah: ayahData
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=86400',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({
        error: {
          message: 'Failed to parse tafseer data',
          code: 'PARSE_ERROR'
        }
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}

/**
 * Download a tafseer as ZIP archive
 */
export async function handleTafseerDownload(
  request: Request,
  env: Env,
  tafseerId: string
): Promise<Response> {
  const tafseer = TAFSEERS[tafseerId as keyof typeof TAFSEERS];

  if (!tafseer) {
    return new Response(
      JSON.stringify({
        error: {
          message: `Tafseer '${tafseerId}' not found`,
          code: 'TAFSEER_NOT_FOUND',
          available: Object.keys(TAFSEERS)
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

  if (!tafseer.zipFilename) {
    return new Response(
      JSON.stringify({
        error: {
          message: `ZIP download not available for '${tafseerId}'`,
          code: 'ZIP_NOT_AVAILABLE'
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

  const r2Key = `assets/Tafseer/${tafseer.zipFilename}`;
  const object = await env.QURAN_AUDIO_BUCKET.get(r2Key);

  if (!object) {
    return new Response(
      JSON.stringify({
        error: {
          message: 'ZIP file not found',
          code: 'FILE_NOT_FOUND'
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

  const headers = new Headers();
  headers.set('Content-Type', 'application/zip');
  headers.set('Content-Disposition', `attachment; filename="${tafseer.zipFilename}"`);
  headers.set('Cache-Control', 'public, max-age=31536000');
  headers.set('Access-Control-Allow-Origin', '*');

  if (object.size) {
    headers.set('Content-Length', object.size.toString());
  }

  return new Response(object.body, { headers });
}

/**
 * List all available tafseer downloads
 */
export function handleTafseerDownloadList(): Response {
  const downloads = Object.values(TAFSEERS)
    .filter(t => t.zipFilename)
    .map(t => ({
      id: t.id,
      name_en: t.name_en,
      name_ar: t.name_ar,
      language: t.language,
      type: t.type,
      download_url: `/api/v1/tafseer/download/${t.id}`
    }));

  return new Response(
    JSON.stringify({
      count: downloads.length,
      downloads
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
