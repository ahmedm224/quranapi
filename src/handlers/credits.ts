import { successResponse } from '../utils/response';

/**
 * Handle credits/attribution requests
 * Returns information about data sources and attributions
 */
export async function handleCredits(): Promise<Response> {
  const credits = {
    api: {
      name: 'Quran Audio API',
      version: '1.0.0',
      description: 'Public API for streaming Quran audio recitations',
      repository: '',
      license: 'MIT'
    },
    dataSources: [
      {
        name: 'Tanzil',
        description: 'Quran metadata including surah names, ayah counts, and structure',
        website: 'https://tanzil.net',
        documentation: 'https://tanzil.net/docs',
        attribution: 'Quran metadata sourced from Tanzil.net',
        license: 'Please refer to Tanzil.net for licensing terms'
      },
      {
        name: 'EveryAyah',
        description: 'Quran audio recitations by 44 renowned reciters',
        website: 'https://everyayah.com',
        attribution: 'Audio recordings sourced from EveryAyah.com',
        license: 'Please refer to EveryAyah.com for licensing terms',
        content: {
          reciters: 44,
          totalAyahs: 6236,
          format: 'MP3'
        }
      },
      {
        name: 'Quran SVG',
        description: 'SVG files for the pages of the Quran (Madani Mushaf)',
        website: 'https://github.com/batoulapps/quran-svg',
        attribution: 'SVG pages created by Batoul Apps, sourced from King Fahd Quran Printing Complex',
        license: 'MIT',
        contributors: [
          'Ameir Al-Zoubi (z3bi)',
          'Matthew Crenshaw (sgtsquiggs)'
        ],
        content: {
          totalPages: 604,
          format: 'SVG',
          originalSource: 'King Fahd Quran Printing Complex'
        }
      },
      {
        name: 'Assabile',
        description: 'Athan (Adhan) audio recordings from muezzins worldwide',
        website: 'https://www.assabile.com',
        attribution: 'Athan audio recordings sourced from Assabile.com',
        license: 'Please refer to Assabile.com for licensing terms',
        content: {
          totalAthans: 32,
          muezzins: 'Various renowned muezzins including Abdulbasit Abdusamad, Ali Ibn Ahmad Mala, Yasser Al-Dosari, and more',
          format: 'MP3'
        }
      }
    ],
    acknowledgments: [
      'Tanzil.net for providing comprehensive Quran metadata',
      'EveryAyah.com for providing high-quality Quran audio recitations',
      'Batoul Apps (quran-svg) for providing Quran text in SVG format',
      'King Fahd Quran Printing Complex for the original Quran typography',
      'Assabile.com for providing athan audio recordings',
      'All the reciters and muezzins who have dedicated their time to recording the Quran and athan',
      'The open-source community for tools and libraries'
    ],
    disclaimer: 'This API is provided for educational and religious purposes. Please respect the rights of the original content creators and refer to their respective websites for terms of use.'
  };

  return successResponse(credits);
}
