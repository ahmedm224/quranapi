/**
 * Website landing page handler
 * Serves the main website at alfurqan.online
 */

export interface Env {
  QURAN_AUDIO_BUCKET: R2Bucket;
}

/**
 * Serve the landing page HTML
 */
export function handleLandingPage(): Response {
  const html = `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Al Furqan - Quran Audio API & App</title>
  <meta name="description" content="Free Quran Audio API with 44 reciters and 6,236 ayahs. Download our mobile app for offline listening.">
  <meta name="keywords" content="Quran, Audio, API, Reciters, Islamic, Muslim, Holy Quran, MP3">
  <link rel="icon" type="image/png" href="/assets/logo.png">

  <!-- Open Graph -->
  <meta property="og:title" content="Al Furqan - Quran Audio API & App">
  <meta property="og:description" content="Free Quran Audio API with 44 reciters and 6,236 ayahs.">
  <meta property="og:image" content="https://alfurqan.online/assets/logo.png">
  <meta property="og:url" content="https://alfurqan.online">

  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      min-height: 100vh;
      color: #fff;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    header {
      text-align: center;
      padding: 3rem 0;
    }

    .logo {
      width: 150px;
      height: 150px;
      margin-bottom: 1.5rem;
      filter: drop-shadow(0 4px 20px rgba(255, 215, 0, 0.3));
    }

    h1 {
      font-size: 3rem;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #ffd700, #ffed4a);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .tagline {
      font-size: 1.25rem;
      color: #a0aec0;
      margin-bottom: 2rem;
    }

    .arabic {
      font-family: 'Traditional Arabic', 'Scheherazade', serif;
      font-size: 2rem;
      color: #ffd700;
      margin-bottom: 1rem;
      direction: rtl;
    }

    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 2rem;
      margin-top: 3rem;
    }

    .card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 2rem;
      backdrop-filter: blur(10px);
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 40px rgba(255, 215, 0, 0.1);
    }

    .card h2 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: #ffd700;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .card p {
      color: #a0aec0;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.875rem 1.5rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s;
    }

    .btn-primary {
      background: linear-gradient(135deg, #ffd700, #ffed4a);
      color: #1a1a2e;
    }

    .btn-primary:hover {
      transform: scale(1.05);
      box-shadow: 0 5px 20px rgba(255, 215, 0, 0.4);
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-top: 3rem;
      padding: 2rem;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 16px;
    }

    .feature {
      text-align: center;
      padding: 1rem;
    }

    .feature-icon {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }

    .feature h3 {
      font-size: 1.25rem;
      margin-bottom: 0.5rem;
    }

    .feature p {
      color: #a0aec0;
      font-size: 0.9rem;
    }

    .api-example {
      background: #0d1117;
      border-radius: 8px;
      padding: 1rem;
      margin-top: 1rem;
      overflow-x: auto;
    }

    .api-example code {
      color: #79c0ff;
      font-family: 'Fira Code', monospace;
      font-size: 0.875rem;
    }

    footer {
      text-align: center;
      padding: 3rem 0;
      margin-top: 3rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      color: #a0aec0;
    }

    footer a {
      color: #ffd700;
      text-decoration: none;
    }

    .credits {
      margin-top: 1rem;
      font-size: 0.875rem;
    }

    @media (max-width: 768px) {
      h1 {
        font-size: 2rem;
      }

      .cards {
        grid-template-columns: 1fr;
      }

      .logo {
        width: 100px;
        height: 100px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <img src="/assets/logo.png" alt="Al Furqan Logo" class="logo">
      <p class="arabic">الفرقان</p>
      <h1>Al Furqan</h1>
      <p class="tagline">Listen to the Holy Quran with 44 world-renowned reciters</p>
    </header>

    <div class="cards">
      <div class="card">
        <h2>📱 Mobile App</h2>
        <p>
          Download our free Quran audio player app. Listen to the complete Quran
          with your favorite reciters, track your listening progress, and enjoy
          a beautiful, distraction-free experience.
        </p>
        <a href="https://play.google.com/store/apps/details?id=com.quranmedia.player"
           class="btn btn-primary" target="_blank" rel="noopener">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
          </svg>
          Get on Google Play
        </a>
      </div>

      <div class="card">
        <h2>🔌 Free API</h2>
        <p>
          Build your own Quran applications with our free, open API.
          Access audio streams for 6,236 ayahs from 44 reciters.
          No API key required. CORS enabled.
        </p>
        <a href="/api/v1/reciters" class="btn btn-primary">
          Explore API
        </a>
        <a href="https://github.com/ahmedm224/quranapi" class="btn btn-secondary"
           target="_blank" rel="noopener" style="margin-left: 0.5rem;">
          View on GitHub
        </a>
        <div class="api-example">
          <code>curl https://alfurqan.online/api/v1/audio/husary/1</code>
        </div>
      </div>
    </div>

    <div class="features">
      <div class="feature">
        <div class="feature-icon">🎙️</div>
        <h3>44 Reciters</h3>
        <p>World-renowned Quran reciters including Al-Husary, Abdul Basit, and more</p>
      </div>
      <div class="feature">
        <div class="feature-icon">📖</div>
        <h3>6,236 Ayahs</h3>
        <p>Complete Quran coverage from Al-Fatiha to An-Nas</p>
      </div>
      <div class="feature">
        <div class="feature-icon">⚡</div>
        <h3>Fast CDN</h3>
        <p>Powered by Cloudflare's global edge network</p>
      </div>
      <div class="feature">
        <div class="feature-icon">🆓</div>
        <h3>100% Free</h3>
        <p>No API keys, no registration, no limits</p>
      </div>
    </div>

    <footer>
      <p>Made with ❤️ for the Ummah</p>
      <p class="credits">
        Audio files sourced from <a href="https://everyayah.com" target="_blank">EveryAyah.com</a> ·
        Quran data from <a href="https://tanzil.net" target="_blank">Tanzil.net</a>
      </p>
    </footer>
  </div>
</body>
</html>`;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

/**
 * Serve static assets from R2 (logo, favicon, etc.)
 */
export async function handleAssetRequest(
  request: Request,
  env: Env,
  assetPath: string
): Promise<Response> {
  // Map asset paths to R2 keys
  const assetMap: Record<string, string> = {
    'logo.png': 'assets/logo.png',
    'favicon.ico': 'assets/logo.png',
  };

  const r2Key = assetMap[assetPath];
  if (!r2Key) {
    return new Response('Asset not found', { status: 404 });
  }

  try {
    const object = await env.QURAN_AUDIO_BUCKET.get(r2Key);

    if (!object) {
      return new Response('Asset not found', { status: 404 });
    }

    const contentType = assetPath.endsWith('.png')
      ? 'image/png'
      : assetPath.endsWith('.ico')
        ? 'image/x-icon'
        : 'application/octet-stream';

    return new Response(object.body, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': object.size.toString(),
      },
    });
  } catch (error) {
    return new Response('Error loading asset', { status: 500 });
  }
}
