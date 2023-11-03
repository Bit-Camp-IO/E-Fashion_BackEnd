import { AppError } from '../errors';

interface WithError {
  error: Error | AppError;
  result: null;
}

interface WithoutError<T> {
  error: null;
  result: T;
}

export type SafeResult<T> = WithError | WithoutError<T>;
export type AsyncSafeResult<T> = Promise<SafeResult<T>>;
