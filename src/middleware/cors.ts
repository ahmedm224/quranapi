import { IRequest } from 'itty-router';

/**
 * CORS middleware - handles preflight requests and adds CORS headers
 */
export function corsMiddleware(request: IRequest): Response | void {
  // Handle preflight OPTIONS requests
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Range',
        'Access-Control-Max-Age': '86400', // 24 hours
      },
    });
  }

  // Continue to next middleware/handler
  return;
}

/**
 * Add CORS headers to any response
 */
export function addCorsHeaders(response: Response): Response {
  const headers = new Headers(response.headers);

  // Add CORS headers
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Range');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
