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

    :root {
      --primary-green: #1B5E20;
      --light-green: #4CAF50;
      --accent-green: #81C784;
      --pale-green: #E8F5E9;
      --white: #FFFFFF;
      --light-gray: #F5F5F5;
      --text-dark: #212121;
      --text-secondary: #616161;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      background: var(--white);
      min-height: 100vh;
      color: var(--text-dark);
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    header {
      text-align: center;
      padding: 3rem 0;
      background: linear-gradient(180deg, var(--pale-green) 0%, var(--white) 100%);
    }

    .logo {
      width: 140px;
      height: 140px;
      margin-bottom: 1.5rem;
      filter: drop-shadow(0 4px 15px rgba(27, 94, 32, 0.2));
    }

    h1 {
      font-size: 2.75rem;
      margin-bottom: 0.5rem;
      color: var(--primary-green);
      font-weight: 700;
    }

    .tagline {
      font-size: 1.2rem;
      color: var(--text-secondary);
      margin-bottom: 2rem;
    }

    .arabic {
      font-family: 'Traditional Arabic', 'Scheherazade', serif;
      font-size: 2.25rem;
      color: var(--primary-green);
      margin-bottom: 0.5rem;
      direction: rtl;
    }

    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
      gap: 2rem;
      margin-top: 2rem;
    }

    .card {
      background: var(--white);
      border: 1px solid #E0E0E0;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 30px rgba(27, 94, 32, 0.15);
    }

    .card h2 {
      font-size: 1.4rem;
      margin-bottom: 1rem;
      color: var(--primary-green);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .card p {
      color: var(--text-secondary);
      line-height: 1.7;
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
      font-size: 0.95rem;
    }

    .btn-primary {
      background: var(--primary-green);
      color: var(--white);
    }

    .btn-primary:hover {
      background: #2E7D32;
      transform: scale(1.02);
      box-shadow: 0 4px 15px rgba(27, 94, 32, 0.3);
    }

    .btn-secondary {
      background: var(--pale-green);
      color: var(--primary-green);
      border: 1px solid var(--accent-green);
    }

    .btn-secondary:hover {
      background: #C8E6C9;
    }

    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.5rem;
      margin-top: 3rem;
      padding: 2.5rem;
      background: var(--pale-green);
      border-radius: 16px;
    }

    .feature {
      text-align: center;
      padding: 1.5rem 1rem;
      background: var(--white);
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .feature-icon {
      font-size: 2.5rem;
      margin-bottom: 0.75rem;
    }

    .feature h3 {
      font-size: 1.15rem;
      margin-bottom: 0.5rem;
      color: var(--primary-green);
    }

    .feature p {
      color: var(--text-secondary);
      font-size: 0.9rem;
      line-height: 1.5;
    }

    .api-example {
      background: #263238;
      border-radius: 8px;
      padding: 1rem;
      margin-top: 1rem;
      overflow-x: auto;
    }

    .api-example code {
      color: #80CBC4;
      font-family: 'Fira Code', 'Consolas', monospace;
      font-size: 0.85rem;
    }

    footer {
      text-align: center;
      padding: 3rem 0;
      margin-top: 3rem;
      border-top: 1px solid #E0E0E0;
      color: var(--text-secondary);
    }

    footer a {
      color: var(--primary-green);
      text-decoration: none;
      font-weight: 500;
    }

    footer a:hover {
      text-decoration: underline;
    }

    .credits {
      margin-top: 1rem;
      font-size: 0.875rem;
    }

    .heart {
      color: #E53935;
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

      .features {
        padding: 1.5rem;
      }
    }
  </style>
</head>
<body>
  <header>
    <div class="container">
      <img src="/assets/logo.png" alt="Al Furqan Logo" class="logo">
      <p class="arabic">الفرقان</p>
      <h1>Al Furqan</h1>
      <p class="tagline">Listen to the Holy Quran with 44 world-renowned reciters</p>
    </div>
  </header>

  <div class="container">
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
          GitHub
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
      <p>Made with <span class="heart">❤️</span> for the Ummah</p>
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
 * Serve the privacy policy page
 */
export function handlePrivacyPage(): Response {
  const html = `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Privacy Policy - Al Furqan</title>
  <meta name="description" content="Privacy Policy for the Al Furqan Quran Audio App">
  <link rel="icon" type="image/png" href="/assets/logo.png">

  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    :root {
      --primary-green: #1B5E20;
      --light-green: #4CAF50;
      --accent-green: #81C784;
      --pale-green: #E8F5E9;
      --white: #FFFFFF;
      --text-dark: #212121;
      --text-secondary: #616161;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      background: var(--white);
      min-height: 100vh;
      color: var(--text-dark);
      line-height: 1.7;
    }

    .header {
      background: var(--pale-green);
      padding: 2rem;
      text-align: center;
      border-bottom: 1px solid #E0E0E0;
    }

    .header a {
      text-decoration: none;
      color: var(--primary-green);
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
    }

    .header img {
      width: 50px;
      height: 50px;
    }

    .header h1 {
      font-size: 1.5rem;
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 3rem 2rem;
    }

    h2 {
      color: var(--primary-green);
      font-size: 1.75rem;
      margin-bottom: 1.5rem;
      text-align: center;
    }

    .effective-date {
      text-align: center;
      color: var(--text-secondary);
      margin-bottom: 2rem;
      font-size: 0.95rem;
    }

    h3 {
      color: var(--primary-green);
      font-size: 1.25rem;
      margin-top: 2rem;
      margin-bottom: 1rem;
    }

    p {
      margin-bottom: 1rem;
      color: var(--text-dark);
    }

    ul {
      margin-bottom: 1rem;
      padding-left: 1.5rem;
    }

    li {
      margin-bottom: 0.5rem;
      color: var(--text-secondary);
    }

    .highlight {
      background: var(--pale-green);
      padding: 1.25rem;
      border-radius: 8px;
      margin: 1.5rem 0;
      border-left: 4px solid var(--primary-green);
    }

    .highlight p {
      margin-bottom: 0;
      color: var(--text-dark);
    }

    .contact {
      background: var(--light-green);
      color: var(--white);
      padding: 1.5rem;
      border-radius: 8px;
      margin-top: 2rem;
      text-align: center;
    }

    .contact h3 {
      color: var(--white);
      margin-top: 0;
    }

    .contact a {
      color: var(--white);
      font-weight: 600;
    }

    footer {
      text-align: center;
      padding: 2rem;
      border-top: 1px solid #E0E0E0;
      margin-top: 3rem;
      color: var(--text-secondary);
    }

    footer a {
      color: var(--primary-green);
      text-decoration: none;
    }

    @media (max-width: 768px) {
      .container {
        padding: 2rem 1rem;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <a href="/">
      <img src="/assets/logo.png" alt="Al Furqan Logo">
      <h1>Al Furqan</h1>
    </a>
  </div>

  <div class="container">
    <h2>Privacy Policy</h2>
    <p class="effective-date">Effective Date: November 14, 2025</p>

    <div class="highlight">
      <p><strong>Summary:</strong> Al Furqan is designed with privacy in mind. We do not collect, store, or share any personal information. The app works without requiring accounts, logins, or any identifying information.</p>
    </div>

    <h3>No Personal Data Collection</h3>
    <p>Al Furqan does not collect your name, email address, phone number, or any other contact details. You can use the app completely anonymously without creating an account or providing any personal information.</p>

    <h3>Permissions We Request</h3>
    <p>The application requests only standard Android permissions necessary for its core functionality:</p>
    <ul>
      <li><strong>Internet Access:</strong> Required for streaming Quran audio and fetching text content</li>
      <li><strong>Storage Access:</strong> Only used when you choose to download audio files for offline listening</li>
      <li><strong>Notification Permission:</strong> For audio playback controls, background playback, and prayer time alerts</li>
      <li><strong>Foreground Service:</strong> Enables continuous audio playback when the app is in the background</li>
      <li><strong>Location Access (Optional):</strong> Only requested if you enable the prayer times feature. Used solely to calculate accurate prayer times for your location. You can manually enter your city instead if you prefer not to share your location.</li>
    </ul>

    <h3>Prayer Times Feature</h3>
    <p>If you choose to use the prayer times feature, you may optionally grant location access. This permission is:</p>
    <ul>
      <li><strong>Completely optional</strong> - You can manually select your city instead</li>
      <li><strong>Used only locally</strong> - Your location is used to calculate prayer times on your device</li>
      <li><strong>Never transmitted</strong> - We do not send your location to any server or third party</li>
      <li><strong>Not stored</strong> - We do not keep a history of your location</li>
    </ul>

    <h3>Third-Party Services</h3>
    <p>The app retrieves Quran content from the following sources:</p>
    <ul>
      <li>Al-Quran Cloud API (for Quran text)</li>
      <li>Tanzil Project (for Quran metadata)</li>
      <li>EveryAyah.com (for audio recitations via our API)</li>
    </ul>
    <p>When you use the app, standard network information (such as your IP address) may be visible to these services. However, we do not access, store, or use this information for our own purposes.</p>

    <h3>Local Storage Only</h3>
    <p>When you download audio files for offline listening, these files are stored only on your device. We do not:</p>
    <ul>
      <li>Upload downloaded audio to our servers</li>
      <li>Track which surahs or recitations you download</li>
      <li>Sync your listening progress to any external service</li>
    </ul>

    <h3>No Tracking or Analytics</h3>
    <p>Al Furqan does not include any analytics, advertising SDKs, or tracking technologies. We do not:</p>
    <ul>
      <li>Track your listening habits or preferences</li>
      <li>Display advertisements</li>
      <li>Profile users in any way</li>
      <li>Share data with third parties for marketing purposes</li>
    </ul>

    <h3>Children's Privacy</h3>
    <p>Our app is suitable for users of all ages. Since we do not collect any personal information, there is no special risk to children's privacy.</p>

    <h3>Changes to This Policy</h3>
    <p>If we make any changes to this privacy policy, we will update the "Effective Date" at the top of this page. We encourage you to review this policy periodically.</p>

    <div class="contact">
      <h3>Contact Us</h3>
      <p>If you have any questions about this Privacy Policy, please contact us at:</p>
      <p><a href="mailto:privacy@cloudlinqed.com">privacy@cloudlinqed.com</a></p>
    </div>
  </div>

  <footer>
    <p><a href="/">← Back to Al Furqan</a></p>
  </footer>
</body>
</html>`;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
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
