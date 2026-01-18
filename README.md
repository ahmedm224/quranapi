# Al Furqan - Quran Audio API & App

A public REST API for streaming Quran audio recitations, built on Cloudflare Workers and R2 storage. Access high-quality MP3 recordings from 44 renowned reciters with 6,236 individual ayah files.

**Website:** https://alfurqan.online

**API Base URL:** `https://alfurqan.online` or `https://api.alfurqan.online`

**Mobile App:** [Download on Google Play](https://play.google.com/store/apps/details?id=com.quranmedia.player)

---

## Features

- 🎧 **44 Reciters** - Stream audio from renowned Quran reciters
- 📖 **6,236 Ayahs** - Complete Quran coverage with individual ayah files
- 📚 **8 Tafseers** - Arabic & English tafseer with word-by-word meanings
- 🔤 **QCF Fonts** - 604 page fonts for authentic Mushaf rendering (V4 Tajweed + V2 Plain)
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

### QCF Fonts (Quran Complex Fonts)

Page-specific fonts for authentic Mushaf rendering. Each page (1-604) has its own font file with glyph mappings for pixel-perfect Quran display.

#### Get Manifest
```
GET /api/v1/quran-fonts/manifest
```

Returns metadata about available fonts and usage instructions.

**Response:**
```json
{
  "name": "Quran Complex Fonts (QCF)",
  "version": "1.0.0",
  "totalPages": 604,
  "fonts": {
    "v4": {
      "name": "QCF V4 - Tajweed",
      "description": "COLRv1 fonts with embedded Tajweed color layers. Colors cannot be overridden.",
      "format": "ttf",
      "glyphCodes": "qpcV2"
    },
    "v2": {
      "name": "QCF V2 - Plain",
      "description": "Plain black fonts that accept text color customization via CSS/styling.",
      "format": "ttf",
      "glyphCodes": "qpcV2"
    }
  },
  "layout": {
    "name": "Mushaf Layout",
    "description": "Pre-computed line/word layout with qpcV1 and qpcV2 glyph codes for each page"
  }
}
```

#### Get V4 Tajweed Font
```
GET /api/v1/quran-fonts/v4/:pageNumber
```

Download a V4 Tajweed font file (TTF) with embedded color layers for Tajweed rules.

**Parameters:**
- `pageNumber` (integer, required) - Page number (1-604)

**Example:**
```bash
# Download Tajweed font for page 1
curl https://alfurqan.online/api/v1/quran-fonts/v4/1 -o p1-tajweed.ttf
```

**Features:**
- COLRv1 color font technology
- Embedded Tajweed color rules (red for ghunnah, green for ikhfa, etc.)
- Colors cannot be overridden via CSS

#### Get V2 Plain Font
```
GET /api/v1/quran-fonts/v2/:pageNumber
```

Download a V2 Plain font file (TTF) that accepts custom text colors.

**Parameters:**
- `pageNumber` (integer, required) - Page number (1-604)

**Example:**
```bash
# Download plain font for page 1
curl https://alfurqan.online/api/v1/quran-fonts/v2/1 -o p1-plain.ttf
```

**Features:**
- Standard TTF font
- Accepts text color customization via CSS `color` property
- Ideal for custom themes (dark mode, sepia, etc.)

#### Get Mushaf Layout
```
GET /api/v1/quran-fonts/layout/:pageNumber
```

Get the pre-computed layout JSON for a page, containing line and word positions with glyph codes.

**Parameters:**
- `pageNumber` (integer, required) - Page number (1-604)

**Example:**
```bash
curl https://alfurqan.online/api/v1/quran-fonts/layout/1
```

**Response:**
```json
{
  "page": 1,
  "lines": [
    {
      "line": 9,
      "type": "surah-header",
      "surah": 1,
      "text": "سُورَةُ ٱلْفَاتِحَةِ"
    },
    {
      "line": 9,
      "type": "basmala",
      "text": "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ ١",
      "verseRange": "1:1-1:1",
      "words": [
        {
          "location": "1:1:1",
          "word": "بِسْمِ",
          "qpcV2": "ﱁ",
          "qpcV1": "ﭑ"
        },
        {
          "location": "1:1:2",
          "word": "ٱللَّهِ",
          "qpcV2": "ﱂ",
          "qpcV1": "ﭒ"
        }
      ]
    }
  ]
}
```

#### Usage Notes

**Word Spacing (Critical):**
```javascript
// CORRECT - words must be separated by space
const glyphText = line.words.map(w => w.qpcV2).join(' ');

// WRONG - words will attach together incorrectly
const glyphText = line.words.map(w => w.qpcV2).join('');
```

**Glyph Codes:**
- Both V4 and V2 fonts use `qpcV2` glyph codes (not `qpcV1`)
- The `qpcV1` codes are included for backwards compatibility but are not recommended

**Basmala Handling:**
Basmala lines (type: "basmala") may not have `words` array with qpcV2 codes. Use the `text` field directly with a standard Arabic font, or use this Unicode text:
```javascript
const basmala = "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ";
```

**Font Sources:**
- V4 Tajweed: https://verses.quran.foundation/fonts/quran/hafs/v4/ttf/
- V2 Plain: https://github.com/nuqayah/qpc-fonts/tree/master/mushaf-v2
- Layout JSON: https://github.com/zonetecde/mushaf-layout

---

### Tafseer (Quran Exegesis)

Quran tafseer (exegesis) and word-by-word meanings from renowned scholars.

#### Get Manifest
```
GET /api/v1/tafseer/manifest
```

Returns metadata about all available tafseers.

**Response:**
```json
{
  "name": "Quran Tafseer API",
  "version": "1.0.0",
  "total": 8,
  "types": { "tafseer": 6, "word-meanings": 2 },
  "languages": { "arabic": 5, "english": 3 },
  "tafseers": [
    {
      "id": "ibn-kathir-english",
      "name_en": "Tafsir Ibn Kathir",
      "name_ar": "تفسير ابن كثير",
      "language": "english",
      "type": "tafseer"
    }
  ]
}
```

#### List All Tafseers
```
GET /api/v1/tafseer/list
```

Returns a simple list of available tafseers.

**Available Tafseers:**

| ID | Name | Language | Type |
|----|------|----------|------|
| `word-by-word-english` | Word by Word Translation | English | Word Meanings |
| `mufradat` | Quran Mufradat (مفردات القرآن) | Arabic | Word Meanings |
| `ibn-kathir-english` | Tafsir Ibn Kathir | English | Tafseer |
| `maarif-ul-quran` | Ma'ariful Quran | English | Tafseer |
| `al-saddi` | Tafsir Al-Saddi (تفسير السعدي) | Arabic | Tafseer |
| `al-tabari` | Tafsir Al-Tabari (تفسير الطبري) | Arabic | Tafseer |
| `ibn-kathir` | Tafsir Ibn Kathir (تفسير ابن كثير) | Arabic | Tafseer |
| `muyassar` | Al-Tafsir Al-Muyassar (التفسير الميسر) | Arabic | Tafseer |

#### Get Tafseer for Surah
```
GET /api/v1/tafseer/:tafseerId/surah/:surahNumber
```

Get complete tafseer for a surah.

**Parameters:**
- `tafseerId` (string, required) - Tafseer identifier from the list above
- `surahNumber` (integer, required) - Surah number (1-114)

**Example:**
```bash
curl https://alfurqan.online/api/v1/tafseer/muyassar/surah/1
```

**Response:**
```json
{
  "tafseer": {
    "id": "muyassar",
    "name_en": "Al-Tafsir Al-Muyassar",
    "name_ar": "التفسير الميسر",
    "language": "arabic"
  },
  "surah": {
    "number": 1,
    "name": "الفاتحة",
    "ayahs": [
      { "ayah": 1, "text": "سورة الفاتحة سميت هذه السورة بالفاتحة..." },
      { "ayah": 2, "text": "(الحَمْدُ للهِ رَبِّ العَالَمِينَ)..." }
    ]
  }
}
```

#### Get Tafseer for Specific Ayah
```
GET /api/v1/tafseer/:tafseerId/surah/:surahNumber/ayah/:ayahNumber
```

Get tafseer for a specific ayah.

**Parameters:**
- `tafseerId` (string, required) - Tafseer identifier
- `surahNumber` (integer, required) - Surah number (1-114)
- `ayahNumber` (integer, required) - Ayah number within the surah

**Example:**
```bash
# Get Ibn Kathir English tafseer for Ayat al-Kursi (2:255)
curl https://alfurqan.online/api/v1/tafseer/ibn-kathir-english/surah/2/ayah/255
```

**Response:**
```json
{
  "tafseer": {
    "id": "ibn-kathir-english",
    "name_en": "Tafsir Ibn Kathir",
    "language": "english"
  },
  "surah": { "number": 2, "name": "Al-Baqara" },
  "ayah": {
    "ayah": 255,
    "text": "This is Ayat Al-Kursi (the Verse of the Footstool)..."
  }
}
```

#### Word by Word Response

For `word-by-word-english`, the response includes detailed word analysis:

```json
{
  "ayah": {
    "ayah": 1,
    "words": [
      {
        "position": 1,
        "arabic": "بِسْمِ",
        "translation": "In (the) name",
        "transliteration": "bis'mi"
      },
      {
        "position": 2,
        "arabic": "ٱللَّهِ",
        "translation": "(of) Allah",
        "transliteration": "l-lahi"
      }
    ]
  }
}
```

#### List Tafseer Downloads
```
GET /api/v1/tafseer/downloads
```

Returns a list of all available tafseer ZIP files for download.

**Response:**
```json
{
  "count": 8,
  "downloads": [
    {
      "id": "ibn-kathir-english",
      "name_en": "Tafsir Ibn Kathir",
      "name_ar": "تفسير ابن كثير",
      "language": "english",
      "type": "tafseer",
      "download_url": "/api/v1/tafseer/download/ibn-kathir-english"
    }
  ]
}
```

#### Download Tafseer ZIP
```
GET /api/v1/tafseer/download/:tafseerId
```

Download a complete tafseer as a ZIP archive for offline use in mobile apps.

**Parameters:**
- `tafseerId` (string, required) - Tafseer identifier from the list

**Example:**
```bash
# Download Al-Tafsir Al-Muyassar
curl -O https://alfurqan.online/api/v1/tafseer/download/muyassar

# Download Ibn Kathir English
curl -O https://alfurqan.online/api/v1/tafseer/download/ibn-kathir-english
```

**Response:** ZIP file containing the complete tafseer JSON data.

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

**Features:**
- ✅ HTTP Range requests supported (seekable audio)
- ✅ Cached for 1 year (immutable)
- ✅ Direct streaming from Cloudflare R2

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
- `/api/v1/audio/*` - Quran recitation MP3 files
- `/api/v1/athan/:id` - Athan audio MP3 files
- `Cache-Control: public, max-age=31536000, immutable`
- HTTP Range requests supported for seeking (iOS/Android compatible)

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

### QCF Fonts (Quran Complex Fonts)

Page-specific fonts from the **King Fahd Quran Printing Complex**:
- 604 V4 Tajweed fonts with COLRv1 color layers
- 604 V2 Plain fonts for custom styling
- Original typography from the Madani Mushaf

**V4 Source:** https://verses.quran.foundation/fonts/quran/hafs/v4/ttf/
**V2 Source:** https://github.com/nuqayah/qpc-fonts/tree/master/mushaf-v2

### Mushaf Layout

Pre-computed page layouts from the **mushaf-layout** project:
- 604 JSON files with line/word positions
- qpcV1 and qpcV2 glyph codes for font rendering

**Repository:** https://github.com/zonetecde/mushaf-layout

---

## Acknowledgments

We are deeply grateful to:

- **Tanzil.net** for providing comprehensive and accurate Quran metadata
- **EveryAyah.com** for making high-quality Quran recitations freely available
- **Batoul Apps** for creating the quran-svg project with beautiful SVG pages
- **King Fahd Quran Printing Complex** for the original Quran typography and QCF fonts
- **Quran Foundation** for hosting V4 Tajweed fonts with COLRv1 color technology
- **Nuqayah** for maintaining the QPC fonts repository (V2 plain fonts)
- **Zonetecde** for the mushaf-layout project with pre-computed page layouts
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
