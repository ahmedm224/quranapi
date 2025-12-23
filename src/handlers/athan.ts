/**
 * Athan (Adhan) Audio Handler
 * Serves athan audio files from R2 storage
 *
 * Data source: https://www.assabile.com
 */

export interface Env {
  QURAN_AUDIO_BUCKET: R2Bucket;
}

const VERSION = '1.0.0';

// Athan recordings with metadata
interface Athan {
  id: string;
  name: string;
  muezzin: string;
  location: string;
}

const ATHANS: Athan[] = [
  // Named Muezzins
  { id: '1a014366658c', name: 'Abdulbasit Abdusamad', muezzin: 'Abdulbasit Abdusamad', location: 'Egypt' },
  { id: '54944191e2e2', name: 'Ali Ibn Ahmad Mala', muezzin: 'Ali Ibn Ahmad Mala', location: 'Mecca, Saudi Arabia' },
  { id: 'f5370aa1a7e2', name: 'Yasser Al-Dosari', muezzin: 'Yasser Al-Dosari', location: 'Saudi Arabia' },
  { id: '8c052a5edec1', name: 'Ahmed El Kourdi', muezzin: 'Ahmed El Kourdi', location: 'Egypt' },
  { id: 'cd17c7200df5', name: 'Muhammad Al Damradash', muezzin: 'Muhammad Al Damradash', location: 'Egypt' },
  { id: '0bf83c80b583', name: 'Rabeh Ibn Darah Al Jazairi', muezzin: 'Rabeh Ibn Darah Al Jazairi', location: 'Algeria' },
  { id: '45299e6a8a68', name: 'Nasser Al Obaid', muezzin: 'Nasser Al Obaid', location: 'Saudi Arabia' },
  { id: 'e6ced81e9955', name: 'Nasser Al Obaid 2', muezzin: 'Nasser Al Obaid', location: 'Saudi Arabia' },
  { id: '495dea4f4ea5', name: 'Hamza Al Majale', muezzin: 'Hamza Al Majale', location: 'Jordan' },
  { id: 'c5c12e0cdba9', name: 'Al Duqale Muhammad Al Alam', muezzin: 'Al Duqale Muhammad Al Alam', location: 'Unknown' },
  { id: '8bd66fa73ff9', name: 'Mohammed Salahuddin Kabbara', muezzin: 'Mohammed Salahuddin Kabbara', location: 'Lebanon' },
  { id: 'c3460e1ab635', name: 'Abdel Moneim Abdel Mobdi', muezzin: 'Abdel Moneim Abdel Mobdi', location: 'Egypt' },
  { id: 'af79859edca6', name: 'Abdulah Al Maknawe', muezzin: 'Abdulah Al Maknawe', location: 'Unknown' },
  { id: '3d8ef25160a8', name: 'Akhdam Bnu Al Madane', muezzin: 'Akhdam Bnu Al Madane', location: 'Unknown' },
  { id: '290f81d9a73b', name: 'Tareq Fathe Ahmad', muezzin: 'Tareq Fathe Ahmad', location: 'Unknown' },

  // Additional athans
  { id: 'f30b7631d625', name: 'Ahmed Al-Haddad', muezzin: 'Ahmed Al-Haddad', location: 'Unknown' },
  { id: '8e9025f379f2', name: 'Mahammud Al-Najjar', muezzin: 'Mahammud Al-Najjar', location: 'Unknown' },
  { id: '8ea93508d061', name: 'Samer Al-Sagheer', muezzin: 'Samer Al-Sagheer', location: 'Unknown' },
  { id: 'edc62005fb50', name: 'Belbashir AbdulKader', muezzin: 'Belbashir AbdulKader', location: 'Unknown' },
  { id: '6df79edd050f', name: 'Mohammed Ibrahim', muezzin: 'Mohammed Ibrahim', location: 'Unknown' },
  { id: '651e00a18442', name: 'Ezzedine Amarna', muezzin: 'Ezzedine Amarna', location: 'Unknown' },
  { id: '525b55254e29', name: 'Badii Jadoo 1', muezzin: 'Badii Jadoo', location: 'Unknown' },
  { id: 'f0c14e23d534', name: 'Badii Jadoo 2', muezzin: 'Badii Jadoo', location: 'Unknown' },
  { id: '097fd8491db6', name: 'Zayed Al-Attia', muezzin: 'Zayed Al-Attia', location: 'Unknown' },
  { id: '12cd996ece7f', name: 'Islam Yassin', muezzin: 'Islam Yassin', location: 'Unknown' },
  { id: 'a56ded8b4a29', name: 'Athan 26', muezzin: 'Unknown', location: 'Unknown' },
  { id: '08008b8fec6c', name: 'Eisaa Al-Haglawy', muezzin: 'Eisaa Al-Haglawy', location: 'Unknown' },
  { id: '83e17f5db5a7', name: 'Mohamed Abdelbaeth', muezzin: 'Mohamed Abdelbaeth', location: 'Unknown' },
  { id: '7a837173da2c', name: 'Mohammed Abdelhakeem', muezzin: 'Mohammed Abdelhakeem', location: 'Unknown' },
  { id: 'cb51ad2c0c7e', name: 'Mansour Zahrany', muezzin: 'Mansour Zahrany', location: 'Unknown' },
  { id: 'e9bb86af0d30', name: 'Mohamed Ramadan Saad', muezzin: 'Mohamed Ramadan Saad', location: 'Unknown' },
  { id: 'd55c09c3357c', name: 'Fayez AbdulSalam', muezzin: 'Fayez AbdulSalam', location: 'Unknown' },
];

/**
 * Get manifest/metadata for athan audio
 */
export function handleAthanManifest(): Response {
  return new Response(
    JSON.stringify({
      name: 'Athan Audio Collection',
      version: VERSION,
      totalAthans: ATHANS.length,
      source: {
        name: 'Assabile',
        url: 'https://www.assabile.com',
        attribution: 'Audio files sourced from Assabile.com'
      },
      endpoints: {
        list: '/api/v1/athan/list',
        audio: '/api/v1/athan/:id',
        download: '/api/v1/athan/download'
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
 * Get list of all muezzins
 */
export function handleMuezzinsList(): Response {
  // Get unique muezzins with athan counts
  const muezzinMap = new Map<string, { name: string; location: string; count: number }>();

  ATHANS.forEach(a => {
    if (a.muezzin !== 'Unknown') {
      const existing = muezzinMap.get(a.muezzin);
      if (existing) {
        existing.count++;
      } else {
        muezzinMap.set(a.muezzin, { name: a.muezzin, location: a.location, count: 1 });
      }
    }
  });

  const muezzins = Array.from(muezzinMap.values()).sort((a, b) => b.count - a.count);

  return new Response(
    JSON.stringify({
      count: muezzins.length,
      muezzins
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}

/**
 * Get list of athans with optional filtering
 */
export function handleAthanList(request: Request): Response {
  const url = new URL(request.url);
  const muezzin = url.searchParams.get('muezzin');
  const location = url.searchParams.get('location');

  let filtered = [...ATHANS];

  if (muezzin) {
    filtered = filtered.filter(a => a.muezzin.toLowerCase().includes(muezzin.toLowerCase()));
  }
  if (location) {
    filtered = filtered.filter(a => a.location.toLowerCase().includes(location.toLowerCase()));
  }

  return new Response(
    JSON.stringify({
      count: filtered.length,
      athans: filtered.map(a => ({
        id: a.id,
        name: a.name,
        muezzin: a.muezzin,
        location: a.location,
        audioUrl: `/api/v1/athan/${a.id}`
      }))
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}

/**
 * Stream athan audio
 */
export async function handleAthanAudio(
  request: Request,
  env: Env,
  athanId: string
): Promise<Response> {
  const athan = ATHANS.find(a => a.id === athanId);

  if (!athan) {
    return new Response(
      JSON.stringify({
        error: {
          message: 'Athan not found',
          code: 'NOT_FOUND'
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

  // Fetch from R2
  const r2Key = `athan/${athanId}.mp3`;
  const object = await env.QURAN_AUDIO_BUCKET.get(r2Key);

  if (!object) {
    return new Response(
      JSON.stringify({
        error: {
          message: 'Audio file not available',
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

  // Return audio with proper headers
  return new Response(object.body, {
    headers: {
      'Content-Type': 'audio/mpeg',
      'Content-Length': object.size.toString(),
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Access-Control-Allow-Origin': '*',
      'X-Athan-Id': athanId,
      'X-Muezzin': athan.muezzin,
      'X-Location': athan.location,
    },
  });
}

/**
 * Download complete athan bundle (ZIP)
 */
export async function handleAthanDownload(
  request: Request,
  env: Env
): Promise<Response> {
  const r2Key = 'athan/athan-collection.zip';
  const object = await env.QURAN_AUDIO_BUCKET.get(r2Key);

  if (!object) {
    return new Response(
      JSON.stringify({
        error: {
          message: 'Download bundle not available',
          code: 'BUNDLE_NOT_FOUND'
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
      'Content-Type': 'application/zip',
      'Content-Length': object.size.toString(),
      'Content-Disposition': 'attachment; filename="athan-collection.zip"',
      'Cache-Control': 'public, max-age=86400',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
