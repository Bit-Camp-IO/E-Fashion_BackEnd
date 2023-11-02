import { SafeResult } from '@/core/types';
import { HttpStatus } from './status';
import { AppError } from '@/core/errors';

class RequestError extends Error {
  public code: HttpStatus = HttpStatus.InternalServerError;
  constructor(message: string | Error, code?: number) {
    super(message.toString());
    if (code) this.code = code;
  }
  static _500() {
    return new RequestError(
      'We encountered an unexpected error while processing your request.',
      HttpStatus.InternalServerError,
    );
  }
}

export default RequestError;

export function unwrapCore<T>(result: SafeResult<T>): T {
  if (result.error) {
    if (!(result.error instanceof AppError)) {
      throw RequestError._500();
    }
    switch (result.error.type) {
    }
  }
}
