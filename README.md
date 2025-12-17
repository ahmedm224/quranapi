# Quran Audio API

A public REST API for streaming Quran audio recitations, built on Cloudflare Workers and R2 storage. Access high-quality MP3 recordings from 44 renowned reciters with 6,236 individual ayah files.

**Base URL:** `https://quranapi.cloudlinqed.com`

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
curl https://quranapi.cloudlinqed.com/api/v1/reciters
```

### Stream an Ayah
```bash
# Stream Ayat al-Kursi (Surah 2, Ayah 255) by Mishary Alafasy
curl https://quranapi.cloudlinqed.com/api/v1/audio/misharyalafasy/surah/2/ayah/255 -o ayat-kursi.mp3
```

### Get Surah Information
```bash
curl https://quranapi.cloudlinqed.com/api/v1/surahs/1
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
curl https://quranapi.cloudlinqed.com/api/v1/reciters/misharyalafasy
```

**Response:**
```json
{
  "reciter": {
    "id": "misharyalafasy",
    "name": "Mishary Rashid Alafasy",
    "arabicName": "مشاري بن راشد العفاسي",
    "r2Path": "MisharyAlafasy"
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
curl https://quranapi.cloudlinqed.com/api/v1/surahs/2
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
curl https://quranapi.cloudlinqed.com/api/v1/audio/abdulbasit/1 -o fatiha-1.mp3
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
curl https://quranapi.cloudlinqed.com/api/v1/audio/misharyalafasy/surah/2/ayah/255 -o ayat-kursi.mp3

# Stream Al-Ikhlas complete (Surah 112, Ayahs 1-4)
curl https://quranapi.cloudlinqed.com/api/v1/audio/saadalghaamdi/surah/112/ayah/1 -o ikhlas-1.mp3
curl https://quranapi.cloudlinqed.com/api/v1/audio/saadalghaamdi/surah/112/ayah/2 -o ikhlas-2.mp3
curl https://quranapi.cloudlinqed.com/api/v1/audio/saadalghaamdi/surah/112/ayah/3 -o ikhlas-3.mp3
curl https://quranapi.cloudlinqed.com/api/v1/audio/saadalghaamdi/surah/112/ayah/4 -o ikhlas-4.mp3
```

**Features:**
- ✅ HTTP Range requests supported (seekable audio)
- ✅ Cached for 1 year (immutable)
- ✅ Direct streaming from Cloudflare R2

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
curl "https://quranapi.cloudlinqed.com/api/v1/search?q=fatiha&type=surah"
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
curl "https://quranapi.cloudlinqed.com/api/v1/search?q=mishary&type=reciter"
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
const response = await fetch('https://quranapi.cloudlinqed.com/api/v1/reciters');
const { reciters } = await response.json();

// Get surah metadata
const surahResponse = await fetch('https://quranapi.cloudlinqed.com/api/v1/surahs/1');
const { surah } = await surahResponse.json();

// Stream audio in HTML5 audio player
const audioUrl = 'https://quranapi.cloudlinqed.com/api/v1/audio/misharyalafasy/surah/2/ayah/255';
const audio = new Audio(audioUrl);
audio.play();
```

**React Example:**
```jsx
import { useState, useEffect } from 'react';

function QuranPlayer() {
  const [reciters, setReciters] = useState([]);
  const [selectedReciter, setSelectedReciter] = useState('misharyalafasy');

  useEffect(() => {
    fetch('https://quranapi.cloudlinqed.com/api/v1/reciters')
      .then(res => res.json())
      .then(data => setReciters(data.reciters));
  }, []);

  const playAyah = (surah, ayah) => {
    const audioUrl = `https://quranapi.cloudlinqed.com/api/v1/audio/${selectedReciter}/surah/${surah}/ayah/${ayah}`;
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
- **Headers:** `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- **Response:** `429 Too Many Requests` when limit exceeded

For higher limits, please contact us or deploy your own instance.

---

## Available Reciters

The API provides audio from 44 renowned Quran reciters:

- Abdul Basit Abdul Samad (abdulbasit)
- Mishary Rashid Alafasy (misharyalafasy)
- Saad Al-Ghamdi (saadalghaamdi)
- Mahmoud Khalil Al-Hussary (husary)
- Abu Bakr Al-Shatri (abubakralsha)
- Ahmed Ajamy (ahmedajamy)
- Maher Al-Muaiqly (mahermuaiqly)
- Nasser Al-Qatami (nasser)
- Saud Al-Shuraim (saoodshuraym)
- Yasser Ad-Dussary (yasser)
- And 34 more...

[See full list →](#) (Use `/api/v1/reciters` endpoint)

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

---

## Acknowledgments

We are deeply grateful to:

- **Tanzil.net** for providing comprehensive and accurate Quran metadata
- **EveryAyah.com** for making high-quality Quran recitations freely available
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
- **Total Reciters:** 44

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
