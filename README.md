# Al Furqan - Quran Audio API & App

A public REST API for streaming Quran audio recitations, built on Cloudflare Workers and R2 storage. Access high-quality MP3 recordings from 44 renowned reciters with 6,236 individual ayah files.

**Website:** https://alfurqan.online

**API Base URL:** `https://alfurqan.online` or `https://api.alfurqan.online`

**Mobile App:** [Download on Google Play](https://play.google.com/store/apps/details?id=com.quranmedia.player)

---

## Features

- 🎧 **44 Reciters** - Stream audio from renowned Quran reciters
- 📖 **6,236 Ayahs** - Complete Quran coverage with individual ayah files
- 🌍 **Global CDN** - Low-latency access via Cloudflare's edge network
- 🔍 **Search** - Find surahs and reciters by name
- 📊 **Metadata** - Complete surah information with ayah counts
- 🚀 **Fast & Reliable** - Serverless architecture with 99.9% uptime
- 🆓 **Free & Public** - No authentication required
- 🔓 **CORS Enabled** - Use from any web application

---

## Quick Start

### Get All Reciters
```bash
curl https://alfurqan.online/api/v1/reciters
```

### Stream an Ayah
```bash
# Stream Ayat al-Kursi (Surah 2, Ayah 255) by Abdul Basit
curl https://alfurqan.online/api/v1/audio/abdul-basit-murattal/surah/2/ayah/255 -o ayat-kursi.mp3
```

### Get Surah Information
```bash
curl https://alfurqan.online/api/v1/surahs/1
```

---

## API Endpoints

### Health Check
```
GET /api/health
```

Returns API status and version information.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-17T12:00:00.000Z",
  "version": "1.0.0",
  "service": "Quran Audio API"
}
```

---

### Reciters

#### List All Reciters
```
GET /api/v1/reciters
```

Returns a list of all 44 available reciters.

**Response:**
```json
{
  "count": 44,
  "reciters": [
    {
      "id": "abdulbasit",
      "name": "Abdul Basit Abdul Samad",
      "arabicName": "عبد الباسط عبد الصمد",
      "r2Path": "AbdulBaset"
    },
    ...
  ]
}
```

#### Get Specific Reciter
```
GET /api/v1/reciters/:reciterId
```

Returns details for a specific reciter.

**Parameters:**
- `reciterId` (string, required) - Reciter identifier

**Example:**
```bash
curl https://alfurqan.online/api/v1/reciters/abdul-basit-murattal
```

**Response:**
```json
{
  "reciter": {
    "id": "abdul-basit-murattal",
    "name": "Abdul Basit Abdul Samad (Murattal)",
    "arabicName": "عبد الباسط عبد الصمد (مرتل)",
    "r2Path": "Abdul_Basit_Murattal_192kbps"
  }
}
```

---

### Surahs

#### List All Surahs
```
GET /api/v1/surahs
```

Returns a list of all 114 surahs with metadata.

**Response:**
```json
{
  "count": 114,
  "surahs": [
    {
      "number": 1,
      "name": "الفاتحة",
      "transliteration": "Al-Fatihah",
      "translation": "The Opening",
      "ayahCount": 7,
      "startAyah": 1,
      "endAyah": 7,
      "revelationType": "Meccan"
    },
    ...
  ]
}
```

#### Get Specific Surah
```
GET /api/v1/surahs/:surahNumber
```

Returns details for a specific surah.

**Parameters:**
- `surahNumber` (integer, required) - Surah number (1-114)

**Example:**
```bash
curl https://alfurqan.online/api/v1/surahs/2
```

**Response:**
```json
{
  "surah": {
    "number": 2,
    "name": "البقرة",
    "transliteration": "Al-Baqarah",
    "translation": "The Cow",
    "ayahCount": 286,
    "startAyah": 8,
    "endAyah": 293,
    "revelationType": "Medinan"
  }
}
```

---

### Audio Streaming

#### Stream Ayah by Global Number
```
GET /api/v1/audio/:reciterId/:ayahNumber
```

Stream an ayah using the global ayah number (1-6236).

**Parameters:**
- `reciterId` (string, required) - Reciter identifier
- `ayahNumber` (integer, required) - Global ayah number (1-6236)

**Example:**
```bash
# Stream the first ayah (Al-Fatihah 1:1)
curl https://alfurqan.online/api/v1/audio/husary/1 -o fatiha-1.mp3
```

#### Stream Specific Ayah in Surah
```
GET /api/v1/audio/:reciterId/surah/:surahNumber/ayah/:ayahInSurah
```

Stream a specific ayah within a surah.

**Parameters:**
- `reciterId` (string, required) - Reciter identifier
- `surahNumber` (integer, required) - Surah number (1-114)
- `ayahInSurah` (integer, required) - Ayah number within the surah

**Examples:**
```bash
# Stream Ayat al-Kursi (Surah 2, Ayah 255)
curl https://alfurqan.online/api/v1/audio/abdul-basit-murattal/surah/2/ayah/255 -o ayat-kursi.mp3

# Stream Al-Ikhlas complete (Surah 112, Ayahs 1-4)
curl https://alfurqan.online/api/v1/audio/ghamadi/surah/112/ayah/1 -o ikhlas-1.mp3
curl https://alfurqan.online/api/v1/audio/ghamadi/surah/112/ayah/2 -o ikhlas-2.mp3
curl https://alfurqan.online/api/v1/audio/ghamadi/surah/112/ayah/3 -o ikhlas-3.mp3
curl https://alfurqan.online/api/v1/audio/ghamadi/surah/112/ayah/4 -o ikhlas-4.mp3
```

**Features:**
- ✅ HTTP Range requests supported (seekable audio)
- ✅ Cached for 1 year (immutable)
- ✅ Direct streaming from Cloudflare R2

---

### Quran Text (SVG Pages)

High-quality SVG pages of the Quran (Madani Mushaf) for displaying Quran text in applications.

#### Get Manifest
```
GET /api/v1/quran-text/manifest
```

Returns version info and metadata about available pages.

**Response:**
```json
{
  "name": "Quran Text SVG",
  "version": "1.0.0",
  "totalPages": 604,
  "format": "svg",
  "source": {
    "name": "quran-svg",
    "url": "https://github.com/batoulapps/quran-svg",
    "license": "MIT",
    "originalSource": "King Fahd Quran Printing Complex"
  }
}
```

#### Get Single Page
```
GET /api/v1/quran-text/page/:pageNumber
```

Download a single SVG page.

**Parameters:**
- `pageNumber` (integer, required) - Page number (1-604)

**Example:**
```bash
# Download page 1 (Al-Fatihah)
curl https://alfurqan.online/api/v1/quran-text/page/1 -o page-1.svg

# Download page 604 (last page)
curl https://alfurqan.online/api/v1/quran-text/page/604 -o page-604.svg
```

**Response:** SVG file with headers:
- `Content-Type: image/svg+xml`
- `Cache-Control: public, max-age=31536000, immutable`

#### Download All Pages (ZIP)
```
GET /api/v1/quran-text/download
```

Download complete bundle of all 604 pages as a ZIP file (~384 MB).

**Example:**
```bash
curl https://alfurqan.online/api/v1/quran-text/download -o quran-pages.zip
```

**Use Case:** Ideal for mobile apps to download Quran text for offline use after installation.

---

### Athan (Call to Prayer)

Audio recordings of the Athan (Adhan) from various muezzins worldwide.

#### Get Manifest
```
GET /api/v1/athan/manifest
```

Returns version info and metadata about available athans.

**Response:**
```json
{
  "name": "Athan Audio Collection",
  "version": "1.0.0",
  "totalAthans": 32,
  "source": {
    "name": "Assabile",
    "url": "https://www.assabile.com"
  }
}
```

#### List All Muezzins
```
GET /api/v1/athan/muezzins
```

Returns a list of all available muezzins.

**Response:**
```json
{
  "count": 21,
  "muezzins": [
    {
      "name": "Nasser Al Obaid",
      "location": "Saudi Arabia",
      "count": 2
    },
    ...
  ]
}
```

#### List All Athans
```
GET /api/v1/athan/list
```

Returns all available athan recordings. Supports filtering.

**Query Parameters:**
- `muezzin` (string, optional) - Filter by muezzin name
- `location` (string, optional) - Filter by location

**Examples:**
```bash
# Get all athans
curl https://alfurqan.online/api/v1/athan/list

# Filter by muezzin
curl "https://alfurqan.online/api/v1/athan/list?muezzin=Nasser"

# Filter by location
curl "https://alfurqan.online/api/v1/athan/list?location=Egypt"
```

**Response:**
```json
{
  "count": 32,
  "athans": [
    {
      "id": "1a014366658c",
      "name": "Abdulbasit Abdusamad",
      "muezzin": "Abdulbasit Abdusamad",
      "location": "Egypt",
      "audioUrl": "/api/v1/athan/1a014366658c"
    },
    ...
  ]
}
```

#### Stream Athan Audio
```
GET /api/v1/athan/:id
```

Stream a specific athan recording.

**Parameters:**
- `id` (string, required) - Athan identifier

**Example:**
```bash
# Stream Abdulbasit Abdusamad's athan
curl https://alfurqan.online/api/v1/athan/1a014366658c -o athan.mp3
```

#### Download All Athans (ZIP)
```
GET /api/v1/athan/download
```

Download complete bundle of all athan recordings as a ZIP file.

**Example:**
```bash
curl https://alfurqan.online/api/v1/athan/download -o athan-collection.zip
```

---

### Search

```
GET /api/v1/search?q=<query>&type=<type>
```

Search for surahs or reciters.

**Parameters:**
- `q` (string, required) - Search query
- `type` (string, required) - Search type: `surah` or `reciter`

**Examples:**

Search for surahs:
```bash
curl "https://alfurqan.online/api/v1/search?q=fatiha&type=surah"
```

**Response:**
```json
{
  "query": "fatiha",
  "type": "surah",
  "count": 1,
  "results": [
    {
      "number": 1,
      "name": "الفاتحة",
      "transliteration": "Al-Fatihah",
      "translation": "The Opening",
      "ayahCount": 7,
      ...
    }
  ]
}
```

Search for reciters:
```bash
curl "https://alfurqan.online/api/v1/search?q=mishary&type=reciter"
```

**Response:**
```json
{
  "query": "mishary",
  "type": "reciter",
  "count": 1,
  "results": [
    {
      "id": "misharyalafasy",
      "name": "Mishary Rashid Alafasy",
      "arabicName": "مشاري بن راشد العفاسي",
      "r2Path": "MisharyAlafasy"
    }
  ]
}
```

---

### Credits & Attribution

```
GET /api/v1/credits
```

Returns attribution information for data sources.

**Response:**
```json
{
  "api": {
    "name": "Quran Audio API",
    "version": "1.0.0",
    ...
  },
  "dataSources": [
    {
      "name": "Tanzil",
      "description": "Quran metadata including surah names, ayah counts, and structure",
      "website": "https://tanzil.net",
      ...
    },
    {
      "name": "EveryAyah",
      "description": "Quran audio recitations by 44 renowned reciters",
      "website": "https://everyayah.com",
      ...
    }
  ],
  ...
}
```

---

## JavaScript/TypeScript Usage

```javascript
// Fetch all reciters
const response = await fetch('https://alfurqan.online/api/v1/reciters');
const { reciters } = await response.json();

// Get surah metadata
const surahResponse = await fetch('https://alfurqan.online/api/v1/surahs/1');
const { surah } = await surahResponse.json();

// Stream audio in HTML5 audio player
const audioUrl = 'https://alfurqan.online/api/v1/audio/husary/surah/2/ayah/255';
const audio = new Audio(audioUrl);
audio.play();
```

**React Example:**
```jsx
import { useState, useEffect } from 'react';

function QuranPlayer() {
  const [reciters, setReciters] = useState([]);
  const [selectedReciter, setSelectedReciter] = useState('husary');

  useEffect(() => {
    fetch('https://alfurqan.online/api/v1/reciters')
      .then(res => res.json())
      .then(data => setReciters(data.reciters));
  }, []);

  const playAyah = (surah, ayah) => {
    const audioUrl = `https://alfurqan.online/api/v1/audio/${selectedReciter}/surah/${surah}/ayah/${ayah}`;
    const audio = new Audio(audioUrl);
    audio.play();
  };

  return (
    <div>
      <select onChange={(e) => setSelectedReciter(e.target.value)}>
        {reciters.map(r => (
          <option key={r.id} value={r.id}>{r.name}</option>
        ))}
      </select>
      <button onClick={() => playAyah(1, 1)}>Play Al-Fatihah 1:1</button>
    </div>
  );
}
```

---

## Rate Limiting

- **Limit:** 100 requests per minute per IP address
- **Headers:** All responses include rate limit headers:
  - `X-RateLimit-Limit: 100` - Maximum requests per window
  - `X-RateLimit-Remaining: <number>` - Requests remaining in current window
  - `X-RateLimit-Reset: <ISO-timestamp>` - When the rate limit window resets
- **Response:** `429 Too Many Requests` when limit exceeded

For higher limits, please contact us or deploy your own instance.

---

## Caching & Performance

The API is optimized for high performance with aggressive caching:

**Metadata Endpoints** (Immutable - Cached for 1 year)
- `/api/v1/reciters` - List of reciters rarely changes
- `/api/v1/surahs` - Quran structure is fixed (114 surahs)
- `Cache-Control: public, max-age=31536000, immutable`

**Search Endpoint** (Cached for 24 hours)
- `/api/v1/search` - Search results cached to reduce load
- `Cache-Control: public, max-age=86400`

**Audio Files** (Immutable - Cached for 1 year)
- `/api/v1/audio/*` - MP3 files never change
- `Cache-Control: public, max-age=31536000, immutable`
- HTTP Range requests supported for seeking

Cloudflare's global CDN caches these responses at edge locations worldwide, ensuring fast response times and minimal origin load.

---

## Available Reciters

The API provides audio from **44 renowned Quran reciters** including:

### Main Reciters (41)
- **Abdul Basit Abdul Samad** - Murattal & Mujawwad styles (`abdul-basit-murattal`, `abdul-basit-mujawwad`)
- **Mahmoud Khalil Al-Hussary** - Murattal & Mujawwad styles (`husary`, `husary-mujawwad`)
- **Mohamed Siddiq Al-Minshawi** - Murattal & Mujawwad styles (`minshawy-murattal`, `minshawy-mujawwad`)
- **Saad Al-Ghamdi** (`ghamadi`)
- **Maher Al-Muaiqly** (`maher-almuaiqly`)
- **Muhammad Ayyub** (`muhammad-ayyoub`)
- **Abu Bakr Al-Shatri** (`abu-bakr-shatri`)
- **Hani Ar-Rifai** (`hani-rifai`)
- **Ahmed al-Ajamy** (`ahmed-al-ajamy`)
- **Nasser Al-Qatami** (`nasser-alqatami`)
- **Yasser Ad-Dussary** (`yasser-ad-dussary`)
- **Saud Al-Shuraim** (`saood-ash-shuraym`)
- **Abdullah Basfar** (`abdullah-basfar`)
- And 28 more...

### Warsh Recitation Style (3)
- **Abdul Basit (Warsh)** (`warsh-abdul-basit`)
- **Ibrahim Al-Dosary (Warsh)** (`warsh-ibrahim-aldosary`)
- **Yassin Al-Jazaery (Warsh)** (`warsh-yassin-al-jazaery`)

**Full List:** Use the `/api/v1/reciters` endpoint to get all reciters with their IDs and Arabic names.

---

## Data Sources & Attribution

### Tanzil.net

This API uses Quran metadata from **Tanzil.net**, including:
- Surah names (Arabic and transliteration)
- Ayah counts for each surah
- Revelation types (Meccan/Medinan)
- Ayah numbering structure

**Website:** https://tanzil.net
**Documentation:** https://tanzil.net/docs

### EveryAyah.com

Audio recordings are sourced from **EveryAyah.com**:
- 44 renowned reciters
- 6,236 individual ayah recordings
- High-quality MP3 format

**Website:** https://everyayah.com

### Quran SVG (Batoul Apps)

SVG pages of the Quran are sourced from the **quran-svg** project:
- 604 high-quality SVG pages (Madani Mushaf)
- Originally from King Fahd Quran Printing Complex
- MIT License

**Repository:** https://github.com/batoulapps/quran-svg
**Contributors:** Ameir Al-Zoubi, Matthew Crenshaw

---

## Acknowledgments

We are deeply grateful to:

- **Tanzil.net** for providing comprehensive and accurate Quran metadata
- **EveryAyah.com** for making high-quality Quran recitations freely available
- **Batoul Apps** for creating the quran-svg project with beautiful SVG pages
- **King Fahd Quran Printing Complex** for the original Quran typography
- All the **reciters** who have dedicated their time and talent to recording the Quran
- The **open-source community** for the tools and libraries that made this project possible

This API is provided for educational and religious purposes. Please respect the rights of the original content creators.

---

## Technical Details

- **Platform:** Cloudflare Workers + R2
- **Language:** TypeScript
- **Router:** itty-router
- **CDN:** Cloudflare Edge Network
- **Storage:** R2 Object Storage (bucket: "alfurqan")
- **Audio Format:** MP3
- **Total Ayahs:** 6,236
- **Total Reciters:** 44 (41 standard + 3 Warsh)

### Audio File Structure

Files are stored in R2 using the format: `SSSAAA.mp3` where:
- **SSS** = Surah number (3 digits, zero-padded)
- **AAA** = Ayah number within surah (3 digits, zero-padded)

**Examples:**
- `001001.mp3` = Surah 1, Ayah 1 (Al-Fatihah, first ayah)
- `002255.mp3` = Surah 2, Ayah 255 (Ayat al-Kursi)
- `114006.mp3` = Surah 114, Ayah 6 (last ayah of the Quran)

**Path Structure:**
- Standard reciters: `reciter-folder/SSSAAA.mp3`
- Warsh reciters: `warsh/reciter-folder/SSSAAA.mp3`

---

## Development

### Prerequisites

- Node.js 18+
- npm or yarn
- Cloudflare account
- Wrangler CLI

### Setup

```bash
# Install dependencies
npm install

# Configure Cloudflare credentials
wrangler login

# Run locally
npm run dev

# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy:production
```

### Project Structure

```
quranapi/
├── src/
│   ├── index.ts              # Main worker entry point
│   ├── handlers/             # Request handlers
│   │   ├── audio.ts
│   │   ├── reciters.ts
│   │   ├── surahs.ts
│   │   ├── search.ts
│   │   └── credits.ts
│   ├── middleware/           # CORS, rate limiting, errors
│   ├── utils/                # Utilities and helpers
│   └── data/                 # Surah and reciter metadata
├── wrangler.toml             # Cloudflare config
├── package.json
└── tsconfig.json
```

---

## License

MIT License - Feel free to use this API in your projects!

---

## Support

For issues, questions, or contributions, please visit:
- GitHub: [Your Repository URL]
- Email: [Your Contact Email]

---

**Built with ❤️ for the Muslim community**

*May Allah accept this work and make it beneficial for all.*
