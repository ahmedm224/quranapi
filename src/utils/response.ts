/**
 * Create a JSON response with proper headers
 * @param data - The data to return
 * @param status - HTTP status code (default: 200)
 * @param headers - Additional headers
 * @returns Response object
 */
export function jsonResponse(
  data: any,
  status: number = 200,
  headers: Record<string, string> = {}
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  });
}

/**
 * Create an error response
 * @param message - Error message
 * @param status - HTTP status code (default: 400)
 * @param code - Optional error code
 * @returns Response object
 */
export function errorResponse(
  message: string,
  status: number = 400,
  code?: string
): Response {
  return jsonResponse(
    {
      error: {
        message,
        code: code || `ERROR_${status}`
      }
    },
    status
  );
}

/**
 * Create a success response with data
 * @param data - The data to return
 * @param headers - Additional headers
 * @returns Response object
 */
export function successResponse(
  data: any,
  headers: Record<string, string> = {}
): Response {
  return jsonResponse(data, 200, headers);
}

/**
 * Create a 404 Not Found response
 * @param resource - The resource that was not found
 * @returns Response object
 */
export function notFoundResponse(resource: string = 'Resource'): Response {
  return errorResponse(`${resource} not found`, 404, 'NOT_FOUND');
}

/**
 * Create a 400 Bad Request response
 * @param message - Error message
 * @returns Response object
 */
export function badRequestResponse(message: string): Response {
  return errorResponse(message, 400, 'BAD_REQUEST');
}

/**
 * Create a 500 Internal Server Error response
 * @param message - Error message (optional, defaults to generic message)
 * @returns Response object
 */
export function serverErrorResponse(message?: string): Response {
  return errorResponse(
    message || 'Internal server error',
    500,
    'INTERNAL_SERVER_ERROR'
  );
}

/**
 * Add CORS headers to a response
 * @param response - The response to add headers to
 * @returns Response with CORS headers
 */
export function addCorsHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

/**
 * Add rate limit headers to a response
 * @param response - The response to add headers to
 * @param rateLimitInfo - Rate limit information from the request
 * @returns Response with rate limit headers
 */
export function addRateLimitHeaders(response: Response, rateLimitInfo?: any): Response {
  if (!rateLimitInfo) {
    return response;
  }

  const headers = new Headers(response.headers);
  headers.set('X-RateLimit-Limit', rateLimitInfo.limit.toString());
  headers.set('X-RateLimit-Remaining', rateLimitInfo.remaining.toString());
  headers.set('X-RateLimit-Reset', rateLimitInfo.reset);

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}
