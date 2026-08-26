export type ApiResponse<T = undefined> = {
  status: 'success' | 'error';
  code: number;
  message?: string;
  data?: T | unknown;
};
