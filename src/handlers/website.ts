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
  <title>الفرقان - تطبيق القرآن الكريم | Al Furqan - Quran App</title>
  <meta name="description" content="تطبيق القرآن الكريم مع مواقيت الصلاة والأذان والأذكار و44 قارئ. Free Quran app with Prayer Times, Athan, Athkar & 44 reciters.">
  <meta name="keywords" content="القرآن الكريم, مواقيت الصلاة, الأذان, أذكار, تطبيق إسلامي, Quran App, Prayer Times, Athan, Athkar, Islamic App, Quran API">
  <meta name="author" content="Al Furqan - الفرقان">
  <meta name="robots" content="index, follow">
  <meta name="googlebot" content="index, follow">
  <link rel="canonical" href="https://alfurqan.online/">
  <link rel="icon" type="image/png" href="/assets/logo.png">
  <link rel="apple-touch-icon" href="/assets/logo.png">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="الفرقان - Al Furqan">
  <meta property="og:title" content="الفرقان - تطبيق القرآن الكريم | Al Furqan - Quran App">
  <meta property="og:description" content="تطبيق القرآن مع مواقيت الصلاة والأذان. Free Quran app with Prayer Times & Athan.">
  <meta property="og:image" content="https://alfurqan.online/assets/logo.png">
  <meta property="og:image:width" content="512">
  <meta property="og:image:height" content="512">
  <meta property="og:url" content="https://alfurqan.online">
  <meta property="og:locale" content="ar_SA">
  <meta property="og:locale:alternate" content="en_US">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="الفرقان - تطبيق القرآن | Al Furqan - Quran App">
  <meta name="twitter:description" content="تطبيق القرآن مع مواقيت الصلاة والأذان. Free Quran app with Prayer Times & Athan.">
  <meta name="twitter:image" content="https://alfurqan.online/assets/logo.png">

  <!-- Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "الفرقان - Al Furqan",
    "alternateName": "Al Furqan Quran App",
    "description": "تطبيق القرآن الكريم مع مواقيت الصلاة والأذان. Free Quran app with Prayer Times, Athan, and Athkar",
    "url": "https://alfurqan.online",
    "applicationCategory": "ReligiousApplication",
    "operatingSystem": "Android",
    "inLanguage": ["ar", "en"],
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "author": {
      "@type": "Organization",
      "name": "Al Furqan"
    }
  }
  </script>

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

    html, body {
      height: 100%;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      background: var(--white);
      color: var(--text-dark);
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 1.5rem;
      max-width: 1100px;
      margin: 0 auto;
      width: 100%;
    }

    header {
      text-align: center;
      padding: 1.5rem 0;
    }

    .logo {
      width: 100px;
      height: 100px;
      filter: drop-shadow(0 4px 12px rgba(27, 94, 32, 0.2));
      margin-bottom: 1rem;
    }

    .arabic {
      font-family: 'Traditional Arabic', 'Scheherazade', serif;
      font-size: 2rem;
      color: var(--primary-green);
      margin-bottom: 0.25rem;
    }

    h1 {
      font-size: 2rem;
      color: var(--primary-green);
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .tagline {
      font-size: 1rem;
      color: var(--text-secondary);
    }

    .content-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.25rem;
      margin-top: 1.25rem;
    }

    .app-section {
      background: linear-gradient(135deg, var(--pale-green) 0%, #C8E6C9 100%);
      border-radius: 12px;
      padding: 1.25rem;
    }

    .app-section h2 {
      font-size: 1.1rem;
      color: var(--primary-green);
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .feature {
      background: var(--white);
      border-radius: 8px;
      padding: 0.75rem 0.5rem;
      text-align: center;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
    }

    .feature-icon {
      font-size: 1.5rem;
      margin-bottom: 0.25rem;
    }

    .feature h3 {
      font-size: 0.8rem;
      color: var(--primary-green);
      margin-bottom: 0.15rem;
    }

    .feature p {
      font-size: 0.7rem;
      color: var(--text-secondary);
      line-height: 1.3;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
      padding: 0.6rem 1rem;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.2s;
      font-size: 0.85rem;
    }

    .btn-primary {
      background: var(--primary-green);
      color: var(--white);
    }

    .btn-primary:hover {
      background: #2E7D32;
      transform: scale(1.02);
    }

    .btn-secondary {
      background: var(--white);
      color: var(--primary-green);
      border: 1px solid var(--accent-green);
    }

    .btn-secondary:hover {
      background: var(--pale-green);
    }

    .app-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .api-section {
      background: var(--white);
      border: 1px solid #E0E0E0;
      border-radius: 12px;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
    }

    .api-section h2 {
      font-size: 1.1rem;
      color: var(--primary-green);
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .api-section > p {
      font-size: 0.85rem;
      color: var(--text-secondary);
      line-height: 1.5;
      margin-bottom: 0.75rem;
    }

    .api-highlights {
      display: flex;
      gap: 1rem;
      margin-bottom: 0.75rem;
      flex-wrap: wrap;
    }

    .api-highlight {
      font-size: 0.75rem;
      color: var(--text-secondary);
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .api-highlight strong {
      color: var(--primary-green);
    }

    .api-example {
      background: #263238;
      border-radius: 6px;
      padding: 0.6rem 0.75rem;
      margin-bottom: 0.75rem;
      overflow-x: auto;
    }

    .api-example code {
      color: #80CBC4;
      font-family: 'Fira Code', 'Consolas', monospace;
      font-size: 0.75rem;
    }

    .api-buttons {
      display: flex;
      gap: 0.5rem;
      margin-top: auto;
    }

    footer {
      text-align: center;
      padding: 0.75rem;
      border-top: 1px solid #E0E0E0;
      color: var(--text-secondary);
      font-size: 0.75rem;
    }

    footer a {
      color: var(--primary-green);
      text-decoration: none;
    }

    footer a:hover {
      text-decoration: underline;
    }

    .footer-links {
      margin-bottom: 0.25rem;
    }

    @media (max-width: 768px) {
      .main-content {
        padding: 1.25rem;
        justify-content: flex-start;
      }

      header {
        padding: 1rem 0;
      }

      .logo {
        width: 80px;
        height: 80px;
        margin-bottom: 0.75rem;
      }

      h1 {
        font-size: 1.5rem;
      }

      .arabic {
        font-size: 1.5rem;
      }

      .tagline {
        font-size: 0.9rem;
      }

      .content-grid {
        grid-template-columns: 1fr;
        gap: 1.25rem;
        margin-top: 1.5rem;
      }

      .app-section, .api-section {
        padding: 1.25rem;
      }

      .app-section h2, .api-section h2 {
        font-size: 1.15rem;
        margin-bottom: 1rem;
      }

      .features-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 0.75rem;
        margin-bottom: 1.25rem;
      }

      .feature {
        padding: 0.75rem 0.5rem;
      }

      .feature-icon {
        font-size: 1.5rem;
        margin-bottom: 0.4rem;
      }

      .feature h3 {
        font-size: 0.75rem;
      }

      .feature p {
        font-size: 0.65rem;
      }

      .btn {
        padding: 0.75rem 1rem;
        font-size: 0.9rem;
      }

      .app-buttons, .api-buttons {
        flex-direction: column;
      }

      .app-buttons .btn, .api-buttons .btn {
        width: 100%;
      }

      .api-section > p {
        font-size: 0.9rem;
        margin-bottom: 1rem;
      }

      .api-highlights {
        gap: 0.75rem;
        margin-bottom: 1rem;
      }

      .api-highlight {
        font-size: 0.8rem;
      }

      .api-example {
        padding: 0.75rem;
        margin-bottom: 1rem;
      }

      .api-example code {
        font-size: 0.7rem;
      }

      footer {
        padding: 1rem;
        font-size: 0.8rem;
      }
    }

    @media (max-width: 400px) {
      .logo {
        width: 70px;
        height: 70px;
      }

      h1 {
        font-size: 1.35rem;
      }

      .arabic {
        font-size: 1.35rem;
      }

      .features-grid {
        gap: 0.5rem;
      }

      .feature {
        padding: 0.6rem 0.35rem;
      }

      .feature h3 {
        font-size: 0.65rem;
      }

      .feature p {
        font-size: 0.6rem;
      }
    }
  </style>
</head>
<body>
  <div class="main-content">
    <header>
      <img src="/assets/logo.png" alt="Al Furqan" class="logo">
      <p class="arabic">الفرقان</p>
      <p class="tagline">رفيقك الإسلامي الشامل<br>Your Complete Islamic Companion</p>
    </header>

    <div class="content-grid">
      <div class="app-section">
        <h2>📱 التطبيق | Mobile App</h2>
        <div class="features-grid">
          <div class="feature">
            <div class="feature-icon">🕌</div>
            <h3>مواقيت الصلاة</h3>
            <p>Prayer Times & Athan</p>
          </div>
          <div class="feature">
            <div class="feature-icon">📖</div>
            <h3>مصحف التجويد</h3>
            <p>Mushaf with Tajweed</p>
          </div>
          <div class="feature">
            <div class="feature-icon">🤲</div>
            <h3>الأذكار</h3>
            <p>Morning & Evening</p>
          </div>
        </div>
        <div class="app-buttons">
          <a href="https://play.google.com/store/apps/details?id=com.quranmedia.player"
             class="btn btn-primary" target="_blank" rel="noopener">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
            </svg>
            حمّل التطبيق | Google Play
          </a>
          <a href="/read" class="btn btn-secondary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21,5C19.89,4.65 18.67,4.5 17.5,4.5C15.55,4.5 13.45,4.9 12,6C10.55,4.9 8.45,4.5 6.5,4.5C4.55,4.5 2.45,4.9 1,6V20.65C1,20.9 1.25,21.15 1.5,21.15C1.6,21.15 1.65,21.1 1.75,21.1C3.1,20.45 5.05,20 6.5,20C8.45,20 10.55,20.4 12,21.5C13.35,20.65 15.8,20 17.5,20C19.15,20 20.85,20.3 22.25,21.05C22.35,21.1 22.4,21.1 22.5,21.1C22.75,21.1 23,20.85 23,20.6V6C22.4,5.55 21.75,5.25 21,5M21,18.5C19.9,18.15 18.7,18 17.5,18C15.8,18 13.35,18.65 12,19.5V8C13.35,7.15 15.8,6.5 17.5,6.5C18.7,6.5 19.9,6.65 21,7V18.5Z"/>
            </svg>
            اقرأ القرآن | Read Quran
          </a>
        </div>
      </div>

      <div class="api-section">
        <h2>🔌 Free API for Developers</h2>
        <p>Build Quran apps with our comprehensive API. Audio, text, tafseer, fonts - everything you need.</p>
        <div class="api-highlights">
          <span class="api-highlight"><strong>44</strong> Reciters</span>
          <span class="api-highlight"><strong>8</strong> Tafseers</span>
          <span class="api-highlight"><strong>604</strong> QCF Fonts</span>
          <span class="api-highlight"><strong>32</strong> Athans</span>
          <span class="api-highlight">No API Key</span>
        </div>
        <div class="api-example">
          <code>curl alfurqan.online/api/v1/tafseer/muyassar/surah/1</code>
        </div>
        <div class="api-buttons">
          <a href="/docs" class="btn btn-primary" style="font-size: 1.1rem; padding: 0.9rem 2rem;">View Full Documentation</a>
          <a href="https://github.com/ahmedm224/quranapi" class="btn btn-secondary" target="_blank" rel="noopener">GitHub</a>
        </div>
      </div>
    </div>
  </div>

  <footer>
    <p class="footer-links">
      <a href="/read">Read Quran</a> · <a href="/docs">API Docs</a> · <a href="/privacy">Privacy</a> · <a href="https://github.com/ahmedm224/quranapi" target="_blank">GitHub</a>
    </p>
    <p>Audio: <a href="https://everyayah.com" target="_blank">EveryAyah</a> · Data: <a href="https://tanzil.net" target="_blank">Tanzil</a> · Athan: <a href="https://www.assabile.com" target="_blank">Assabile</a> · Hadith: <a href="https://github.com/AhmedBaset/hadith-json" target="_blank">hadith-json</a></p>
  </footer>
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
  <title>Privacy Policy - Al Furqan Quran Audio App</title>
  <meta name="description" content="Privacy Policy for the Al Furqan Quran Audio App. We do not collect personal data. Your privacy is our priority.">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://alfurqan.online/privacy">
  <link rel="icon" type="image/png" href="/assets/logo.png">

  <!-- Open Graph -->
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Al Furqan">
  <meta property="og:title" content="Privacy Policy - Al Furqan">
  <meta property="og:description" content="Privacy Policy for the Al Furqan Quran Audio App. We respect your privacy.">
  <meta property="og:url" content="https://alfurqan.online/privacy">

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
    <p class="effective-date">Effective Date: January 26, 2025 | Last Updated: December 30, 2025</p>

    <div class="highlight">
      <p><strong>Privacy Summary:</strong> Alfurqan (الفرقان) is committed to protecting your privacy. All data is stored locally on your device with no cloud storage or data transmission to our servers. We do not collect personal information, track user behavior, or use analytics.</p>
    </div>

    <h3>What We Collect</h3>
    <ul>
      <li>✅ Approximate location (optional, city-level only) - for prayer times calculation</li>
      <li>✅ App preferences - stored locally on your device</li>
      <li>✅ Personal progress data - your Quran reading/listening tracking (local only)</li>
    </ul>

    <h3>What We DON'T Collect</h3>
    <ul>
      <li>❌ Personal information (name, email, phone)</li>
      <li>❌ Precise GPS location</li>
      <li>❌ User behavior analytics or tracking</li>
      <li>❌ Device identifiers or advertising IDs</li>
      <li>❌ Any data for advertising or marketing purposes</li>
    </ul>

    <h3>Key Privacy Points</h3>
    <ul>
      <li>🔒 All data stored locally on your device</li>
      <li>🔒 No cloud storage or data transmission to servers</li>
      <li>🔒 Location is optional - manual city entry available</li>
      <li>🔒 All network traffic encrypted with HTTPS/TLS</li>
      <li>🔒 No user accounts or login required</li>
      <li>🔒 No tracking or analytics services</li>
      <li>🔒 Daily Tracker is for personal progress, NOT behavior monitoring</li>
    </ul>

    <h3>Information We Collect and Store Locally</h3>
    <p>The following data is collected and stored locally on your device only:</p>

    <p><strong>Required for App Functionality:</strong></p>
    <ul>
      <li><strong>Quran Text Data:</strong> High-quality Quranic text from Tanzil Project bundled with the app for offline access</li>
      <li><strong>Audio Playback State:</strong> Last listening position, selected reciter, and current surah/ayah</li>
      <li><strong>Downloaded Audio Files:</strong> Quran recitation audio files chosen for offline listening</li>
    </ul>

    <p><strong>User-Created Data:</strong></p>
    <ul>
      <li><strong>Bookmarks:</strong> Saved positions for both reading and listening</li>
      <li><strong>App Settings & Preferences:</strong> Language, theme, playback speed, audio quality, reading preferences</li>
      <li><strong>Location Data (Approximate):</strong> City-level location used to calculate accurate prayer times</li>
      <li><strong>Prayer Times Cache:</strong> Calculated prayer times for your location (refreshed daily)</li>
    </ul>

    <p><strong>Personal Progress Tracking (NOT Behavior Analytics):</strong></p>
    <ul>
      <li><strong>Daily Tracker Data:</strong> Personal Quran reading/listening progress including pages read, time spent, daily/weekly progress</li>
      <li><strong>Athkar Completion:</strong> Which Islamic remembrances completed each day</li>
      <li><strong>Khatmah Goals:</strong> Personal Quran completion goals and progress</li>
    </ul>

    <div class="highlight">
      <p><strong>Important:</strong> All data remains on your device and is never transmitted to external servers. Location data is only used for prayer time calculations. Daily Tracker is for personal progress tracking, NOT for behavior analytics or monitoring.</p>
    </div>

    <h3>Permissions Required</h3>
    <p><strong>Core Functionality:</strong></p>
    <ul>
      <li><strong>INTERNET:</strong> Required to stream Quran recitations, fetch prayer times, download audio files, and retrieve athkar content</li>
      <li><strong>FOREGROUND_SERVICE & FOREGROUND_SERVICE_MEDIA_PLAYBACK:</strong> Allows audio playback to continue when the app is in the background</li>
      <li><strong>WAKE_LOCK:</strong> Prevents the device from sleeping during audio playback</li>
      <li><strong>POST_NOTIFICATIONS:</strong> Shows playback notifications with media controls (Android 13+)</li>
    </ul>

    <p><strong>Prayer Times Feature (Optional):</strong></p>
    <ul>
      <li><strong>ACCESS_COARSE_LOCATION:</strong> Optional permission to detect your approximate location (city-level) for accurate prayer times. You can manually enter your city instead.</li>
      <li><strong>SCHEDULE_EXACT_ALARM:</strong> Optional permission to schedule exact prayer time notifications/athan</li>
      <li><strong>RECEIVE_BOOT_COMPLETED:</strong> Re-schedules prayer notifications after device restart (only if you enable prayer notifications)</li>
    </ul>

    <h3>Third-Party Services</h3>
    <p>The app connects to the following third-party APIs over encrypted HTTPS connections:</p>

    <p><strong>1. Tanzil Project</strong> (https://tanzil.net)</p>
    <ul>
      <li>Purpose: Quranic text display</li>
      <li>Quran text is bundled with the app (no internet connection required)</li>
      <li>No data is transmitted to or from Tanzil servers</li>
    </ul>

    <p><strong>2. Al-Quran Cloud API</strong> (https://alquran.cloud/api)</p>
    <ul>
      <li>Purpose: Quran metadata and some audio recitations</li>
      <li>Data Shared: Device IP address, requested surah/ayah numbers</li>
      <li>No personal information or location data</li>
    </ul>

    <p><strong>3. Alfurqan API</strong> (https://api.alfurqan.online)</p>
    <ul>
      <li>Purpose: Quran audio recitations from 50+ reciters and athan recordings</li>
      <li>Data Shared: Device IP address, requested reciter IDs and surah/ayah numbers</li>
      <li>No personal information or location data</li>
    </ul>

    <p><strong>4. Aladhan API</strong> (https://aladhan.com)</p>
    <ul>
      <li>Purpose: Prayer times calculation and Hijri calendar dates</li>
      <li>Data Shared: Approximate location (latitude/longitude) - only when you use prayer times feature</li>
      <li>All location data is encrypted in transit using HTTPS/TLS</li>
      <li>No personal identification information</li>
    </ul>

    <p><strong>5. HisnMuslim API</strong> (https://hisnmuslim.com)</p>
    <ul>
      <li>Purpose: Islamic remembrances (Athkar)</li>
      <li>Data Shared: Device IP address only</li>
      <li>No personal information or location data</li>
    </ul>

    <h3>Data Storage and Security</h3>
    <ul>
      <li>All user data is stored locally using Android's Room Database and DataStore</li>
      <li>Data is stored in your app's private storage directory, inaccessible to other apps</li>
      <li>No cloud backup is enabled</li>
      <li>All API connections use HTTPS encryption (TLS/SSL)</li>
    </ul>

    <h3>Privacy Guarantee</h3>
    <ul>
      <li>We do NOT sell, share, or transmit your location data to advertisers or analytics services</li>
      <li>We do NOT track your behavior, movements, or app usage patterns</li>
      <li>We do NOT build user profiles or share data with data brokers</li>
      <li>Your data stays on your device under your complete control</li>
    </ul>

    <h3>Data Deletion</h3>
    <p>You can delete all app data at any time by:</p>
    <ul>
      <li>Going to Android Settings → Apps → Alfurqan → Storage → Clear Data</li>
      <li>Uninstalling the app (removes all data permanently)</li>
    </ul>

    <h3>Children's Privacy</h3>
    <p>Alfurqan does not collect any personal information from anyone, including children under the age of 13. The app is safe for users of all ages.</p>

    <h3>Your Rights</h3>
    <p>Since we do not collect any personal information, there is no personal data to access, correct, delete, export, or restrict processing. All data remains under your control on your device.</p>

    <h3>Data Protection Compliance</h3>
    <p><strong>GDPR Compliance (Europe):</strong> No personal data is collected or processed. No data transfers occur outside your device. No profiling or automated decision-making.</p>
    <p><strong>CCPA Compliance (California):</strong> No personal information is sold, shared, or collected.</p>
    <p>This app follows privacy-by-design principles with data minimization, purpose limitation, local storage, user control, and encryption in transit.</p>

    <h3>Changes to This Policy</h3>
    <p>We may update this Privacy Policy from time to time. Any changes will be posted with an updated "Last Updated" date. Continued use of the app after changes constitutes acceptance of the revised policy.</p>

    <div class="contact">
      <h3>Contact Us</h3>
      <p>If you have questions about this Privacy Policy or the app's data practices, please contact:</p>
      <p><strong>Developer:</strong> cloudlinqed.com</p>
      <p><strong>Email:</strong> <a href="mailto:info@cloudlinqed.com">info@cloudlinqed.com</a></p>
      <p><strong>Website:</strong> <a href="https://cloudlinqed.com">cloudlinqed.com</a></p>
    </div>

    <h3>Consent</h3>
    <p>By installing and using Alfurqan, you consent to this Privacy Policy.</p>
    <p style="text-align: center; margin-top: 2rem;">© 2025 cloudlinqed.com. All rights reserved.</p>
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
 * Serve the API documentation page
 */
export function handleDocsPage(): Response {
  const html = `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>API Documentation - Al Furqan Quran API</title>
  <meta name="description" content="Complete API documentation for Al Furqan Quran API. Access 44 reciters, Quran text, 8 tafseer sources, QCF fonts, and athan recordings. Free, no authentication required.">
  <meta name="keywords" content="Quran API Documentation, Quran Audio API, Tafseer API, QCF Fonts, REST API, Islamic API">
  <meta name="author" content="Al Furqan">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://alfurqan.online/docs">
  <link rel="icon" type="image/png" href="/assets/logo.png">

  <!-- Open Graph -->
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Al Furqan">
  <meta property="og:title" content="API Documentation - Al Furqan Quran API">
  <meta property="og:description" content="Complete API documentation for Quran audio, text, tafseer, and fonts. Free and open API.">
  <meta property="og:image" content="https://alfurqan.online/assets/logo.png">
  <meta property="og:url" content="https://alfurqan.online/docs">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="API Documentation - Al Furqan">
  <meta name="twitter:description" content="Complete API documentation for Quran audio, text, tafseer, and fonts.">

  <!-- Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "Al Furqan Quran API Documentation",
    "description": "Complete API documentation for Quran audio, text, tafseer, and fonts",
    "url": "https://alfurqan.online/docs",
    "author": {
      "@type": "Organization",
      "name": "Al Furqan"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Al Furqan",
      "logo": {
        "@type": "ImageObject",
        "url": "https://alfurqan.online/assets/logo.png"
      }
    }
  }
  </script>

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
      --code-bg: #1e1e1e;
      --code-text: #d4d4d4;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      background: var(--white);
      min-height: 100vh;
      color: var(--text-dark);
      line-height: 1.7;
    }

    .header {
      background: var(--primary-green);
      padding: 1rem 2rem;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .header-content {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .header a.logo-link {
      text-decoration: none;
      color: var(--white);
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
    }

    .header img {
      width: 36px;
      height: 36px;
    }

    .header h1 {
      font-size: 1.2rem;
      font-weight: 600;
    }

    .header nav a {
      color: var(--white);
      text-decoration: none;
      margin-left: 1.5rem;
      font-weight: 500;
      opacity: 0.9;
    }

    .header nav a:hover {
      opacity: 1;
    }

    .layout {
      display: flex;
      max-width: 1400px;
      margin: 0 auto;
    }

    .sidebar {
      width: 260px;
      padding: 1.5rem 1rem;
      border-right: 1px solid #E0E0E0;
      height: calc(100vh - 56px);
      overflow-y: auto;
      position: sticky;
      top: 56px;
      background: #FAFAFA;
      font-size: 0.9rem;
    }

    .sidebar h3 {
      color: var(--primary-green);
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.5rem;
      margin-top: 1.25rem;
      font-weight: 700;
    }

    .sidebar h3:first-child {
      margin-top: 0;
    }

    .sidebar a {
      display: block;
      color: var(--text-secondary);
      text-decoration: none;
      padding: 0.4rem 0;
      font-size: 0.95rem;
    }

    .sidebar a:hover {
      color: var(--primary-green);
    }

    .content {
      flex: 1;
      padding: 2rem 3rem;
      max-width: 900px;
    }

    .content h2 {
      color: var(--primary-green);
      font-size: 1.75rem;
      margin-top: 3rem;
      margin-bottom: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #E0E0E0;
    }

    .content h2:first-child {
      margin-top: 0;
      border-top: none;
      padding-top: 0;
    }

    .content h3 {
      color: var(--text-dark);
      font-size: 1.25rem;
      margin-top: 2rem;
      margin-bottom: 0.75rem;
    }

    .content p {
      margin-bottom: 1rem;
      color: var(--text-dark);
    }

    .endpoint {
      background: var(--pale-green);
      border-radius: 8px;
      padding: 1rem 1.25rem;
      margin: 1rem 0;
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .method {
      background: var(--primary-green);
      color: var(--white);
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      font-weight: 600;
      font-size: 0.85rem;
    }

    .path {
      font-family: 'Fira Code', 'Consolas', monospace;
      color: var(--primary-green);
      font-weight: 500;
    }

    .code-block {
      background: var(--code-bg);
      border-radius: 8px;
      padding: 1rem 1.25rem;
      margin: 1rem 0;
      overflow-x: auto;
    }

    .code-block code {
      color: var(--code-text);
      font-family: 'Fira Code', 'Consolas', monospace;
      font-size: 0.9rem;
      line-height: 1.6;
    }

    .code-block .comment {
      color: #78909C;
    }

    .code-block .string {
      color: #C3E88D;
    }

    .code-block .number {
      color: #F78C6C;
    }

    .code-block .key {
      color: #89DDFF;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1rem 0;
    }

    th, td {
      text-align: left;
      padding: 0.75rem;
      border-bottom: 1px solid #E0E0E0;
    }

    th {
      background: var(--pale-green);
      color: var(--primary-green);
      font-weight: 600;
    }

    td code {
      background: #F5F5F5;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-family: 'Fira Code', 'Consolas', monospace;
      font-size: 0.85rem;
    }

    .intro-box {
      background: linear-gradient(135deg, var(--pale-green) 0%, #C8E6C9 100%);
      border-radius: 12px;
      padding: 2rem;
      margin-bottom: 2rem;
    }

    .intro-box h2 {
      margin-top: 0;
      border: none;
      padding-top: 0;
    }

    .base-url {
      background: var(--code-bg);
      color: var(--code-text);
      padding: 0.75rem 1rem;
      border-radius: 6px;
      font-family: 'Fira Code', 'Consolas', monospace;
      display: inline-block;
      margin-top: 0.5rem;
    }

    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin: 1.5rem 0;
    }

    .feature-item {
      background: var(--white);
      border: 1px solid #E0E0E0;
      border-radius: 8px;
      padding: 1rem;
      text-align: center;
    }

    .feature-item .icon {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }

    .feature-item h4 {
      color: var(--primary-green);
      margin-bottom: 0.25rem;
    }

    .feature-item p {
      font-size: 0.85rem;
      margin-bottom: 0;
      color: var(--text-secondary);
    }

    .try-it {
      display: inline-block;
      background: var(--light-green);
      color: var(--white);
      padding: 0.4rem 0.75rem;
      border-radius: 4px;
      text-decoration: none;
      font-size: 0.85rem;
      margin-left: 0.5rem;
    }

    .try-it:hover {
      background: var(--primary-green);
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

    @media (max-width: 900px) {
      .sidebar {
        display: none;
      }

      .content {
        padding: 1.5rem;
      }

      .header-content {
        flex-direction: column;
        gap: 1rem;
      }

      .header nav a {
        margin-left: 0;
        margin-right: 1rem;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-content">
      <a href="/" class="logo-link">
        <img src="/assets/logo.png" alt="Al Furqan Logo">
        <h1>Al Furqan API</h1>
      </a>
      <nav>
        <a href="/">Home</a>
        <a href="/docs">API Docs</a>
        <a href="https://github.com/ahmedm224/quranapi" target="_blank">GitHub</a>
      </nav>
    </div>
  </div>

  <div class="layout">
    <aside class="sidebar">
      <h3>Getting Started</h3>
      <a href="#introduction">Introduction</a>
      <a href="#base-url">Base URL</a>
      <a href="#rate-limiting">Rate Limiting</a>

      <h3>Audio</h3>
      <a href="#reciters">Reciters</a>
      <a href="#surahs">Surahs</a>
      <a href="#audio">Audio Streaming</a>
      <a href="#athan">Athan</a>

      <h3>Quran Text</h3>
      <a href="#quran-text">Text Pages (SVG)</a>
      <a href="#qcf-fonts">QCF Fonts</a>

      <h3>Tafseer</h3>
      <a href="#tafseer">Tafseer Sources</a>
      <a href="#tafseer-endpoints">Tafseer Endpoints</a>

      <h3>Hadith</h3>
      <a href="#hadith">Hadith Collections</a>
      <a href="#hadith-endpoints">Hadith Endpoints</a>

      <h3>Other</h3>
      <a href="#search">Search</a>
      <a href="#credits">Credits</a>

      <h3>Downloads</h3>
      <a href="#downloads">Mobile App Downloads</a>

      <h3>Resources</h3>
      <a href="#code-examples">Code Examples</a>
      <a href="#data-sources">Data Sources</a>
    </aside>

    <main class="content">
      <div class="intro-box" id="introduction">
        <h2>Al Furqan Quran API</h2>
        <p>Free, open API for Quran applications. Audio recitations from 44 reciters, 8 tafseer sources, QCF fonts for Mushaf rendering, and more. No API key required.</p>
        <div class="feature-grid">
          <div class="feature-item">
            <div class="icon">🎙️</div>
            <h4>44 Reciters</h4>
            <p>6,236 ayah audio files</p>
          </div>
          <div class="feature-item">
            <div class="icon">📖</div>
            <h4>8 Tafseers</h4>
            <p>Arabic & English exegesis</p>
          </div>
          <div class="feature-item">
            <div class="icon">🔤</div>
            <h4>QCF Fonts</h4>
            <p>604 page fonts (V2 & V4)</p>
          </div>
          <div class="feature-item">
            <div class="icon">🕌</div>
            <h4>32 Athans</h4>
            <p>From famous muezzins</p>
          </div>
          <div class="feature-item">
            <div class="icon">🆓</div>
            <h4>100% Free</h4>
            <p>No API key required</p>
          </div>
        </div>
      </div>

      <h2 id="base-url">Base URL</h2>
      <p>All API requests should be made to:</p>
      <div class="base-url">https://alfurqan.online</div>
      <p style="margin-top: 1rem;">Or alternatively: <code>https://api.alfurqan.online</code></p>

      <h2 id="rate-limiting">Rate Limiting</h2>
      <p>The API allows <strong>100 requests per minute</strong> per IP address. Rate limit headers are included in every response:</p>
      <table>
        <tr><th>Header</th><th>Description</th></tr>
        <tr><td><code>X-RateLimit-Limit</code></td><td>Maximum requests per window (100)</td></tr>
        <tr><td><code>X-RateLimit-Remaining</code></td><td>Requests remaining in current window</td></tr>
        <tr><td><code>X-RateLimit-Reset</code></td><td>ISO timestamp when the window resets</td></tr>
      </table>

      <h2 id="health">Health Check</h2>
      <div class="endpoint">
        <span class="method">GET</span>
        <span class="path">/api/health</span>
        <a href="/api/health" class="try-it" target="_blank">Try it</a>
      </div>
      <p>Returns API status and version information.</p>
      <div class="code-block"><code>{
  <span class="key">"status"</span>: <span class="string">"ok"</span>,
  <span class="key">"timestamp"</span>: <span class="string">"2025-01-17T12:00:00.000Z"</span>,
  <span class="key">"version"</span>: <span class="string">"1.0.0"</span>,
  <span class="key">"service"</span>: <span class="string">"Quran Audio API"</span>
}</code></div>

      <h2 id="reciters">Reciters</h2>

      <h3>List All Reciters</h3>
      <div class="endpoint">
        <span class="method">GET</span>
        <span class="path">/api/v1/reciters</span>
        <a href="/api/v1/reciters" class="try-it" target="_blank">Try it</a>
      </div>
      <p>Returns all 44 available reciters with their IDs and Arabic names.</p>
      <div class="code-block"><code>{
  <span class="key">"count"</span>: <span class="number">44</span>,
  <span class="key">"reciters"</span>: [
    {
      <span class="key">"id"</span>: <span class="string">"abdul-basit-murattal"</span>,
      <span class="key">"name"</span>: <span class="string">"Abdul Basit Abdul Samad (Murattal)"</span>,
      <span class="key">"arabicName"</span>: <span class="string">"عبد الباسط عبد الصمد (مرتل)"</span>
    },
    ...
  ]
}</code></div>

      <h3>Get Single Reciter</h3>
      <div class="endpoint">
        <span class="method">GET</span>
        <span class="path">/api/v1/reciters/:reciterId</span>
        <a href="/api/v1/reciters/husary" class="try-it" target="_blank">Try it</a>
      </div>
      <table>
        <tr><th>Parameter</th><th>Type</th><th>Description</th></tr>
        <tr><td><code>reciterId</code></td><td>string</td><td>Reciter identifier (e.g., "husary", "abdul-basit-murattal")</td></tr>
      </table>

      <h2 id="surahs">Surahs</h2>

      <h3>List All Surahs</h3>
      <div class="endpoint">
        <span class="method">GET</span>
        <span class="path">/api/v1/surahs</span>
        <a href="/api/v1/surahs" class="try-it" target="_blank">Try it</a>
      </div>
      <p>Returns all 114 surahs with metadata including Arabic names, transliteration, ayah counts, and revelation type.</p>
      <div class="code-block"><code>{
  <span class="key">"count"</span>: <span class="number">114</span>,
  <span class="key">"surahs"</span>: [
    {
      <span class="key">"number"</span>: <span class="number">1</span>,
      <span class="key">"name"</span>: <span class="string">"الفاتحة"</span>,
      <span class="key">"transliteration"</span>: <span class="string">"Al-Fatihah"</span>,
      <span class="key">"translation"</span>: <span class="string">"The Opening"</span>,
      <span class="key">"ayahCount"</span>: <span class="number">7</span>,
      <span class="key">"revelationType"</span>: <span class="string">"Meccan"</span>
    },
    ...
  ]
}</code></div>

      <h3>Get Single Surah</h3>
      <div class="endpoint">
        <span class="method">GET</span>
        <span class="path">/api/v1/surahs/:surahNumber</span>
        <a href="/api/v1/surahs/2" class="try-it" target="_blank">Try it</a>
      </div>
      <table>
        <tr><th>Parameter</th><th>Type</th><th>Description</th></tr>
        <tr><td><code>surahNumber</code></td><td>integer</td><td>Surah number (1-114)</td></tr>
      </table>

      <h2 id="audio">Audio Streaming</h2>

      <h3>Stream by Global Ayah Number</h3>
      <div class="endpoint">
        <span class="method">GET</span>
        <span class="path">/api/v1/audio/:reciterId/:ayahNumber</span>
        <a href="/api/v1/audio/husary/1" class="try-it" target="_blank">Try it</a>
      </div>
      <table>
        <tr><th>Parameter</th><th>Type</th><th>Description</th></tr>
        <tr><td><code>reciterId</code></td><td>string</td><td>Reciter identifier</td></tr>
        <tr><td><code>ayahNumber</code></td><td>integer</td><td>Global ayah number (1-6236)</td></tr>
      </table>

      <h3>Stream by Surah and Ayah</h3>
      <div class="endpoint">
        <span class="method">GET</span>
        <span class="path">/api/v1/audio/:reciterId/surah/:surahNumber/ayah/:ayahInSurah</span>
        <a href="/api/v1/audio/husary/surah/2/ayah/255" class="try-it" target="_blank">Try it</a>
      </div>
      <table>
        <tr><th>Parameter</th><th>Type</th><th>Description</th></tr>
        <tr><td><code>reciterId</code></td><td>string</td><td>Reciter identifier</td></tr>
        <tr><td><code>surahNumber</code></td><td>integer</td><td>Surah number (1-114)</td></tr>
        <tr><td><code>ayahInSurah</code></td><td>integer</td><td>Ayah number within the surah</td></tr>
      </table>
      <p><strong>Features:</strong> HTTP Range requests supported (seekable audio), cached for 1 year.</p>

      <h2 id="quran-text">Quran Text (SVG Pages)</h2>
      <p>High-quality SVG pages of the Quran (Madani Mushaf) from King Fahd Quran Printing Complex.</p>

      <h3>Get Manifest</h3>
      <div class="endpoint">
        <span class="method">GET</span>
        <span class="path">/api/v1/quran-text/manifest</span>
        <a href="/api/v1/quran-text/manifest" class="try-it" target="_blank">Try it</a>
      </div>

      <h3>Get Single Page</h3>
      <div class="endpoint">
        <span class="method">GET</span>
        <span class="path">/api/v1/quran-text/page/:pageNumber</span>
        <a href="/api/v1/quran-text/page/1" class="try-it" target="_blank">Try it</a>
      </div>
      <table>
        <tr><th>Parameter</th><th>Type</th><th>Description</th></tr>
        <tr><td><code>pageNumber</code></td><td>integer</td><td>Page number (1-604)</td></tr>
      </table>

      <h3>Download All Pages (ZIP)</h3>
      <div class="endpoint">
        <span class="method">GET</span>
        <span class="path">/api/v1/quran-text/download</span>
      </div>
      <p>Downloads complete bundle of all 604 pages as a ZIP file (~384 MB).</p>

      <h2 id="qcf-fonts">QCF Fonts (Quran Complex Fonts)</h2>
      <p>Page-specific fonts for rendering Quran text in mobile/web apps. Two versions available:</p>
      <table>
        <tr><th>Version</th><th>Description</th><th>Use Case</th></tr>
        <tr><td><strong>V4 (Tajweed)</strong></td><td>COLRv1 color fonts with embedded Tajweed colors</td><td>Display Tajweed rules automatically</td></tr>
        <tr><td><strong>V2 (Plain)</strong></td><td>Standard black fonts</td><td>Custom styling & theming</td></tr>
      </table>

      <h3>Get Fonts Manifest</h3>
      <div class="endpoint">
        <span class="method">GET</span>
        <span class="path">/api/v1/quran-fonts/manifest</span>
        <a href="/api/v1/quran-fonts/manifest" class="try-it" target="_blank">Try it</a>
      </div>
      <p>Returns metadata about available fonts including total pages and usage instructions.</p>

      <h3>Get V4 Tajweed Font</h3>
      <div class="endpoint">
        <span class="method">GET</span>
        <span class="path">/api/v1/quran-fonts/v4/:pageNumber</span>
        <a href="/api/v1/quran-fonts/v4/1" class="try-it" target="_blank">Try it</a>
      </div>
      <p>Returns the V4 color font (.ttf) for a specific page with embedded Tajweed colors.</p>
      <table>
        <tr><th>Parameter</th><th>Type</th><th>Description</th></tr>
        <tr><td><code>pageNumber</code></td><td>integer</td><td>Page number (1-604)</td></tr>
      </table>

      <h3>Get V2 Plain Font</h3>
      <div class="endpoint">
        <span class="method">GET</span>
        <span class="path">/api/v1/quran-fonts/v2/:pageNumber</span>
        <a href="/api/v1/quran-fonts/v2/1" class="try-it" target="_blank">Try it</a>
      </div>
      <p>Returns the V2 plain font (.ttf) for a specific page for custom styling.</p>

      <h3>Get Page Layout</h3>
      <div class="endpoint">
        <span class="method">GET</span>
        <span class="path">/api/v1/quran-fonts/layout/:pageNumber</span>
        <a href="/api/v1/quran-fonts/layout/1" class="try-it" target="_blank">Try it</a>
      </div>
      <p>Returns JSON layout data with glyph codes for each word on the page.</p>
      <div class="code-block"><code>{
  <span class="key">"pageNumber"</span>: <span class="number">1</span>,
  <span class="key">"lines"</span>: [
    {
      <span class="key">"lineNumber"</span>: <span class="number">1</span>,
      <span class="key">"words"</span>: [
        {
          <span class="key">"surah"</span>: <span class="number">1</span>,
          <span class="key">"ayah"</span>: <span class="number">1</span>,
          <span class="key">"qpcV2"</span>: <span class="string">"&#xFC50;"</span>
        }
      ]
    }
  ]
}</code></div>

      <h3>Download All V2 Fonts (ZIP)</h3>
      <div class="endpoint">
        <span class="method">GET</span>
        <span class="path">/api/v1/fonts/qcf-v2.zip</span>
      </div>
      <p>Downloads all 604 V2 plain fonts as a ZIP archive for offline use.</p>

      <h3>Download All V4 Fonts (ZIP)</h3>
      <div class="endpoint">
        <span class="method">GET</span>
        <span class="path">/api/v1/fonts/qcf-v4.zip</span>
      </div>
      <p>Downloads all 604 V4 Tajweed fonts as a ZIP archive for offline use.</p>

      <h3>Download Quran SVG Pages (ZIP)</h3>
      <div class="endpoint">
        <span class="method">GET</span>
        <span class="path">/api/v1/fonts/quran-svg.zip</span>
      </div>
      <p>Downloads all 604 Quran pages as SVG vector graphics (King Fahd Complex) in a ZIP archive.</p>

      <h2 id="athan">Athan (Call to Prayer)</h2>
      <p>Audio recordings of the Athan from 29 muezzins worldwide.</p>

      <h3>Get Manifest</h3>
      <div class="endpoint">
        <span class="method">GET</span>
        <span class="path">/api/v1/athan/manifest</span>
        <a href="/api/v1/athan/manifest" class="try-it" target="_blank">Try it</a>
      </div>

      <h3>List All Muezzins</h3>
      <div class="endpoint">
        <span class="method">GET</span>
        <span class="path">/api/v1/athan/muezzins</span>
        <a href="/api/v1/athan/muezzins" class="try-it" target="_blank">Try it</a>
      </div>

      <h3>List All Athans</h3>
      <div class="endpoint">
        <span class="method">GET</span>
        <span class="path">/api/v1/athan/list</span>
        <a href="/api/v1/athan/list" class="try-it" target="_blank">Try it</a>
      </div>
      <table>
        <tr><th>Query Parameter</th><th>Type</th><th>Description</th></tr>
        <tr><td><code>muezzin</code></td><td>string (optional)</td><td>Filter by muezzin name</td></tr>
        <tr><td><code>location</code></td><td>string (optional)</td><td>Filter by location</td></tr>
      </table>
      <div class="code-block"><code><span class="comment"># Filter by muezzin</span>
curl "https://alfurqan.online/api/v1/athan/list?muezzin=Nasser"

<span class="comment"># Filter by location</span>
curl "https://alfurqan.online/api/v1/athan/list?location=Egypt"</code></div>

      <h3>Stream Athan Audio</h3>
      <div class="endpoint">
        <span class="method">GET</span>
        <span class="path">/api/v1/athan/:id</span>
        <a href="/api/v1/athan/1a014366658c" class="try-it" target="_blank">Try it</a>
      </div>
      <table>
        <tr><th>Parameter</th><th>Type</th><th>Description</th></tr>
        <tr><td><code>id</code></td><td>string</td><td>Athan identifier from the list endpoint</td></tr>
      </table>

      <h3>Download All Athans (ZIP)</h3>
      <div class="endpoint">
        <span class="method">GET</span>
        <span class="path">/api/v1/athan/download</span>
      </div>
      <p>Downloads all athan recordings as a ZIP archive.</p>

      <h2 id="tafseer">Tafseer (Quran Exegesis)</h2>
      <p>Quran tafseer (exegesis) and word-by-word meanings from renowned scholars.</p>

      <h3 id="tafseer-sources">Available Tafseers</h3>
      <table>
        <tr><th>ID</th><th>Name</th><th>Language</th><th>Type</th></tr>
        <tr><td><code>word-by-word-english</code></td><td>Word by Word Translation</td><td>English</td><td>Word Meanings</td></tr>
        <tr><td><code>mufradat</code></td><td>Quran Mufradat (مفردات القرآن)</td><td>Arabic</td><td>Word Meanings</td></tr>
        <tr><td><code>ibn-kathir-english</code></td><td>Tafsir Ibn Kathir</td><td>English</td><td>Tafseer</td></tr>
        <tr><td><code>maarif-ul-quran</code></td><td>Ma'ariful Quran</td><td>English</td><td>Tafseer</td></tr>
        <tr><td><code>al-saddi</code></td><td>Tafsir Al-Saddi (تفسير السعدي)</td><td>Arabic</td><td>Tafseer</td></tr>
        <tr><td><code>al-tabari</code></td><td>Tafsir Al-Tabari (تفسير الطبري)</td><td>Arabic</td><td>Tafseer</td></tr>
        <tr><td><code>ibn-kathir</code></td><td>Tafsir Ibn Kathir (تفسير ابن كثير)</td><td>Arabic</td><td>Tafseer</td></tr>
        <tr><td><code>muyassar</code></td><td>Al-Tafsir Al-Muyassar (التفسير الميسر)</td><td>Arabic</td><td>Tafseer</td></tr>
      </table>

      <h3 id="tafseer-endpoints">Tafseer Endpoints</h3>

      <h4>Get Manifest</h4>
      <div class="endpoint">
        <span class="method">GET</span>
        <span class="path">/api/v1/tafseer/manifest</span>
        <a href="/api/v1/tafseer/manifest" class="try-it" target="_blank">Try it</a>
      </div>
      <p>Returns metadata about all available tafseers.</p>

      <h4>List All Tafseers</h4>
      <div class="endpoint">
        <span class="method">GET</span>
        <span class="path">/api/v1/tafseer/list</span>
        <a href="/api/v1/tafseer/list" class="try-it" target="_blank">Try it</a>
      </div>

      <h4>Get Tafseer for Surah</h4>
      <div class="endpoint">
        <span class="method">GET</span>
        <span class="path">/api/v1/tafseer/:tafseerId/surah/:surahNumber</span>
        <a href="/api/v1/tafseer/muyassar/surah/1" class="try-it" target="_blank">Try it</a>
      </div>
      <table>
        <tr><th>Parameter</th><th>Type</th><th>Description</th></tr>
        <tr><td><code>tafseerId</code></td><td>string</td><td>Tafseer ID from the table above</td></tr>
        <tr><td><code>surahNumber</code></td><td>integer</td><td>Surah number (1-114)</td></tr>
      </table>
      <div class="code-block"><code><span class="comment"># Get Al-Muyassar tafseer for Surah Al-Fatiha</span>
curl https://alfurqan.online/api/v1/tafseer/muyassar/surah/1</code></div>

      <h4>Get Tafseer for Specific Ayah</h4>
      <div class="endpoint">
        <span class="method">GET</span>
        <span class="path">/api/v1/tafseer/:tafseerId/surah/:surahNumber/ayah/:ayahNumber</span>
        <a href="/api/v1/tafseer/ibn-kathir-english/surah/2/ayah/255" class="try-it" target="_blank">Try it</a>
      </div>
      <table>
        <tr><th>Parameter</th><th>Type</th><th>Description</th></tr>
        <tr><td><code>tafseerId</code></td><td>string</td><td>Tafseer ID</td></tr>
        <tr><td><code>surahNumber</code></td><td>integer</td><td>Surah number (1-114)</td></tr>
        <tr><td><code>ayahNumber</code></td><td>integer</td><td>Ayah number within the surah</td></tr>
      </table>
      <div class="code-block"><code><span class="comment"># Get Ibn Kathir English tafseer for Ayat al-Kursi</span>
curl https://alfurqan.online/api/v1/tafseer/ibn-kathir-english/surah/2/ayah/255</code></div>

      <h4>Response Example</h4>
      <div class="code-block"><code>{
  <span class="key">"tafseer"</span>: {
    <span class="key">"id"</span>: <span class="string">"ibn-kathir-english"</span>,
    <span class="key">"name_en"</span>: <span class="string">"Tafsir Ibn Kathir"</span>,
    <span class="key">"language"</span>: <span class="string">"english"</span>
  },
  <span class="key">"surah"</span>: { <span class="key">"number"</span>: <span class="number">2</span>, <span class="key">"name"</span>: <span class="string">"Al-Baqara"</span> },
  <span class="key">"ayah"</span>: {
    <span class="key">"ayah"</span>: <span class="number">255</span>,
    <span class="key">"text"</span>: <span class="string">"This is Ayat Al-Kursi..."</span>
  }
}</code></div>

      <h4>Download Tafseer (ZIP)</h4>
      <div class="endpoint">
        <span class="method">GET</span>
        <span class="path">/api/v1/tafseer/download/:tafseerId</span>
      </div>
      <p>Download a complete tafseer as a ZIP archive for offline use.</p>
      <div class="code-block"><code><span class="comment"># Download Al-Muyassar tafseer</span>
curl -O https://alfurqan.online/api/v1/tafseer/download/muyassar

<span class="comment"># Download Ibn Kathir English</span>
curl -O https://alfurqan.online/api/v1/tafseer/download/ibn-kathir-english</code></div>

      <h4>List All Downloads</h4>
      <div class="endpoint">
        <span class="method">GET</span>
        <span class="path">/api/v1/tafseer/downloads</span>
        <a href="/api/v1/tafseer/downloads" class="try-it" target="_blank">Try it</a>
      </div>
      <p>Returns a list of all available tafseer ZIP downloads with URLs.</p>

      <h2 id="hadith">Hadith Collections</h2>
      <p>Authentic hadith collections with Arabic text and English translations from 17 renowned books.</p>

      <h3>Available Books</h3>
      <table>
        <tr><th>ID</th><th>Name</th><th>Category</th></tr>
        <tr><td><code>bukhari</code></td><td>Sahih al-Bukhari</td><td>The 9 Books</td></tr>
        <tr><td><code>muslim</code></td><td>Sahih Muslim</td><td>The 9 Books</td></tr>
        <tr><td><code>abudawud</code></td><td>Sunan Abu Dawud</td><td>The 9 Books</td></tr>
        <tr><td><code>nasai</code></td><td>Sunan an-Nasa'i</td><td>The 9 Books</td></tr>
        <tr><td><code>tirmidhi</code></td><td>Jami at-Tirmidhi</td><td>The 9 Books</td></tr>
        <tr><td><code>ibnmajah</code></td><td>Sunan Ibn Majah</td><td>The 9 Books</td></tr>
        <tr><td><code>malik</code></td><td>Muwatta Malik</td><td>The 9 Books</td></tr>
        <tr><td><code>darimi</code></td><td>Sunan ad-Darimi</td><td>The 9 Books</td></tr>
        <tr><td><code>ahmed</code></td><td>Musnad Ahmad</td><td>The 9 Books</td></tr>
        <tr><td><code>nawawi40</code></td><td>An-Nawawi's Forty Hadith</td><td>Forties</td></tr>
        <tr><td><code>qudsi40</code></td><td>Forty Hadith Qudsi</td><td>Forties</td></tr>
        <tr><td><code>shahwaliullah40</code></td><td>Shah Waliullah's Forty Hadith</td><td>Forties</td></tr>
        <tr><td><code>riyad_assalihin</code></td><td>Riyad as-Salihin</td><td>Other Books</td></tr>
        <tr><td><code>mishkat_almasabih</code></td><td>Mishkat al-Masabih</td><td>Other Books</td></tr>
        <tr><td><code>bulugh_almaram</code></td><td>Bulugh al-Maram</td><td>Other Books</td></tr>
        <tr><td><code>aladab_almufrad</code></td><td>Al-Adab Al-Mufrad</td><td>Other Books</td></tr>
        <tr><td><code>shamail_muhammadiyah</code></td><td>Shamail Muhammadiyah</td><td>Other Books</td></tr>
      </table>

      <h3 id="hadith-endpoints">Hadith Endpoints</h3>

      <h4>Get Manifest</h4>
      <div class="endpoint">
        <span class="method">GET</span>
        <span class="path">/api/v1/hadith/manifest</span>
        <a href="/api/v1/hadith/manifest" class="try-it" target="_blank">Try it</a>
      </div>
      <p>Returns metadata about all available hadith books, categories, and endpoints.</p>

      <h4>List All Books</h4>
      <div class="endpoint">
        <span class="method">GET</span>
        <span class="path">/api/v1/hadith/list</span>
        <a href="/api/v1/hadith/list" class="try-it" target="_blank">Try it</a>
      </div>
      <p>Returns a simplified list of all 17 hadith books.</p>

      <h4>Get Book Info &amp; Chapters</h4>
      <div class="endpoint">
        <span class="method">GET</span>
        <span class="path">/api/v1/hadith/:bookId</span>
        <a href="/api/v1/hadith/bukhari" class="try-it" target="_blank">Try it</a>
      </div>
      <table>
        <tr><th>Parameter</th><th>Type</th><th>Description</th></tr>
        <tr><td><code>bookId</code></td><td>string</td><td>Book ID from the table above</td></tr>
      </table>
      <p>Returns book metadata and a list of all chapters with hadith counts and ranges.</p>

      <h4>Get Chapter Hadiths</h4>
      <div class="endpoint">
        <span class="method">GET</span>
        <span class="path">/api/v1/hadith/:bookId/chapter/:chapterId</span>
        <a href="/api/v1/hadith/bukhari/chapter/1" class="try-it" target="_blank">Try it</a>
      </div>
      <table>
        <tr><th>Parameter</th><th>Type</th><th>Description</th></tr>
        <tr><td><code>bookId</code></td><td>string</td><td>Book ID</td></tr>
        <tr><td><code>chapterId</code></td><td>integer</td><td>Chapter number within the book</td></tr>
      </table>
      <p>Returns all hadiths in a specific chapter with Arabic text and English translation.</p>

      <h4>Get Single Hadith</h4>
      <div class="endpoint">
        <span class="method">GET</span>
        <span class="path">/api/v1/hadith/:bookId/hadith/:hadithId</span>
        <a href="/api/v1/hadith/nawawi40/hadith/1" class="try-it" target="_blank">Try it</a>
      </div>
      <table>
        <tr><th>Parameter</th><th>Type</th><th>Description</th></tr>
        <tr><td><code>bookId</code></td><td>string</td><td>Book ID</td></tr>
        <tr><td><code>hadithId</code></td><td>integer</td><td>Hadith number within the book (idInBook)</td></tr>
      </table>
      <p>Returns a single hadith by its number within the book.</p>

      <h4>Response Example</h4>
      <div class="code-block"><code>{
  <span class="key">"book"</span>: {
    <span class="key">"id"</span>: <span class="string">"nawawi40"</span>,
    <span class="key">"name_en"</span>: <span class="string">"An-Nawawi's Forty Hadith"</span>,
    <span class="key">"name_ar"</span>: <span class="string">"..."</span>
  },
  <span class="key">"hadith"</span>: {
    <span class="key">"id"</span>: 1,
    <span class="key">"idInBook"</span>: 1,
    <span class="key">"chapterId"</span>: 1,
    <span class="key">"arabic"</span>: <span class="string">"..."</span>,
    <span class="key">"english"</span>: {
      <span class="key">"narrator"</span>: <span class="string">"..."</span>,
      <span class="key">"text"</span>: <span class="string">"..."</span>
    }
  }
}</code></div>

      <h4>Download Book (ZIP)</h4>
      <div class="endpoint">
        <span class="method">GET</span>
        <span class="path">/api/v1/hadith/download/:bookId</span>
      </div>
      <table>
        <tr><th>Parameter</th><th>Type</th><th>Description</th></tr>
        <tr><td><code>bookId</code></td><td>string</td><td>Book ID to download</td></tr>
      </table>
      <p>Download a complete hadith book as a ZIP archive for offline use in apps.</p>

      <h4>List All Downloads</h4>
      <div class="endpoint">
        <span class="method">GET</span>
        <span class="path">/api/v1/hadith/downloads</span>
        <a href="/api/v1/hadith/downloads" class="try-it" target="_blank">Try it</a>
      </div>
      <p>Returns a list of all available hadith book ZIP downloads with URLs.</p>

      <h2 id="search">Search</h2>
      <div class="endpoint">
        <span class="method">GET</span>
        <span class="path">/api/v1/search</span>
        <a href="/api/v1/search?q=fatiha&type=surah" class="try-it" target="_blank">Try it</a>
      </div>
      <table>
        <tr><th>Query Parameter</th><th>Type</th><th>Description</th></tr>
        <tr><td><code>q</code></td><td>string (required)</td><td>Search query</td></tr>
        <tr><td><code>type</code></td><td>string (required)</td><td>"surah" or "reciter"</td></tr>
      </table>
      <div class="code-block"><code><span class="comment"># Search for surahs</span>
curl "https://alfurqan.online/api/v1/search?q=fatiha&type=surah"

<span class="comment"># Search for reciters</span>
curl "https://alfurqan.online/api/v1/search?q=mishary&type=reciter"</code></div>

      <h2 id="credits">Credits & Attribution</h2>
      <div class="endpoint">
        <span class="method">GET</span>
        <span class="path">/api/v1/credits</span>
        <a href="/api/v1/credits" class="try-it" target="_blank">Try it</a>
      </div>
      <p>Returns attribution information for all data sources used in the API.</p>

      <h2 id="code-examples">Code Examples</h2>

      <h3>JavaScript / Fetch</h3>
      <div class="code-block"><code><span class="comment">// Fetch all reciters</span>
const response = await fetch(<span class="string">'https://alfurqan.online/api/v1/reciters'</span>);
const { reciters } = await response.json();

<span class="comment">// Play audio in browser</span>
const audio = new Audio(<span class="string">'https://alfurqan.online/api/v1/audio/husary/surah/1/ayah/1'</span>);
audio.play();</code></div>

      <h3>Python</h3>
      <div class="code-block"><code><span class="key">import</span> requests

<span class="comment"># Get all surahs</span>
response = requests.get(<span class="string">'https://alfurqan.online/api/v1/surahs'</span>)
surahs = response.json()[<span class="string">'surahs'</span>]

<span class="comment"># Download an ayah</span>
audio = requests.get(<span class="string">'https://alfurqan.online/api/v1/audio/husary/1'</span>)
with open(<span class="string">'ayah.mp3'</span>, <span class="string">'wb'</span>) as f:
    f.write(audio.content)</code></div>

      <h3>cURL</h3>
      <div class="code-block"><code><span class="comment"># Stream Ayat al-Kursi</span>
curl https://alfurqan.online/api/v1/audio/abdul-basit-murattal/surah/2/ayah/255 -o ayat-kursi.mp3

<span class="comment"># Get surah info</span>
curl https://alfurqan.online/api/v1/surahs/1</code></div>

      <h2 id="downloads">Downloads for Mobile Apps</h2>
      <p>ZIP archives for offline use in mobile applications. All downloads include complete data sets.</p>

      <table>
        <tr><th>Resource</th><th>Endpoint</th><th>Description</th></tr>
        <tr><td><strong>Quran SVG Pages</strong></td><td><code>/api/v1/quran-text/download</code></td><td>604 SVG pages (~384 MB)</td></tr>
        <tr><td><strong>QCF V2 Fonts</strong></td><td><code>/api/v1/fonts/qcf-v2.zip</code></td><td>604 plain fonts for custom styling</td></tr>
        <tr><td><strong>QCF V4 Fonts</strong></td><td><code>/api/v1/fonts/qcf-v4.zip</code></td><td>604 Tajweed color fonts</td></tr>
        <tr><td><strong>Quran SVG Pages</strong></td><td><code>/api/v1/fonts/quran-svg.zip</code></td><td>604 SVG vector pages (King Fahd Complex)</td></tr>
        <tr><td><strong>All Athans</strong></td><td><code>/api/v1/athan/download</code></td><td>32 athan recordings</td></tr>
        <tr><td><strong>Tafseer (each)</strong></td><td><code>/api/v1/tafseer/download/:id</code></td><td>Individual tafseer JSON files</td></tr>
        <tr><td><strong>Hadith (each)</strong></td><td><code>/api/v1/hadith/download/:id</code></td><td>Individual hadith book JSON files</td></tr>
      </table>

      <h3>Download Examples</h3>
      <div class="code-block"><code><span class="comment"># Download all Quran SVG pages</span>
curl -O https://alfurqan.online/api/v1/quran-text/download

<span class="comment"># Download QCF V4 Tajweed fonts</span>
curl -O https://alfurqan.online/api/v1/fonts/qcf-v4.zip

<span class="comment"># Download Quran SVG pages</span>
curl -O https://alfurqan.online/api/v1/fonts/quran-svg.zip

<span class="comment"># Download Ibn Kathir English tafseer</span>
curl -O https://alfurqan.online/api/v1/tafseer/download/ibn-kathir-english

<span class="comment"># Download all athans</span>
curl -O https://alfurqan.online/api/v1/athan/download

<span class="comment"># Download Sahih al-Bukhari hadith book</span>
curl -O https://alfurqan.online/api/v1/hadith/download/bukhari</code></div>

      <h2 id="data-sources">Data Sources</h2>
      <table>
        <tr><th>Source</th><th>Data Provided</th><th>Website</th></tr>
        <tr><td><strong>Tanzil.net</strong></td><td>Quran metadata (surah names, ayah counts)</td><td><a href="https://tanzil.net" target="_blank">tanzil.net</a></td></tr>
        <tr><td><strong>EveryAyah.com</strong></td><td>Audio recitations (44 reciters)</td><td><a href="https://everyayah.com" target="_blank">everyayah.com</a></td></tr>
        <tr><td><strong>Quran-SVG</strong></td><td>604 SVG pages (Madani Mushaf)</td><td><a href="https://github.com/batoulapps/quran-svg" target="_blank">github.com/batoulapps/quran-svg</a></td></tr>
        <tr><td><strong>Quran.com</strong></td><td>QCF fonts, Tafseer data</td><td><a href="https://quran.com" target="_blank">quran.com</a></td></tr>
        <tr><td><strong>Assabile.com</strong></td><td>Athan recordings (32 athans)</td><td><a href="https://www.assabile.com" target="_blank">assabile.com</a></td></tr>
        <tr><td><strong>Hadith-JSON</strong></td><td>17 Hadith books (50,884 hadiths)</td><td><a href="https://github.com/AhmedBaset/hadith-json" target="_blank">github.com/AhmedBaset/hadith-json</a></td></tr>
      </table>

      <footer>
        <p>Made with love for the Ummah</p>
        <p><a href="/">Back to Home</a> · <a href="https://github.com/ahmedm224/quranapi" target="_blank">GitHub</a></p>
      </footer>
    </main>
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
 * Serve the Quran reading page - SVG Mushaf Reader (604 pages)
 */
export function handleReadPage(startPage?: number): Response {
  // Server-render surah options
  const surahOptions = SURAHS_DATA.map(s =>
    `<option value="${s.page}">${s.number}. ${s.name} - ${s.englishName}</option>`
  ).join('\n');

  // Server-render juz options
  const juzOptions = JUZ_PAGES.map((page, i) =>
    `<option value="${page}">الجزء ${i + 1}</option>`
  ).join('\n');

  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
  <title>القرآن الكريم - Al Furqan | Read Quran Online</title>
  <meta name="description" content="اقرأ القرآن الكريم كاملاً - مصحف المدينة المنورة بصيغة SVG مع الاستماع إلى التلاوة. Read the Holy Quran - Madani Mushaf SVG with audio recitation.">
  <meta name="keywords" content="Quran, القرآن الكريم, Read Quran, Mushaf, مصحف, Quran Online, Islamic, Muslim">
  <meta name="author" content="Al Furqan">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://alfurqan.online/read">
  <link rel="icon" type="image/png" href="/assets/logo.png">
  <meta name="theme-color" content="#1B5E20">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Al Furqan">
  <meta property="og:title" content="القرآن الكريم - Read Quran Online">
  <meta property="og:description" content="مصحف المدينة المنورة مع الاستماع من 44 قارئ. Madani Mushaf with audio from 44 reciters.">
  <meta property="og:image" content="https://alfurqan.online/assets/logo.png">
  <meta property="og:url" content="https://alfurqan.online/read">

  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    html,body{height:100%;overflow:hidden}
    body{font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background:#f0f0f0;color:#212121;display:flex;flex-direction:column}

    /* Header */
    .header{background:#1B5E20;color:#fff;padding:0 1rem;height:44px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;z-index:100}
    .header-title{display:flex;align-items:center;gap:0.4rem;text-decoration:none;color:#fff;font-weight:700;font-size:0.95rem}
    .header-title img{width:26px;height:26px}
    .header-page-info{font-size:0.85rem;color:#C8E6C9;font-family:'Traditional Arabic',serif}

    /* Nav */
    .nav{background:#2E7D32;color:#fff;padding:5px 10px;display:flex;align-items:center;justify-content:center;gap:6px;flex-wrap:wrap;flex-shrink:0;z-index:99}
    .nav label{font-size:12px;color:#C8E6C9}
    .nav select,.nav input[type="number"]{background:#1B5E20;color:#E8F5E9;border:1px solid #4CAF50;border-radius:4px;padding:4px 6px;font-size:12px;cursor:pointer}
    .nav select:focus,.nav input:focus{outline:1px solid #81C784}
    .nav-btn{background:#4CAF50;color:#fff;border:1px solid #388E3C;border-radius:4px;padding:4px 10px;font-size:13px;font-weight:bold;cursor:pointer;min-width:32px;transition:background 0.15s}
    .nav-btn:hover{background:#66BB6A}
    .page-input{width:50px;text-align:center}

    /* Mushaf Container */
    .mushaf-container{flex:1;display:flex;justify-content:center;align-items:center;overflow:hidden;padding:8px;background:#e8e8e8}

    /* Book Spread */
    .book-spread{display:flex;direction:ltr;position:relative;filter:drop-shadow(0 6px 24px rgba(0,0,0,0.35))}

    /* Page Frame */
    .page-frame{position:relative;background:#FFFEF7;overflow:hidden;height:calc(100vh - 160px);aspect-ratio:335/544;transition:background 0.3s}
    .page-frame.left-page{border-radius:4px 0 0 4px;box-shadow:inset -4px 0 12px rgba(0,0,0,0.06)}
    .page-frame.right-page{border-radius:0 4px 4px 0;box-shadow:inset 4px 0 12px rgba(0,0,0,0.06)}

    /* SVG Container */
    .svg-container{width:100%;height:100%;display:flex;align-items:center;justify-content:center;padding:2% 3%;position:relative}
    .svg-container svg{width:100%;height:100%}

    /* Ayah Highlight Overlay */
    .line-overlay{position:absolute;pointer-events:none;z-index:10}
    .line-strip{position:absolute;left:0;width:100%;cursor:pointer;pointer-events:auto;transition:background 0.15s}
    .line-strip:hover{background:rgba(76,175,80,0.08)}
    .line-strip.highlighted{background:rgba(76,175,80,0.2)}
    .line-strip.highlighted:hover{background:rgba(76,175,80,0.28)}

    /* Book Spine */
    .book-spine{width:5px;background:linear-gradient(90deg,rgba(0,0,0,0.12) 0%,rgba(0,0,0,0.25) 40%,rgba(0,0,0,0.3) 50%,rgba(0,0,0,0.25) 60%,rgba(0,0,0,0.12) 100%);z-index:10;flex-shrink:0}

    /* Page Number */
    .page-number{position:absolute;bottom:2px;left:50%;transform:translateX(-50%);font-size:11px;color:#999;font-family:'Traditional Arabic',serif;z-index:5;user-select:none}

    /* Loading */
    .page-loading{display:flex;align-items:center;justify-content:center;width:100%;height:100%}
    .spinner{width:32px;height:32px;border:3px solid #E8F5E9;border-top-color:#1B5E20;border-radius:50%;animation:spin 0.8s linear infinite}
    @keyframes spin{to{transform:rotate(360deg)}}

    /* Single page mode */
    .book-spread.single .book-spine{display:none}
    .page-frame.single-page{border-radius:4px;box-shadow:0 4px 16px rgba(0,0,0,0.2)}

    /* Audio Bar */
    .audio-bar{background:#1B5E20;color:#fff;padding:6px 12px;display:flex;align-items:center;gap:10px;flex-shrink:0;z-index:100}
    .audio-btn{background:none;border:2px solid #81C784;color:#fff;border-radius:50%;width:34px;height:34px;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.15s;flex-shrink:0}
    .audio-btn:hover{background:#4CAF50;border-color:#4CAF50}
    .audio-btn.playing{background:#4CAF50;border-color:#66BB6A}
    .audio-status{font-size:12px;min-width:60px;text-align:center;color:#C8E6C9;white-space:nowrap}
    .progress-wrap{flex:1;height:4px;background:rgba(255,255,255,0.2);border-radius:2px;cursor:pointer;min-width:60px}
    .progress-bar{height:100%;background:#81C784;border-radius:2px;width:0;transition:width 0.2s}

    /* Hidden */
    .hidden{display:none!important}

    /* Responsive */
    @media(max-width:768px){
      .header{height:40px;padding:0 8px}
      .nav{padding:4px 6px;gap:4px}
      .nav label{display:none}
      .mushaf-container{padding:4px}
      .book-spread{flex-direction:column;align-items:center}
      .book-spine{display:none}
      .page-frame{width:100vw;height:calc(100vh - 90px);aspect-ratio:unset;border-radius:0!important;box-shadow:none}
      .svg-container{padding:2px 6px}
      .audio-bar{padding:4px 8px;gap:6px}
    }
  </style>
</head>
<body>
  <header class="header">
    <a href="/" class="header-title">
      <img src="/assets/logo.png" alt="Al Furqan" width="26" height="26">
      <span>Al Furqan</span>
    </a>
    <span class="header-page-info" id="pageInfo"></span>
  </header>

  <nav class="nav">
    <label>السورة</label>
    <select id="surahSelect">
      ${surahOptions}
    </select>
    <label>الجزء</label>
    <select id="juzSelect">
      ${juzOptions}
    </select>
    <label>القارئ</label>
    <select id="reciterSelect"><option value="">Loading...</option></select>
    <input type="number" id="pageInput" class="page-input" min="1" max="604" value="1">
    <button class="nav-btn" id="prevBtn" title="السابق">&#8594;</button>
    <button class="nav-btn" id="nextBtn" title="التالي">&#8592;</button>
  </nav>

  <main class="mushaf-container">
    <div class="book-spread" id="bookSpread">
      <div class="page-frame left-page" id="leftPage">
        <div class="svg-container" id="leftSvg"><div class="page-loading"><div class="spinner"></div></div></div>
        <div class="page-number" id="leftPageNum"></div>
      </div>
      <div class="book-spine"></div>
      <div class="page-frame right-page" id="rightPage">
        <div class="svg-container" id="rightSvg"><div class="page-loading"><div class="spinner"></div></div></div>
        <div class="page-number" id="rightPageNum"></div>
      </div>
    </div>
  </main>

  <div class="audio-bar" id="audioBar">
    <button class="audio-btn" id="playBtn" title="Play/Pause">&#9654;</button>
    <div class="audio-status" id="audioStatus">&mdash;</div>
    <div class="progress-wrap" id="progressWrap">
      <div class="progress-bar" id="progressBar"></div>
    </div>
  </div>

  <script>
    var TOTAL_PAGES = 604;
    var verseCache = {};
    var currentPage = 1;
    var isMobile = window.innerWidth <= 768;
    var isPlaying = false;
    var currentVerseIndex = 0;
    var currentVerses = [];
    var selectedReciter = '';
    var audio = new Audio();
    var lineDataCache = {};
    var highlightedVerseKey = '';
    var sequentialPlay = false;

    // Surah data for page info lookup
    var SURAHS = [
      {n:1,name:'\u0627\u0644\u0641\u0627\u062a\u062d\u0629',p:1},{n:2,name:'\u0627\u0644\u0628\u0642\u0631\u0629',p:2},{n:3,name:'\u0622\u0644 \u0639\u0645\u0631\u0627\u0646',p:50},{n:4,name:'\u0627\u0644\u0646\u0633\u0627\u0621',p:77},
      {n:5,name:'\u0627\u0644\u0645\u0627\u0626\u062f\u0629',p:106},{n:6,name:'\u0627\u0644\u0623\u0646\u0639\u0627\u0645',p:128},{n:7,name:'\u0627\u0644\u0623\u0639\u0631\u0627\u0641',p:151},{n:8,name:'\u0627\u0644\u0623\u0646\u0641\u0627\u0644',p:177},
      {n:9,name:'\u0627\u0644\u062a\u0648\u0628\u0629',p:187},{n:10,name:'\u064a\u0648\u0646\u0633',p:208},{n:11,name:'\u0647\u0648\u062f',p:221},{n:12,name:'\u064a\u0648\u0633\u0641',p:235},
      {n:13,name:'\u0627\u0644\u0631\u0639\u062f',p:249},{n:14,name:'\u0625\u0628\u0631\u0627\u0647\u064a\u0645',p:255},{n:15,name:'\u0627\u0644\u062d\u062c\u0631',p:262},{n:16,name:'\u0627\u0644\u0646\u062d\u0644',p:267},
      {n:17,name:'\u0627\u0644\u0625\u0633\u0631\u0627\u0621',p:282},{n:18,name:'\u0627\u0644\u0643\u0647\u0641',p:293},{n:19,name:'\u0645\u0631\u064a\u0645',p:305},{n:20,name:'\u0637\u0647',p:312},
      {n:21,name:'\u0627\u0644\u0623\u0646\u0628\u064a\u0627\u0621',p:322},{n:22,name:'\u0627\u0644\u062d\u062c',p:332},{n:23,name:'\u0627\u0644\u0645\u0624\u0645\u0646\u0648\u0646',p:342},{n:24,name:'\u0627\u0644\u0646\u0648\u0631',p:350},
      {n:25,name:'\u0627\u0644\u0641\u0631\u0642\u0627\u0646',p:359},{n:26,name:'\u0627\u0644\u0634\u0639\u0631\u0627\u0621',p:367},{n:27,name:'\u0627\u0644\u0646\u0645\u0644',p:377},{n:28,name:'\u0627\u0644\u0642\u0635\u0635',p:385},
      {n:29,name:'\u0627\u0644\u0639\u0646\u0643\u0628\u0648\u062a',p:396},{n:30,name:'\u0627\u0644\u0631\u0648\u0645',p:404},{n:31,name:'\u0644\u0642\u0645\u0627\u0646',p:411},{n:32,name:'\u0627\u0644\u0633\u062c\u062f\u0629',p:415},
      {n:33,name:'\u0627\u0644\u0623\u062d\u0632\u0627\u0628',p:418},{n:34,name:'\u0633\u0628\u0623',p:428},{n:35,name:'\u0641\u0627\u0637\u0631',p:434},{n:36,name:'\u064a\u0633',p:440},
      {n:37,name:'\u0627\u0644\u0635\u0627\u0641\u0627\u062a',p:446},{n:38,name:'\u0635',p:453},{n:39,name:'\u0627\u0644\u0632\u0645\u0631',p:458},{n:40,name:'\u063a\u0627\u0641\u0631',p:467},
      {n:41,name:'\u0641\u0635\u0644\u062a',p:477},{n:42,name:'\u0627\u0644\u0634\u0648\u0631\u0649',p:483},{n:43,name:'\u0627\u0644\u0632\u062e\u0631\u0641',p:489},{n:44,name:'\u0627\u0644\u062f\u062e\u0627\u0646',p:496},
      {n:45,name:'\u0627\u0644\u062c\u0627\u062b\u064a\u0629',p:499},{n:46,name:'\u0627\u0644\u0623\u062d\u0642\u0627\u0641',p:502},{n:47,name:'\u0645\u062d\u0645\u062f',p:507},{n:48,name:'\u0627\u0644\u0641\u062a\u062d',p:511},
      {n:49,name:'\u0627\u0644\u062d\u062c\u0631\u0627\u062a',p:515},{n:50,name:'\u0642',p:518},{n:51,name:'\u0627\u0644\u0630\u0627\u0631\u064a\u0627\u062a',p:520},{n:52,name:'\u0627\u0644\u0637\u0648\u0631',p:523},
      {n:53,name:'\u0627\u0644\u0646\u062c\u0645',p:526},{n:54,name:'\u0627\u0644\u0642\u0645\u0631',p:528},{n:55,name:'\u0627\u0644\u0631\u062d\u0645\u0646',p:531},{n:56,name:'\u0627\u0644\u0648\u0627\u0642\u0639\u0629',p:534},
      {n:57,name:'\u0627\u0644\u062d\u062f\u064a\u062f',p:537},{n:58,name:'\u0627\u0644\u0645\u062c\u0627\u062f\u0644\u0629',p:542},{n:59,name:'\u0627\u0644\u062d\u0634\u0631',p:545},{n:60,name:'\u0627\u0644\u0645\u0645\u062a\u062d\u0646\u0629',p:549},
      {n:61,name:'\u0627\u0644\u0635\u0641',p:551},{n:62,name:'\u0627\u0644\u062c\u0645\u0639\u0629',p:553},{n:63,name:'\u0627\u0644\u0645\u0646\u0627\u0641\u0642\u0648\u0646',p:554},{n:64,name:'\u0627\u0644\u062a\u063a\u0627\u0628\u0646',p:556},
      {n:65,name:'\u0627\u0644\u0637\u0644\u0627\u0642',p:558},{n:66,name:'\u0627\u0644\u062a\u062d\u0631\u064a\u0645',p:560},{n:67,name:'\u0627\u0644\u0645\u0644\u0643',p:562},{n:68,name:'\u0627\u0644\u0642\u0644\u0645',p:564},
      {n:69,name:'\u0627\u0644\u062d\u0627\u0642\u0629',p:566},{n:70,name:'\u0627\u0644\u0645\u0639\u0627\u0631\u062c',p:568},{n:71,name:'\u0646\u0648\u062d',p:570},{n:72,name:'\u0627\u0644\u062c\u0646',p:572},
      {n:73,name:'\u0627\u0644\u0645\u0632\u0645\u0644',p:574},{n:74,name:'\u0627\u0644\u0645\u062f\u062b\u0631',p:575},{n:75,name:'\u0627\u0644\u0642\u064a\u0627\u0645\u0629',p:577},{n:76,name:'\u0627\u0644\u0625\u0646\u0633\u0627\u0646',p:578},
      {n:77,name:'\u0627\u0644\u0645\u0631\u0633\u0644\u0627\u062a',p:580},{n:78,name:'\u0627\u0644\u0646\u0628\u0623',p:582},{n:79,name:'\u0627\u0644\u0646\u0627\u0632\u0639\u0627\u062a',p:583},{n:80,name:'\u0639\u0628\u0633',p:585},
      {n:81,name:'\u0627\u0644\u062a\u0643\u0648\u064a\u0631',p:586},{n:82,name:'\u0627\u0644\u0627\u0646\u0641\u0637\u0627\u0631',p:587},{n:83,name:'\u0627\u0644\u0645\u0637\u0641\u0641\u064a\u0646',p:587},{n:84,name:'\u0627\u0644\u0627\u0646\u0634\u0642\u0627\u0642',p:589},
      {n:85,name:'\u0627\u0644\u0628\u0631\u0648\u062c',p:590},{n:86,name:'\u0627\u0644\u0637\u0627\u0631\u0642',p:591},{n:87,name:'\u0627\u0644\u0623\u0639\u0644\u0649',p:591},{n:88,name:'\u0627\u0644\u063a\u0627\u0634\u064a\u0629',p:592},
      {n:89,name:'\u0627\u0644\u0641\u062c\u0631',p:593},{n:90,name:'\u0627\u0644\u0628\u0644\u062f',p:594},{n:91,name:'\u0627\u0644\u0634\u0645\u0633',p:595},{n:92,name:'\u0627\u0644\u0644\u064a\u0644',p:595},
      {n:93,name:'\u0627\u0644\u0636\u062d\u0649',p:596},{n:94,name:'\u0627\u0644\u0634\u0631\u062d',p:596},{n:95,name:'\u0627\u0644\u062a\u064a\u0646',p:597},{n:96,name:'\u0627\u0644\u0639\u0644\u0642',p:597},
      {n:97,name:'\u0627\u0644\u0642\u062f\u0631',p:598},{n:98,name:'\u0627\u0644\u0628\u064a\u0646\u0629',p:598},{n:99,name:'\u0627\u0644\u0632\u0644\u0632\u0644\u0629',p:599},{n:100,name:'\u0627\u0644\u0639\u0627\u062f\u064a\u0627\u062a',p:599},
      {n:101,name:'\u0627\u0644\u0642\u0627\u0631\u0639\u0629',p:600},{n:102,name:'\u0627\u0644\u062a\u0643\u0627\u062b\u0631',p:600},{n:103,name:'\u0627\u0644\u0639\u0635\u0631',p:601},{n:104,name:'\u0627\u0644\u0647\u0645\u0632\u0629',p:601},
      {n:105,name:'\u0627\u0644\u0641\u064a\u0644',p:601},{n:106,name:'\u0642\u0631\u064a\u0634',p:602},{n:107,name:'\u0627\u0644\u0645\u0627\u0639\u0648\u0646',p:602},{n:108,name:'\u0627\u0644\u0643\u0648\u062b\u0631',p:602},
      {n:109,name:'\u0627\u0644\u0643\u0627\u0641\u0631\u0648\u0646',p:603},{n:110,name:'\u0627\u0644\u0646\u0635\u0631',p:603},{n:111,name:'\u0627\u0644\u0645\u0633\u062f',p:603},
      {n:112,name:'\u0627\u0644\u0625\u062e\u0644\u0627\u0635',p:604},{n:113,name:'\u0627\u0644\u0641\u0644\u0642',p:604},{n:114,name:'\u0627\u0644\u0646\u0627\u0633',p:604}
    ];

    var JUZ_PAGES = [1,22,42,62,82,102,121,142,162,182,201,222,242,262,282,302,322,342,362,382,402,422,442,462,482,502,522,542,562,582];

    // ====== PAGE RENDERING (img tags - browser handles SVG natively) ======
    function prefetchPage(pageNum) {
      if (pageNum >= 1 && pageNum <= TOTAL_PAGES) {
        var img = new Image();
        img.src = '/api/v1/quran-text/page/' + pageNum;
      }
    }

    function renderPage(container, pageNumEl, pageNum) {
      var frame = container.parentElement;
      if (pageNum < 1 || pageNum > TOTAL_PAGES) {
        container.innerHTML = '';
        pageNumEl.textContent = '';
        frame.style.display = 'none';
        return;
      }
      frame.style.display = '';
      pageNumEl.textContent = pageNum;

      var img = document.createElement('img');
      img.alt = 'Page ' + pageNum;
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'contain';

      // Show spinner until loaded
      container.innerHTML = '<div class="page-loading"><div class="spinner"></div></div>';
      img.onload = function() {
        container.innerHTML = '';
        container.appendChild(img);
        requestAnimationFrame(function() { buildOverlay(container, pageNum); });
      };
      img.onerror = function() { container.innerHTML = '<div class="page-loading" style="color:#999;font-size:14px">\u0635\u0641\u062d\u0629 ' + pageNum + '</div>'; };
      img.src = '/api/v1/quran-text/page/' + pageNum;
    }

    // ====== NAVIGATION ======
    function getSurahForPage(page) {
      for (var i = SURAHS.length - 1; i >= 0; i--) {
        if (SURAHS[i].p <= page) return SURAHS[i];
      }
      return SURAHS[0];
    }

    function goToPage(page) {
      page = Math.max(1, Math.min(TOTAL_PAGES, parseInt(page) || 1));
      currentPage = page;

      var spread = document.getElementById('bookSpread');
      var leftSvg = document.getElementById('leftSvg');
      var rightSvg = document.getElementById('rightSvg');
      var leftPageNum = document.getElementById('leftPageNum');
      var rightPageNum = document.getElementById('rightPageNum');
      var leftFrame = document.getElementById('leftPage');
      var rightFrame = document.getElementById('rightPage');
      var spine = document.querySelector('.book-spine');

      if (isMobile || page <= 2) {
        // Single page mode
        spread.classList.add('single');
        leftFrame.style.display = 'none';
        spine.style.display = 'none';
        rightFrame.classList.add('single-page');
        rightFrame.classList.remove('right-page');
        renderPage(rightSvg, rightPageNum, page);
        prefetchPage(page - 1); prefetchPage(page + 1);
      } else {
        // Spread mode
        spread.classList.remove('single');
        leftFrame.style.display = '';
        spine.style.display = '';
        rightFrame.classList.remove('single-page');
        rightFrame.classList.add('right-page');

        var rightP, leftP;
        if (page % 2 === 1) { rightP = page; leftP = page + 1; }
        else { rightP = page - 1; leftP = page; }

        renderPage(rightSvg, rightPageNum, rightP);
        renderPage(leftSvg, leftPageNum, leftP);

        // Prefetch adjacent pages
        prefetchPage(rightP - 2); prefetchPage(rightP - 1);
        prefetchPage(leftP + 1); prefetchPage(leftP + 2);
      }

      // Update UI
      var surah = getSurahForPage(page);
      document.getElementById('pageInfo').textContent = surah.name + ' | ' + page + ' / ' + TOTAL_PAGES;
      document.getElementById('pageInput').value = page;
      document.getElementById('surahSelect').value = surah.p;

      for (var j = JUZ_PAGES.length - 1; j >= 0; j--) {
        if (JUZ_PAGES[j] <= page) {
          document.getElementById('juzSelect').value = JUZ_PAGES[j];
          break;
        }
      }

      // Stop audio on page change
      stopAudio();

      // Load verse metadata for audio
      loadVerses(page);

      // Load line data for highlighting
      loadLineData(page);
      if (!isMobile && page > 2) {
        var rp = (page % 2 === 1) ? page : page - 1;
        var lp = rp + 1;
        loadVerses(rp); loadVerses(lp);
        loadLineData(rp); loadLineData(lp);
      }

      // Persist
      try { localStorage.setItem('mushaf-page', page); } catch(e) {}
    }

    function nextPage() {
      if (isMobile || currentPage <= 2) goToPage(currentPage + 1);
      else goToPage(currentPage + 2);
    }

    function prevPage() {
      if (isMobile || currentPage <= 3) goToPage(currentPage - 1);
      else goToPage(currentPage - 2);
    }

    // ====== AUDIO ======
    function loadReciters() {
      fetch('/api/v1/reciters')
        .then(function(r) { return r.json(); })
        .then(function(data) {
          var reciters = data.reciters || data;
          var sel = document.getElementById('reciterSelect');
          sel.innerHTML = '';
          if (Array.isArray(reciters)) {
            reciters.forEach(function(rec) {
              var opt = document.createElement('option');
              opt.value = rec.id || rec.identifier;
              opt.textContent = rec.name || rec.englishName;
              sel.appendChild(opt);
            });
          }
          // Restore saved reciter
          try {
            var saved = localStorage.getItem('mushaf-reciter');
            if (saved) { sel.value = saved; }
          } catch(e) {}
          selectedReciter = sel.value;
        })
        .catch(function() {});
    }

    function loadVerses(page) {
      if (verseCache[page]) { currentVerses = verseCache[page]; return; }
      fetch('/api/v1/quran-text/text/' + page)
        .then(function(r) { return r.ok ? r.json() : null; })
        .then(function(data) {
          if (!data) return;
          var verses = data.ayahs || data.verses || data;
          if (Array.isArray(verses)) {
            verseCache[page] = verses;
            currentVerses = verses;
          }
        })
        .catch(function() {});
    }

    function loadLineData(page, callback) {
      if (lineDataCache[page]) { if (callback) callback(lineDataCache[page]); return; }
      fetch('https://api.quran.com/api/v4/verses/by_page/' + page + '?words=true&word_fields=line_number&per_page=50')
        .then(function(r) { return r.ok ? r.json() : null; })
        .then(function(data) {
          if (!data || !data.verses) return;
          var lineToVerses = {};
          var verseToLines = {};
          data.verses.forEach(function(v) {
            var parts = v.verse_key.split(':');
            var surah = parseInt(parts[0]);
            var ayah = parseInt(parts[1]);
            var vk = v.verse_key;
            var lines = {};
            (v.words || []).forEach(function(w) {
              if (w.line_number) lines[w.line_number] = true;
            });
            var lineNums = Object.keys(lines).map(Number).sort(function(a,b){return a-b;});
            verseToLines[vk] = lineNums;
            lineNums.forEach(function(ln) {
              if (!lineToVerses[ln]) lineToVerses[ln] = [];
              var exists = lineToVerses[ln].some(function(e) { return e.verseKey === vk; });
              if (!exists) lineToVerses[ln].push({surah:surah, ayah:ayah, verseKey:vk});
            });
          });
          lineDataCache[page] = {lineToVerses:lineToVerses, verseToLines:verseToLines};
          if (callback) callback(lineDataCache[page]);
        })
        .catch(function() {});
    }

    // ====== AYAH HIGHLIGHTING ======
    var SVG_ASPECT = 510.236 / 729.448;
    var LINE_TOP_PCT = 8.5;
    var LINE_BOTTOM_PCT = 95.5;
    var TOTAL_LINES = 15;
    var LINE_HEIGHT_PCT = (LINE_BOTTOM_PCT - LINE_TOP_PCT) / TOTAL_LINES;

    function buildOverlay(container, pageNum) {
      var existing = container.querySelector('.line-overlay');
      if (existing) existing.remove();
      var img = container.querySelector('img');
      if (!img) return;

      var overlay = document.createElement('div');
      overlay.className = 'line-overlay';
      overlay.setAttribute('data-page', pageNum);

      // Compute rendered image bounds within container (object-fit:contain)
      var cw = container.clientWidth, ch = container.clientHeight;
      var containerAspect = cw / ch;
      var imgW, imgH, offsetX, offsetY;
      if (containerAspect > SVG_ASPECT) {
        imgH = ch; imgW = imgH * SVG_ASPECT;
        offsetX = (cw - imgW) / 2; offsetY = 0;
      } else {
        imgW = cw; imgH = imgW / SVG_ASPECT;
        offsetX = 0; offsetY = (ch - imgH) / 2;
      }
      overlay.style.left = offsetX + 'px';
      overlay.style.top = offsetY + 'px';
      overlay.style.width = imgW + 'px';
      overlay.style.height = imgH + 'px';

      if (pageNum <= 2) {
        buildSpecialOverlay(overlay, pageNum);
      } else {
        for (var i = 1; i <= TOTAL_LINES; i++) {
          var strip = document.createElement('div');
          strip.className = 'line-strip';
          strip.setAttribute('data-line', i);
          strip.style.top = (LINE_TOP_PCT + (i - 1) * LINE_HEIGHT_PCT) + '%';
          strip.style.height = LINE_HEIGHT_PCT + '%';
          strip.addEventListener('click', (function(ln, pg) {
            return function() { onLineClick(pg, ln); };
          })(i, pageNum));
          overlay.appendChild(strip);
        }
      }
      container.appendChild(overlay);

      // Re-apply highlight if one is active
      if (highlightedVerseKey) highlightVerse(pageNum, highlightedVerseKey);
    }

    function buildSpecialOverlay(overlay, pageNum) {
      // Page 1 (Fatiha): 7 ayahs, centered text
      // Page 2 (Baqarah opening): ~5 ayahs, centered text
      var cfg = pageNum === 1
        ? {startLine:1, count:7, topPct:37, bottomPct:73}
        : {startLine:1, count:7, topPct:37, bottomPct:73};
      var lh = (cfg.bottomPct - cfg.topPct) / cfg.count;
      for (var i = 0; i < cfg.count; i++) {
        var strip = document.createElement('div');
        strip.className = 'line-strip';
        strip.setAttribute('data-line', cfg.startLine + i);
        strip.style.top = (cfg.topPct + i * lh) + '%';
        strip.style.height = lh + '%';
        strip.style.left = '15%';
        strip.style.width = '70%';
        strip.addEventListener('click', (function(ln, pg) {
          return function() { onLineClick(pg, ln); };
        })(cfg.startLine + i, pageNum));
        overlay.appendChild(strip);
      }
    }

    function highlightVerse(pageNum, verseKey) {
      clearHighlights();
      highlightedVerseKey = verseKey;
      var ld = lineDataCache[pageNum];
      if (!ld || !ld.verseToLines[verseKey]) return;
      var lines = ld.verseToLines[verseKey];
      document.querySelectorAll('.line-overlay[data-page="' + pageNum + '"] .line-strip').forEach(function(el) {
        var ln = parseInt(el.getAttribute('data-line'));
        if (lines.indexOf(ln) !== -1) el.classList.add('highlighted');
      });
    }

    function clearHighlights() {
      highlightedVerseKey = '';
      document.querySelectorAll('.line-strip.highlighted').forEach(function(el) {
        el.classList.remove('highlighted');
      });
    }

    function onLineClick(pageNum, lineNum) {
      var ld = lineDataCache[pageNum];
      if (!ld) return;
      var versesOnLine = ld.lineToVerses[lineNum];
      if (!versesOnLine || !versesOnLine.length) return;

      // Pick the first verse, or cycle if already highlighted
      var target = versesOnLine[0];
      if (versesOnLine.length > 1 && highlightedVerseKey === target.verseKey) {
        target = versesOnLine[1];
      }

      highlightVerse(pageNum, target.verseKey);

      // Play audio for this single ayah
      selectedReciter = document.getElementById('reciterSelect').value;
      if (!selectedReciter) return;
      try { localStorage.setItem('mushaf-reciter', selectedReciter); } catch(e) {}

      // Sync with currentVerses so play button continues from here
      for (var i = 0; i < currentVerses.length; i++) {
        if (currentVerses[i].surah === target.surah && currentVerses[i].ayah === target.ayah) {
          currentVerseIndex = i;
          break;
        }
      }

      document.getElementById('audioStatus').textContent = target.surah + ':' + target.ayah;
      sequentialPlay = false;
      audio.src = '/api/v1/audio/' + selectedReciter + '/surah/' + target.surah + '/ayah/' + target.ayah;
      isPlaying = true;
      updatePlayBtn();
      audio.play().catch(function() { isPlaying = false; updatePlayBtn(); });
    }

    function playAudio() {
      if (!currentVerses.length) return;
      selectedReciter = document.getElementById('reciterSelect').value;
      if (!selectedReciter) return;
      try { localStorage.setItem('mushaf-reciter', selectedReciter); } catch(e) {}
      sequentialPlay = true;
      isPlaying = true;
      updatePlayBtn();
      playCurrentVerse();
    }

    function playCurrentVerse() {
      if (!isPlaying || currentVerseIndex >= currentVerses.length) {
        if (isPlaying && currentVerseIndex >= currentVerses.length && currentVerses.length > 0) {
          // Auto-advance to next page only if we had verses to play through
          isPlaying = false;
          updatePlayBtn();
          nextPage();
          setTimeout(function() { currentVerseIndex = 0; playAudio(); }, 1000);
          return;
        }
        isPlaying = false;
        updatePlayBtn();
        clearHighlights();
        return;
      }

      var v = currentVerses[currentVerseIndex];
      var surahNum = (typeof v.surah === 'object') ? v.surah.number : v.surah;
      var ayahNum = v.ayah || v.numberInSurah || v.ayahNumber || v.verse;
      if (!surahNum || !ayahNum) { currentVerseIndex++; playCurrentVerse(); return; }

      document.getElementById('audioStatus').textContent = surahNum + ':' + ayahNum;
      var pct = ((currentVerseIndex + 1) / currentVerses.length * 100).toFixed(1);
      document.getElementById('progressBar').style.width = pct + '%';

      // Highlight the current ayah
      highlightVerse(currentPage, surahNum + ':' + ayahNum);

      audio.src = '/api/v1/audio/' + selectedReciter + '/surah/' + surahNum + '/ayah/' + ayahNum;
      audio.play().catch(function() {
        currentVerseIndex++;
        if (isPlaying) playCurrentVerse();
      });
    }

    audio.addEventListener('ended', function() {
      if (!sequentialPlay) { isPlaying = false; updatePlayBtn(); return; }
      currentVerseIndex++;
      if (isPlaying) playCurrentVerse();
    });

    audio.addEventListener('error', function() {
      if (!sequentialPlay) { isPlaying = false; updatePlayBtn(); return; }
      currentVerseIndex++;
      if (isPlaying) playCurrentVerse();
    });

    function pauseAudio() {
      isPlaying = false;
      audio.pause();
      updatePlayBtn();
    }

    function stopAudio() {
      isPlaying = false;
      sequentialPlay = false;
      currentVerseIndex = 0;
      audio.pause();
      document.getElementById('progressBar').style.width = '0%';
      document.getElementById('audioStatus').textContent = '\u2014';
      updatePlayBtn();
      clearHighlights();
    }

    function updatePlayBtn() {
      var btn = document.getElementById('playBtn');
      if (isPlaying) {
        btn.innerHTML = '&#9646;&#9646;';
        btn.classList.add('playing');
      } else {
        btn.innerHTML = '&#9654;';
        btn.classList.remove('playing');
      }
    }

    // ====== EVENT LISTENERS ======
    document.getElementById('nextBtn').addEventListener('click', nextPage);
    document.getElementById('prevBtn').addEventListener('click', prevPage);
    document.getElementById('pageInput').addEventListener('keydown', function(e) {
      if (e.key === 'Enter') goToPage(e.target.value);
    });
    document.getElementById('surahSelect').addEventListener('change', function(e) {
      goToPage(e.target.value);
    });
    document.getElementById('juzSelect').addEventListener('change', function(e) {
      goToPage(e.target.value);
    });
    document.getElementById('reciterSelect').addEventListener('change', function(e) {
      selectedReciter = e.target.value;
      try { localStorage.setItem('mushaf-reciter', selectedReciter); } catch(ex) {}
    });
    document.getElementById('playBtn').addEventListener('click', function() {
      if (isPlaying) pauseAudio();
      else playAudio();
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
      if (e.key === 'ArrowLeft') nextPage();
      else if (e.key === 'ArrowRight') prevPage();
      else if (e.key === ' ') {
        e.preventDefault();
        if (isPlaying) pauseAudio(); else playAudio();
      }
    });

    // Touch swipe
    var touchStartX = 0;
    document.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});
    document.addEventListener('touchend', function(e) {
      var diff = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(diff) > 60) {
        if (diff > 0) prevPage(); else nextPage();
      }
    }, {passive: true});

    // Resize handler - switch between mobile/desktop
    window.addEventListener('resize', function() {
      var wasMobile = isMobile;
      isMobile = window.innerWidth <= 768;
      if (wasMobile !== isMobile) goToPage(currentPage);
      else {
        // Rebuild overlays to match new dimensions
        document.querySelectorAll('.line-overlay').forEach(function(ov) {
          var pg = parseInt(ov.getAttribute('data-page'));
          if (pg) buildOverlay(ov.parentElement, pg);
        });
      }
    });

    // ====== INIT ======
    function init() {
      loadReciters();

      // Determine start page: URL path > query param > localStorage
      var savedPage = 0;

      // Check URL path: /read/page/N or /read/surah/N
      var pathMatch = window.location.pathname.match(/\\/read\\/page\\/(\\d+)/);
      if (pathMatch) {
        savedPage = parseInt(pathMatch[1]) || 0;
      }
      if (!savedPage) {
        var surahMatch = window.location.pathname.match(/\\/read\\/surah\\/(\\d+)/);
        if (surahMatch) {
          var sn = parseInt(surahMatch[1]) || 0;
          for (var i = 0; i < SURAHS.length; i++) {
            if (SURAHS[i].n === sn) { savedPage = SURAHS[i].p; break; }
          }
        }
      }

      // Check query param: ?page=N
      if (!savedPage) {
        var params = new URLSearchParams(window.location.search);
        var qp = params.get('page');
        if (qp) savedPage = parseInt(qp) || 0;
      }

      // Fall back to localStorage
      if (!savedPage) {
        try {
          var sp = localStorage.getItem('mushaf-page');
          if (sp) savedPage = parseInt(sp) || 1;
        } catch(e) {}
      }

      goToPage(savedPage || 1);
    }

    init();
  </script>
</body>
</html>`;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}


// Surah metadata for SSR
const SURAHS_DATA = [
  { number: 1, name: 'الفاتحة', englishName: 'Al-Fatiha', verses: 7, page: 1 },
  { number: 2, name: 'البقرة', englishName: 'Al-Baqarah', verses: 286, page: 2 },
  { number: 3, name: 'آل عمران', englishName: 'Aal-Imran', verses: 200, page: 50 },
  { number: 4, name: 'النساء', englishName: 'An-Nisa', verses: 176, page: 77 },
  { number: 5, name: 'المائدة', englishName: 'Al-Ma\'idah', verses: 120, page: 106 },
  { number: 6, name: 'الأنعام', englishName: 'Al-An\'am', verses: 165, page: 128 },
  { number: 7, name: 'الأعراف', englishName: 'Al-A\'raf', verses: 206, page: 151 },
  { number: 8, name: 'الأنفال', englishName: 'Al-Anfal', verses: 75, page: 177 },
  { number: 9, name: 'التوبة', englishName: 'At-Tawbah', verses: 129, page: 187 },
  { number: 10, name: 'يونس', englishName: 'Yunus', verses: 109, page: 208 },
  { number: 11, name: 'هود', englishName: 'Hud', verses: 123, page: 221 },
  { number: 12, name: 'يوسف', englishName: 'Yusuf', verses: 111, page: 235 },
  { number: 13, name: 'الرعد', englishName: 'Ar-Ra\'d', verses: 43, page: 249 },
  { number: 14, name: 'إبراهيم', englishName: 'Ibrahim', verses: 52, page: 255 },
  { number: 15, name: 'الحجر', englishName: 'Al-Hijr', verses: 99, page: 262 },
  { number: 16, name: 'النحل', englishName: 'An-Nahl', verses: 128, page: 267 },
  { number: 17, name: 'الإسراء', englishName: 'Al-Isra', verses: 111, page: 282 },
  { number: 18, name: 'الكهف', englishName: 'Al-Kahf', verses: 110, page: 293 },
  { number: 19, name: 'مريم', englishName: 'Maryam', verses: 98, page: 305 },
  { number: 20, name: 'طه', englishName: 'Ta-Ha', verses: 135, page: 312 },
  { number: 21, name: 'الأنبياء', englishName: 'Al-Anbiya', verses: 112, page: 322 },
  { number: 22, name: 'الحج', englishName: 'Al-Hajj', verses: 78, page: 332 },
  { number: 23, name: 'المؤمنون', englishName: 'Al-Mu\'minun', verses: 118, page: 342 },
  { number: 24, name: 'النور', englishName: 'An-Nur', verses: 64, page: 350 },
  { number: 25, name: 'الفرقان', englishName: 'Al-Furqan', verses: 77, page: 359 },
  { number: 26, name: 'الشعراء', englishName: 'Ash-Shu\'ara', verses: 227, page: 367 },
  { number: 27, name: 'النمل', englishName: 'An-Naml', verses: 93, page: 377 },
  { number: 28, name: 'القصص', englishName: 'Al-Qasas', verses: 88, page: 385 },
  { number: 29, name: 'العنكبوت', englishName: 'Al-Ankabut', verses: 69, page: 396 },
  { number: 30, name: 'الروم', englishName: 'Ar-Rum', verses: 60, page: 404 },
  { number: 31, name: 'لقمان', englishName: 'Luqman', verses: 34, page: 411 },
  { number: 32, name: 'السجدة', englishName: 'As-Sajdah', verses: 30, page: 415 },
  { number: 33, name: 'الأحزاب', englishName: 'Al-Ahzab', verses: 73, page: 418 },
  { number: 34, name: 'سبأ', englishName: 'Saba', verses: 54, page: 428 },
  { number: 35, name: 'فاطر', englishName: 'Fatir', verses: 45, page: 434 },
  { number: 36, name: 'يس', englishName: 'Ya-Sin', verses: 83, page: 440 },
  { number: 37, name: 'الصافات', englishName: 'As-Saffat', verses: 182, page: 446 },
  { number: 38, name: 'ص', englishName: 'Sad', verses: 88, page: 453 },
  { number: 39, name: 'الزمر', englishName: 'Az-Zumar', verses: 75, page: 458 },
  { number: 40, name: 'غافر', englishName: 'Ghafir', verses: 85, page: 467 },
  { number: 41, name: 'فصلت', englishName: 'Fussilat', verses: 54, page: 477 },
  { number: 42, name: 'الشورى', englishName: 'Ash-Shura', verses: 53, page: 483 },
  { number: 43, name: 'الزخرف', englishName: 'Az-Zukhruf', verses: 89, page: 489 },
  { number: 44, name: 'الدخان', englishName: 'Ad-Dukhan', verses: 59, page: 496 },
  { number: 45, name: 'الجاثية', englishName: 'Al-Jathiyah', verses: 37, page: 499 },
  { number: 46, name: 'الأحقاف', englishName: 'Al-Ahqaf', verses: 35, page: 502 },
  { number: 47, name: 'محمد', englishName: 'Muhammad', verses: 38, page: 507 },
  { number: 48, name: 'الفتح', englishName: 'Al-Fath', verses: 29, page: 511 },
  { number: 49, name: 'الحجرات', englishName: 'Al-Hujurat', verses: 18, page: 515 },
  { number: 50, name: 'ق', englishName: 'Qaf', verses: 45, page: 518 },
  { number: 51, name: 'الذاريات', englishName: 'Adh-Dhariyat', verses: 60, page: 520 },
  { number: 52, name: 'الطور', englishName: 'At-Tur', verses: 49, page: 523 },
  { number: 53, name: 'النجم', englishName: 'An-Najm', verses: 62, page: 526 },
  { number: 54, name: 'القمر', englishName: 'Al-Qamar', verses: 55, page: 528 },
  { number: 55, name: 'الرحمن', englishName: 'Ar-Rahman', verses: 78, page: 531 },
  { number: 56, name: 'الواقعة', englishName: 'Al-Waqi\'ah', verses: 96, page: 534 },
  { number: 57, name: 'الحديد', englishName: 'Al-Hadid', verses: 29, page: 537 },
  { number: 58, name: 'المجادلة', englishName: 'Al-Mujadilah', verses: 22, page: 542 },
  { number: 59, name: 'الحشر', englishName: 'Al-Hashr', verses: 24, page: 545 },
  { number: 60, name: 'الممتحنة', englishName: 'Al-Mumtahanah', verses: 13, page: 549 },
  { number: 61, name: 'الصف', englishName: 'As-Saff', verses: 14, page: 551 },
  { number: 62, name: 'الجمعة', englishName: 'Al-Jumu\'ah', verses: 11, page: 553 },
  { number: 63, name: 'المنافقون', englishName: 'Al-Munafiqun', verses: 11, page: 554 },
  { number: 64, name: 'التغابن', englishName: 'At-Taghabun', verses: 18, page: 556 },
  { number: 65, name: 'الطلاق', englishName: 'At-Talaq', verses: 12, page: 558 },
  { number: 66, name: 'التحريم', englishName: 'At-Tahrim', verses: 12, page: 560 },
  { number: 67, name: 'الملك', englishName: 'Al-Mulk', verses: 30, page: 562 },
  { number: 68, name: 'القلم', englishName: 'Al-Qalam', verses: 52, page: 564 },
  { number: 69, name: 'الحاقة', englishName: 'Al-Haqqah', verses: 52, page: 566 },
  { number: 70, name: 'المعارج', englishName: 'Al-Ma\'arij', verses: 44, page: 568 },
  { number: 71, name: 'نوح', englishName: 'Nuh', verses: 28, page: 570 },
  { number: 72, name: 'الجن', englishName: 'Al-Jinn', verses: 28, page: 572 },
  { number: 73, name: 'المزمل', englishName: 'Al-Muzzammil', verses: 20, page: 574 },
  { number: 74, name: 'المدثر', englishName: 'Al-Muddathir', verses: 56, page: 575 },
  { number: 75, name: 'القيامة', englishName: 'Al-Qiyamah', verses: 40, page: 577 },
  { number: 76, name: 'الإنسان', englishName: 'Al-Insan', verses: 31, page: 578 },
  { number: 77, name: 'المرسلات', englishName: 'Al-Mursalat', verses: 50, page: 580 },
  { number: 78, name: 'النبأ', englishName: 'An-Naba', verses: 40, page: 582 },
  { number: 79, name: 'النازعات', englishName: 'An-Nazi\'at', verses: 46, page: 583 },
  { number: 80, name: 'عبس', englishName: '\'Abasa', verses: 42, page: 585 },
  { number: 81, name: 'التكوير', englishName: 'At-Takwir', verses: 29, page: 586 },
  { number: 82, name: 'الانفطار', englishName: 'Al-Infitar', verses: 19, page: 587 },
  { number: 83, name: 'المطففين', englishName: 'Al-Mutaffifin', verses: 36, page: 587 },
  { number: 84, name: 'الانشقاق', englishName: 'Al-Inshiqaq', verses: 25, page: 589 },
  { number: 85, name: 'البروج', englishName: 'Al-Buruj', verses: 22, page: 590 },
  { number: 86, name: 'الطارق', englishName: 'At-Tariq', verses: 17, page: 591 },
  { number: 87, name: 'الأعلى', englishName: 'Al-A\'la', verses: 19, page: 591 },
  { number: 88, name: 'الغاشية', englishName: 'Al-Ghashiyah', verses: 26, page: 592 },
  { number: 89, name: 'الفجر', englishName: 'Al-Fajr', verses: 30, page: 593 },
  { number: 90, name: 'البلد', englishName: 'Al-Balad', verses: 20, page: 594 },
  { number: 91, name: 'الشمس', englishName: 'Ash-Shams', verses: 15, page: 595 },
  { number: 92, name: 'الليل', englishName: 'Al-Layl', verses: 21, page: 595 },
  { number: 93, name: 'الضحى', englishName: 'Ad-Duha', verses: 11, page: 596 },
  { number: 94, name: 'الشرح', englishName: 'Ash-Sharh', verses: 8, page: 596 },
  { number: 95, name: 'التين', englishName: 'At-Tin', verses: 8, page: 597 },
  { number: 96, name: 'العلق', englishName: 'Al-\'Alaq', verses: 19, page: 597 },
  { number: 97, name: 'القدر', englishName: 'Al-Qadr', verses: 5, page: 598 },
  { number: 98, name: 'البينة', englishName: 'Al-Bayyinah', verses: 8, page: 598 },
  { number: 99, name: 'الزلزلة', englishName: 'Az-Zalzalah', verses: 8, page: 599 },
  { number: 100, name: 'العاديات', englishName: 'Al-\'Adiyat', verses: 11, page: 599 },
  { number: 101, name: 'القارعة', englishName: 'Al-Qari\'ah', verses: 11, page: 600 },
  { number: 102, name: 'التكاثر', englishName: 'At-Takathur', verses: 8, page: 600 },
  { number: 103, name: 'العصر', englishName: 'Al-\'Asr', verses: 3, page: 601 },
  { number: 104, name: 'الهمزة', englishName: 'Al-Humazah', verses: 9, page: 601 },
  { number: 105, name: 'الفيل', englishName: 'Al-Fil', verses: 5, page: 601 },
  { number: 106, name: 'قريش', englishName: 'Quraysh', verses: 4, page: 602 },
  { number: 107, name: 'الماعون', englishName: 'Al-Ma\'un', verses: 7, page: 602 },
  { number: 108, name: 'الكوثر', englishName: 'Al-Kawthar', verses: 3, page: 602 },
  { number: 109, name: 'الكافرون', englishName: 'Al-Kafirun', verses: 6, page: 603 },
  { number: 110, name: 'النصر', englishName: 'An-Nasr', verses: 3, page: 603 },
  { number: 111, name: 'المسد', englishName: 'Al-Masad', verses: 5, page: 603 },
  { number: 112, name: 'الإخلاص', englishName: 'Al-Ikhlas', verses: 4, page: 604 },
  { number: 113, name: 'الفلق', englishName: 'Al-Falaq', verses: 5, page: 604 },
  { number: 114, name: 'الناس', englishName: 'An-Nas', verses: 6, page: 604 }
];

// Juz starting pages
const JUZ_PAGES = [1,22,42,62,82,102,121,142,162,182,201,222,242,262,282,302,322,342,362,382,402,422,442,462,482,502,522,542,562,582];

function getJuzForPage(page: number): number {
  for (let i = JUZ_PAGES.length - 1; i >= 0; i--) {
    if (page >= JUZ_PAGES[i]) return i + 1;
  }
  return 1;
}

function toArabicNum(n: number): string {
  const digits = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
  return String(n).split('').map(c => digits[parseInt(c)]).join('');
}

/**
 * Server-side rendered Quran page for SEO
 * Routes: /read-seo/page/:pageNumber, /read-seo/surah/:surahNumber
 */
export async function handleReadPageSSR(
  request: Request,
  env: Env,
  num: number,
  type: 'page' | 'surah'
): Promise<Response> {
  // Determine page number
  let pageNum: number;
  let surahInfo: typeof SURAHS_DATA[0] | undefined;

  if (type === 'surah') {
    if (num < 1 || num > 114) {
      return new Response('Surah not found', { status: 404 });
    }
    surahInfo = SURAHS_DATA[num - 1];
    pageNum = surahInfo.page;
  } else {
    if (num < 1 || num > 604) {
      return new Response('Page not found', { status: 404 });
    }
    pageNum = num;
  }

  // Fetch Quran text from R2 (SEO version with both tashkeel and simple text)
  const r2Key = `assets/quran-text/pages-seo/${pageNum}.json`;
  const object = await env.QURAN_AUDIO_BUCKET.get(r2Key);

  if (!object) {
    return new Response('Page data not found', { status: 404 });
  }

  const pageData = await object.json() as {
    page: number;
    juz: number;
    ayahs: Array<{
      number: number;
      text: string;
      textSimple: string;
      surah: {
        number: number;
        name: string;
        englishName: string;
      };
      numberInSurah: number;
      juz: number;
    }>;
  };

  const juz = pageData.juz || getJuzForPage(pageNum);
  const firstSurah = pageData.ayahs[0]?.surah?.name || '';
  const firstSurahEnglish = pageData.ayahs[0]?.surah?.englishName || '';

  // Group verses by surah for rendering
  const groups: Array<{
    surahNum: number;
    surahName: string;
    verses: typeof pageData.ayahs;
  }> = [];
  let currentGroup: typeof groups[0] | null = null;

  pageData.ayahs.forEach(v => {
    if (!currentGroup || currentGroup.surahNum !== v.surah.number) {
      currentGroup = { surahNum: v.surah.number, surahName: v.surah.name, verses: [] };
      groups.push(currentGroup);
    }
    currentGroup.verses.push(v);
  });

  // Build SEO meta tags - use simple text (no tashkeel) for better search matching
  const pageTitle = type === 'surah'
    ? `سورة ${surahInfo!.name} - ${surahInfo!.englishName} | القرآن الكريم`
    : `صفحة ${toArabicNum(pageNum)} - ${firstSurah} | القرآن الكريم`;

  // Use simple text (no tashkeel) for meta description - better for Google matching
  const firstAyahSimple = pageData.ayahs[0]?.textSimple?.substring(0, 150) || '';
  const metaDescription = type === 'surah'
    ? `اقرأ سورة ${surahInfo!.name} (${surahInfo!.englishName}) كاملة - ${surahInfo!.verses} آية. ${firstAyahSimple}...`
    : `اقرأ صفحة ${toArabicNum(pageNum)} من القرآن الكريم - ${firstSurah}. ${firstAyahSimple}...`;

  const canonicalUrl = type === 'surah'
    ? `https://alfurqan.online/read-seo/surah/${num}`
    : `https://alfurqan.online/read-seo/page/${pageNum}`;

  // Render verses HTML - display tashkeel, include hidden simple text for SEO
  let versesHtml = '';
  groups.forEach(g => {
    const isNewSurah = g.verses[0].numberInSurah === 1;
    if (isNewSurah) {
      versesHtml += `<h3 class="surah-title">${g.surahName}</h3>`;
      // Bismillah for all except Al-Fatiha and At-Tawbah
      if (g.surahNum !== 1 && g.surahNum !== 9) {
        versesHtml += '<p class="bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>';
      }
    }
    versesHtml += '<div class="ayahs-container">';
    g.verses.forEach(v => {
      // Strip Bismillah from first ayah if present (except Al-Fatiha where it IS the ayah)
      let ayahText = v.text;
      let ayahTextSimple = v.textSimple;
      if (v.numberInSurah === 1 && v.surah.number !== 1 && v.surah.number !== 9) {
        const bismillahPattern = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ'.normalize('NFC');
        const bismillahSimple = 'بسم الله الرحمن الرحيم';
        ayahText = ayahText.normalize('NFC').replace(new RegExp('^' + bismillahPattern + '\\s*'), '').trim();
        ayahTextSimple = ayahTextSimple.replace(new RegExp('^' + bismillahSimple + '\\s*'), '').trim();
      }
      // Display tashkeel version, include hidden simple version for SEO
      versesHtml += `<span class="ayah" data-surah="${v.surah.number}" data-ayah="${v.numberInSurah}">`;
      versesHtml += `<span class="ayah-text">${ayahText}</span>`;
      versesHtml += `<span class="ayah-simple" aria-hidden="true">${ayahTextSimple}</span>`;
      versesHtml += `<span class="ayah-num">﴿${toArabicNum(v.numberInSurah)}﴾</span></span> `;
    });
    versesHtml += '</div>';
  });

  // Generate navigation links
  const prevPageUrl = pageNum > 1 ? `/read-seo/page/${pageNum - 1}` : null;
  const nextPageUrl = pageNum < 604 ? `/read-seo/page/${pageNum + 1}` : null;

  // Build simple text for JSON-LD (searchable content)
  const pageTextSimple = pageData.ayahs.map(a => a.textSimple).join(' ');
  const jsonLdText = pageTextSimple.substring(0, 500).replace(/"/g, '\\"');

  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle}</title>
  <meta name="description" content="${metaDescription}">
  <meta name="keywords" content="Quran, القرآن الكريم, ${firstSurah}, ${firstSurahEnglish}, سورة, آية, صفحة ${pageNum}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${canonicalUrl}">
  <link rel="icon" type="image/png" href="/assets/logo.png">
  <meta name="theme-color" content="#1B5E20">

  <!-- Open Graph -->
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Al Furqan - القرآن الكريم">
  <meta property="og:title" content="${pageTitle}">
  <meta property="og:description" content="${metaDescription}">
  <meta property="og:image" content="https://alfurqan.online/assets/logo.png">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:locale" content="ar_SA">

  <!-- Navigation for SEO -->
  ${prevPageUrl ? `<link rel="prev" href="${prevPageUrl}">` : ''}
  ${nextPageUrl ? `<link rel="next" href="${nextPageUrl}">` : ''}

  <!-- Structured Data with searchable Quran text -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "name": "${pageTitle}",
    "description": "${metaDescription}",
    "articleBody": "${jsonLdText}",
    "url": "${canonicalUrl}",
    "inLanguage": "ar",
    "isPartOf": {
      "@type": "Book",
      "name": "القرآن الكريم",
      "alternateName": "The Holy Quran"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Al Furqan",
      "url": "https://alfurqan.online"
    }
  }
  </script>

  <!-- Quran Font -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Amiri+Quran&family=Amiri:wght@400;700&display=swap" rel="stylesheet">

  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    :root {
      --primary-green: #1B5E20;
      --light-green: #4CAF50;
      --accent-green: #81C784;
      --pale-green: #E8F5E9;
      --white: #FFFFFF;
      --text-dark: #212121;
      --text-secondary: #616161;
      --quran-bg: #FFFEF7;
    }
    body {
      font-family: 'Amiri', serif;
      background: var(--quran-bg);
      color: var(--text-dark);
      min-height: 100vh;
    }
    .header {
      background: var(--primary-green);
      color: var(--white);
      padding: 0.75rem 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .header-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      color: var(--white);
    }
    .header-title img { width: 32px; height: 32px; }
    .header-title h1 { font-size: 1.1rem; font-weight: 700; }
    .header-nav { display: flex; gap: 0.5rem; }
    .header-nav a {
      color: var(--white);
      text-decoration: none;
      padding: 0.4rem 0.8rem;
      border-radius: 4px;
      font-size: 0.85rem;
      background: rgba(255,255,255,0.1);
    }
    .header-nav a:hover { background: rgba(255,255,255,0.2); }
    .app-link {
      color: var(--white);
      display: flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      background: rgba(255,255,255,0.15);
      font-size: 0.7rem;
      text-decoration: none;
      transition: background 0.2s;
    }
    .app-link:hover { background: rgba(255,255,255,0.25); }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 1rem;
      background: linear-gradient(180deg, var(--pale-green) 0%, var(--quran-bg) 100%);
    }
    .page-juz { font-size: 0.9rem; color: var(--text-secondary); }
    .page-surah { font-size: 1rem; color: var(--primary-green); font-weight: 600; }
    .surah-title {
      text-align: center;
      font-family: 'Amiri Quran', serif;
      font-size: 1rem;
      color: #313c2e;
      margin: 0.75rem auto 0.5rem;
      padding: 0;
      background-image: url('/assets/surah_header.svg');
      background-size: 100% 100%;
      background-repeat: no-repeat;
      background-position: center;
      width: 280px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
      padding-bottom: 2px;
    }
    .bismillah {
      text-align: center;
      font-family: 'Amiri Quran', serif;
      font-size: 1.4rem;
      color: var(--primary-green);
      padding: 0.5rem 1rem;
      line-height: 2;
    }
    .ayahs-container {
      padding: 0.5rem 1rem 2rem;
      max-width: 800px;
      margin: 0 auto;
      text-align: justify;
    }
    .ayah {
      display: inline;
      font-family: 'Amiri Quran', serif;
      font-size: 1.4rem;
      line-height: 2.2;
      color: var(--text-dark);
    }
    .ayah-num {
      font-family: 'Amiri', serif;
      font-size: 0.75rem;
      color: var(--primary-green);
      vertical-align: super;
      margin: 0 1px;
    }
    /* Hidden simple text for SEO - visually hidden but crawlable by Google */
    .ayah-simple {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
    .nav-footer {
      display: flex;
      justify-content: space-between;
      padding: 1rem;
      background: var(--pale-green);
      border-top: 1px solid #E0E0E0;
    }
    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.6rem 1rem;
      background: var(--primary-green);
      color: var(--white);
      text-decoration: none;
      border-radius: 6px;
      font-size: 0.9rem;
    }
    .nav-link:hover { background: #2E7D32; }
    .nav-link.disabled { opacity: 0.4; pointer-events: none; }
    .read-app-link {
      text-align: center;
      padding: 1rem;
      background: var(--white);
      border-top: 1px solid #E0E0E0;
    }
    .read-app-link a {
      color: var(--primary-green);
      font-size: 0.9rem;
    }
    @media (min-width: 768px) {
      .surah-title { font-size: 1.3rem; width: 400px; height: 42px; }
      .bismillah { font-size: 1.7rem; }
      .ayah { font-size: 1.7rem; line-height: 2.4; }
      .ayah-num { font-size: 0.85rem; }
      .ayahs-container { padding: 1rem 2rem 2rem; }
    }
  </style>
</head>
<body>
  <header class="header">
    <a href="/" class="header-title">
      <img src="/assets/logo.png" alt="Al Furqan">
      <h1>القرآن الكريم</h1>
    </a>
    <a href="https://play.google.com/store/apps/details?id=com.quranmedia.player" class="app-link" target="_blank" rel="noopener">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17,19H7V5H17M17,1H7C5.89,1 5,1.89 5,3V21A2,2 0 0,0 7,23H17A2,2 0 0,0 19,21V3C19,1.89 18.1,1 17,1Z"/></svg>
      <span>التطبيق</span>
    </a>
  </header>

  <main>
    <div class="page-header">
      <span class="page-juz">الجزء ${toArabicNum(juz)}</span>
      <span class="page-surah">${firstSurah}</span>
    </div>

    <article>
      ${versesHtml}
    </article>

    <nav class="nav-footer">
      <a href="${prevPageUrl || '#'}" class="nav-link${!prevPageUrl ? ' disabled' : ''}">
        <span>→</span>
        <span>الصفحة السابقة</span>
      </a>
      <a href="${nextPageUrl || '#'}" class="nav-link${!nextPageUrl ? ' disabled' : ''}">
        <span>الصفحة التالية</span>
        <span>←</span>
      </a>
    </nav>

    <div class="read-app-link">
      <a href="/read?page=${pageNum}">فتح في تطبيق القراءة مع الصوت ←</a>
    </div>
  </main>
</body>
</html>`;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=86400', // 24 hours for SEO pages
    },
  });
}

/**
 * Serve robots.txt for SEO
 */
export function handleRobotsTxt(): Response {
  const robots = `# Al Furqan - Quran Audio API
User-agent: *
Allow: /
Allow: /docs
Allow: /privacy
Allow: /api/

# Sitemaps
Sitemap: https://alfurqan.online/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1
`;

  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}

/**
 * Serve Bing IndexNow key file
 * Required for IndexNow protocol to notify Bing of content changes
 */
export function handleIndexNowKey(): Response {
  return new Response('0c27f4cb527e4b419806d643e343ee94', {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}

/**
 * Serve sitemap.xml for SEO
 * Includes all 604 Quran pages and 114 surahs
 */
export function handleSitemapXml(): Response {
  const today = new Date().toISOString().split('T')[0];

  // Generate surah URLs (SSR paths for crawlable content)
  const surahUrls = Array.from({ length: 114 }, (_, i) => `
  <url>
    <loc>https://alfurqan.online/read-seo/surah/${i + 1}</loc>
    <changefreq>yearly</changefreq>
    <priority>0.9</priority>
  </url>`).join('');

  // Generate page URLs (SSR paths for crawlable content)
  const pageUrls = Array.from({ length: 604 }, (_, i) => `
  <url>
    <loc>https://alfurqan.online/read-seo/page/${i + 1}</loc>
    <changefreq>yearly</changefreq>
    <priority>0.7</priority>
  </url>`).join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://alfurqan.online/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://alfurqan.online/read</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.95</priority>
  </url>
  <url>
    <loc>https://alfurqan.online/docs</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://alfurqan.online/privacy</loc>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>${surahUrls}${pageUrls}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
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
    'surah_header.svg': 'assets/surah_header_green.svg',
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
        : assetPath.endsWith('.svg')
          ? 'image/svg+xml'
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
