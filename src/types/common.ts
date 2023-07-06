interface WithError {
  error: Error;
  result: null;
}

interface WithoutError<T> {
  error: null;
  result: T;
}

export type SafeResult<T> = WithError | WithoutError<T>;