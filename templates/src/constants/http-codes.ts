export const HTTP_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  DEPENDENCY: 424,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export type HttpCode = (typeof HTTP_CODES)[keyof typeof HTTP_CODES];
export type SuccessCode = typeof HTTP_CODES.OK | typeof HTTP_CODES.CREATED;
export type ErrorCode = Exclude<HttpCode, SuccessCode>;
