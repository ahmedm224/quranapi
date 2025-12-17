import { errorResponse, serverErrorResponse } from '../utils/response';

/**
 * Global error handler
 * Catches unhandled errors and returns proper error responses
 */
export function handleError(error: unknown): Response {
  console.error('Unhandled error:', error);

  if (error instanceof Error) {
    // Known error types
    if (error.message.includes('not found') || error.message.includes('Not Found')) {
      return errorResponse(error.message, 404, 'NOT_FOUND');
    }

    if (error.message.includes('Invalid') || error.message.includes('required')) {
      return errorResponse(error.message, 400, 'BAD_REQUEST');
    }

    // Generic error with message
    return serverErrorResponse(error.message);
  }

  // Unknown error type
  return serverErrorResponse('An unexpected error occurred');
}

/**
 * Wrap async handler with error catching
 */
export function withErrorHandling(
  handler: (request: any, env: any, ctx?: any) => Promise<Response>
) {
  return async (request: any, env: any, ctx?: any): Promise<Response> => {
    try {
      return await handler(request, env, ctx);
    } catch (error) {
      return handleError(error);
    }
  };
}
