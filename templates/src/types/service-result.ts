import { ErrorCode, SuccessCode } from '../constants/http-codes';

export type ServiceResult<T = undefined> =
  | {
      ok: true;
      code: SuccessCode;
      message: string;
      data?: T;
    }
  | {
      ok: false;
      code: ErrorCode;
      message: string;
      data?: unknown;
    };
