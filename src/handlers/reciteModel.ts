// Private model assets — served only to the published app.
// Not documented, not listed in landing/sitemap. Header + UA gating only;
// not authenticated, just inconvenient for casual scrapers.

interface Env {
  RECITE_MODEL_BUCKET: R2Bucket;
}

const REQUIRED_CLIENT_HEADER = 'alfurqan-app-v1';
const SOURCE_PREFIX = 'recite/';

const ALLOWED_PATHS = new Set<string>([
  'manifest.json',
  'v1/quran_ctc_v1.onnx',
  'v1/quran_ctc_v1.onnx.sha256',
  'v1/quran_ctc_v1.labels',
  'v1/quran_ctc_v1.labels.sha256',
]);

// Common scraper UAs. Note: Android apps often use okhttp, so we don't block it here —
// the X-Client header gate already filters non-app callers.
const BLOCKED_UA_PATTERNS = [
  /curl\//i,
  /wget\//i,
  /python-requests/i,
  /python-urllib/i,
  /postman/i,
  /insomnia/i,
  /httpie/i,
  /go-http-client/i,
];

function notFound(): Response {
  return new Response('Not Found', {
    status: 404,
    headers: { 'Access-Control-Allow-Origin': 'null' },
  });
}

function gateRequest(request: Request): boolean {
  const client = request.headers.get('x-client');
  if (client !== REQUIRED_CLIENT_HEADER) return false;

  const ua = request.headers.get('user-agent') || '';
  for (const pattern of BLOCKED_UA_PATTERNS) {
    if (pattern.test(ua)) return false;
  }
  return true;
}

function contentTypeFor(path: string): string {
  if (path.endsWith('.json')) return 'application/json';
  if (path.endsWith('.sha256') || path.endsWith('.labels')) return 'text/plain; charset=utf-8';
  return 'application/octet-stream';
}

export async function handleReciteModelRequest(
  request: Request,
  env: Env,
  subPath: string
): Promise<Response> {
  if (!gateRequest(request)) return notFound();
  if (!ALLOWED_PATHS.has(subPath)) return notFound();

  const key = SOURCE_PREFIX + subPath;
  const range = request.headers.get('range');
  const r2Options: R2GetOptions = {};
  if (range) {
    const match = /^bytes=(\d+)-(\d*)$/.exec(range);
    if (match) {
      const offset = parseInt(match[1], 10);
      const end = match[2] ? parseInt(match[2], 10) : undefined;
      r2Options.range = end !== undefined
        ? { offset, length: end - offset + 1 }
        : { offset };
    }
  }

  const obj = await env.RECITE_MODEL_BUCKET.get(key, r2Options);
  if (!obj) return notFound();

  const headers = new Headers();
  // Suppress permissive CORS — browsers cannot fetch this cross-origin.
  headers.set('Access-Control-Allow-Origin', 'null');
  headers.set('Content-Type', contentTypeFor(subPath));
  headers.set('Cache-Control', 'private, max-age=31536000, immutable');
  headers.set('X-Content-Type-Options', 'nosniff');
  obj.writeHttpMetadata(headers);
  if (obj.size !== undefined) {
    headers.set('Content-Length', String(obj.size));
  }
  if (obj.etag) headers.set('ETag', obj.httpEtag);

  if (range && (obj as any).range) {
    const r: any = (obj as any).range;
    const start = r.offset ?? 0;
    const length = r.length ?? (obj.size - start);
    const end = start + length - 1;
    headers.set('Content-Length', String(length));
    headers.set('Content-Range', `bytes ${start}-${end}/${obj.size}`);
    headers.set('Accept-Ranges', 'bytes');
    return new Response(obj.body, { status: 206, headers });
  }

  headers.set('Accept-Ranges', 'bytes');
  return new Response(obj.body, { status: 200, headers });
}
