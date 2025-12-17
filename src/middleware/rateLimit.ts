import { errorResponse } from '../utils/response';

// Simple in-memory rate limiter
// NOTE: This resets on worker restart. For production, use Cloudflare Dashboard Rate Limiting
interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Rate limit configuration
const RATE_LIMIT = 100; // requests per window
const WINDOW_MS = 60000; // 1 minute

/**
 * Rate limiting middleware
 * Limits requests to 100 per minute per IP address
 * NOTE: For production use, configure rate limiting in Cloudflare Dashboard
 */
export function rateLimitMiddleware(request: any): Response | void {
  // Get client IP
  const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';

  // Check rate limit
  const now = Date.now();
  const record = rateLimitMap.get(clientIP);

  if (!record || now > record.resetAt) {
    // Create new record or reset existing
    rateLimitMap.set(clientIP, {
      count: 1,
      resetAt: now + WINDOW_MS,
    });

    // Clean up old entries periodically
    if (rateLimitMap.size > 10000) {
      cleanupRateLimitMap(now);
    }

    return; // Continue to next handler
  }

  // Check if limit exceeded
  if (record.count >= RATE_LIMIT) {
    const retryAfter = Math.ceil((record.resetAt - now) / 1000);

    return new Response(
      JSON.stringify({
        error: {
          message: 'Rate limit exceeded. Please try again later.',
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter,
        },
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': retryAfter.toString(),
          'X-RateLimit-Limit': RATE_LIMIT.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(record.resetAt).toISOString(),
        },
      }
    );
  }

  // Increment counter
  record.count++;

  return; // Continue to next handler
}

/**
 * Clean up expired rate limit records
 */
function cleanupRateLimitMap(now: number): void {
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetAt) {
      rateLimitMap.delete(ip);
    }
  }
}
