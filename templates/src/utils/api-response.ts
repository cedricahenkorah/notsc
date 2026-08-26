import { Response } from 'express';
import { ApiResponse } from '../types/api-response';
import { ServiceResult } from '../types/service-result';

export function apiResponse<T>(res: Response, result: ServiceResult<T>): void {
  const statusCode = result.code;

  const response: ApiResponse<T> = {
    status: result.ok ? 'success' : 'error',
    code: statusCode,
    message: result.message,
    data: result.data,
  };

  res.status(statusCode).json(response);
}
