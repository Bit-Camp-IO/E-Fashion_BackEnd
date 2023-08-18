import { ResponseTemplate } from '@type/server';
import { HttpStatus, codeToString } from './status';

export function wrappResponse<T>(data: T, status: HttpStatus): ResponseTemplate<T> {
  const response: ResponseTemplate<T> = {
    status: 'success',
    message: codeToString(status),
    data: data,
  };
  return response;
}
